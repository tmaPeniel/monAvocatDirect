/**
 * Mock Supabase client — remplace le vrai client quand VITE_MOCK_MODE=true
 * Implémente l'API Supabase (auth + query builder + storage) avec des données en dur.
 */
import { MOCK_USERS, MOCK_PROFILES, MOCK_CASES, MOCK_DOCUMENTS } from './mockData'

// ──────────────────────────────────────────────────────────────
// Store en mémoire (copie des données mock, mutable en session)
// ──────────────────────────────────────────────────────────────
const store = {
  profiles: [...MOCK_PROFILES],
  cases: [...MOCK_CASES],
  documents: [...MOCK_DOCUMENTS],
}

// ──────────────────────────────────────────────────────────────
// AUTH MOCK
// ──────────────────────────────────────────────────────────────
const MOCK_SESSION_KEY = 'mock_supabase_session'

// Restaurer la session depuis localStorage au chargement du module
let currentSession = (() => {
  try {
    const saved = localStorage.getItem(MOCK_SESSION_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
})()

const authListeners = []

const notifyListeners = (event, session) => {
  authListeners.forEach((cb) => cb(event, session))
}

const mockAuth = {
  getSession: async () => {
    return { data: { session: currentSession }, error: null }
  },

  onAuthStateChange: (callback) => {
    authListeners.push(callback)
    // Notifie immédiatement avec l'état courant
    setTimeout(() => callback('INITIAL_SESSION', currentSession), 0)
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const idx = authListeners.indexOf(callback)
            if (idx > -1) authListeners.splice(idx, 1)
          },
        },
      },
    }
  },

  signInWithPassword: async ({ email, password }) => {
    const mockUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (!mockUser) {
      const err = { message: 'Email ou mot de passe incorrect' }
      return { data: null, error: err }
    }
    const user = { id: mockUser.id, email: mockUser.email }
    currentSession = { user }
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(currentSession))
    // Différer au prochain tick pour éviter la race condition avec fetchProfile
    setTimeout(() => notifyListeners('SIGNED_IN', currentSession), 0)
    return { data: { user, session: currentSession }, error: null }
  },

  signUp: async ({ email, password, options }) => {
    const newId = 'new-' + Date.now()
    const user = { id: newId, email }
    const role = options?.data?.role || 'client'
    const { nom = '', prenom = '' } = options?.data || {}
    store.profiles.push({
      id: newId,
      email,
      role,
      nom,
      prenom,
      photo_url: null,
      created_at: new Date().toISOString(),
    })
    return { data: { user }, error: null }
  },

  signOut: async () => {
    currentSession = null
    localStorage.removeItem(MOCK_SESSION_KEY)
    notifyListeners('SIGNED_OUT', null)
    return { error: null }
  },

  resetPasswordForEmail: async () => {
    return { error: null }
  },

  updateUser: async () => {
    return { data: {}, error: null }
  },
}

// ──────────────────────────────────────────────────────────────
// QUERY BUILDER HELPERS
// ──────────────────────────────────────────────────────────────

/**
 * Parse les relations imbriquées dans un select string.
 * Exemple : '*, avocat:avocat_id(id, nom, prenom)' → [{ alias, fk, fields }]
 */
function parseRelations(selectStr) {
  const relations = []
  const regex = /(\w+):(\w+)\(([^)]+)\)/g
  let match
  while ((match = regex.exec(selectStr)) !== null) {
    relations.push({
      alias: match[1],
      fk: match[2],
      fields: match[3].split(',').map((f) => f.trim()),
    })
  }
  return relations
}

/**
 * Résout les relations pour un item (join manuel depuis store.profiles).
 */
function resolveRelations(item, relations) {
  const resolved = { ...item }
  for (const rel of relations) {
    const fkValue = item[rel.fk]
    const relatedProfile = fkValue
      ? store.profiles.find((p) => p.id === fkValue)
      : null
    if (relatedProfile) {
      const relData = {}
      rel.fields.forEach((f) => {
        relData[f] = relatedProfile[f] ?? null
      })
      resolved[rel.alias] = relData
    } else {
      resolved[rel.alias] = null
    }
  }
  return resolved
}

// ──────────────────────────────────────────────────────────────
// QUERY BUILDER
// ──────────────────────────────────────────────────────────────
class MockQueryBuilder {
  constructor(tableName) {
    this.tableName = tableName
    this.filters = []
    this.selectStr = '*'
    this.countMode = false
    this.headMode = false
    this._isSingle = false
    this._isMaybeSingle = false
    this._limit = null
    this._rangeStart = null
    this._rangeEnd = null
    this._pending = 'select'
    this._insertRows = null
    this._updateValues = null
  }

  select(fields = '*', options = {}) {
    this.selectStr = fields
    if (options.count === 'exact') this.countMode = true
    if (options.head === true) this.headMode = true
    return this
  }

  eq(field, value) {
    this.filters.push({ type: 'eq', field, value })
    return this
  }

  neq(field, value) {
    this.filters.push({ type: 'neq', field, value })
    return this
  }

  in(field, values) {
    this.filters.push({ type: 'in', field, values })
    return this
  }

  order() {
    // no-op : les données sont déjà triées par created_at desc
    return this
  }

  limit(n) {
    this._limit = n
    return this
  }

  range(start, end) {
    this._rangeStart = start
    this._rangeEnd = end
    return this
  }

  single() {
    this._isSingle = true
    return this._execute()
  }

  maybeSingle() {
    this._isSingle = true
    this._isMaybeSingle = true
    return this._execute()
  }

  insert(rows) {
    this._pending = 'insert'
    this._insertRows = Array.isArray(rows) ? rows : [rows]
    return this
  }

  update(values) {
    this._pending = 'update'
    this._updateValues = values
    return this
  }

  delete() {
    this._pending = 'delete'
    return this
  }

  // ── Filtrage ──────────────────────────────────────────────
  _applyFilters(data) {
    return data.filter((item) =>
      this.filters.every((f) => {
        if (f.type === 'eq') return item[f.field] === f.value
        if (f.type === 'neq') return item[f.field] !== f.value
        if (f.type === 'in') return f.values.includes(item[f.field])
        return true
      })
    )
  }

  // ── Exécution ─────────────────────────────────────────────
  _execute() {
    const tableData = store[this.tableName] || []

    // INSERT
    if (this._pending === 'insert') {
      const newRows = this._insertRows.map((row) => ({
        id: 'mock-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...row,
      }))
      store[this.tableName] = [...tableData, ...newRows]
      return Promise.resolve({ data: newRows, error: null })
    }

    // UPDATE
    if (this._pending === 'update') {
      const updated = []
      store[this.tableName] = tableData.map((item) => {
        const match = this.filters.every((f) => {
          if (f.type === 'eq') return item[f.field] === f.value
          return true
        })
        if (match) {
          const newItem = {
            ...item,
            ...this._updateValues,
            updated_at: new Date().toISOString(),
          }
          updated.push(newItem)
          return newItem
        }
        return item
      })
      return Promise.resolve({ data: updated, error: null })
    }

    // DELETE
    if (this._pending === 'delete') {
      const toDelete = this._applyFilters(tableData)
      store[this.tableName] = tableData.filter(
        (item) => !toDelete.includes(item)
      )
      return Promise.resolve({ data: toDelete, error: null })
    }

    // SELECT
    let data = this._applyFilters(tableData)

    // Pagination / limit
    if (this._rangeStart !== null) {
      data = data.slice(this._rangeStart, (this._rangeEnd ?? data.length - 1) + 1)
    }
    if (this._limit !== null) {
      data = data.slice(0, this._limit)
    }

    // Count query (head:true = ne retourne que le count)
    if (this.countMode && this.headMode) {
      return Promise.resolve({ data: null, count: data.length, error: null })
    }
    if (this.countMode) {
      return Promise.resolve({ data, count: data.length, error: null })
    }

    // Résolution des relations
    const relations = parseRelations(this.selectStr)
    if (relations.length > 0) {
      data = data.map((item) => resolveRelations(item, relations))
    }

    // Single
    if (this._isSingle) {
      return Promise.resolve({ data: data[0] ?? null, error: null })
    }

    return Promise.resolve({ data, error: null })
  }

  // Rend le builder "thenable" (compatible avec await)
  then(resolve, reject) {
    return this._execute().then(resolve, reject)
  }

  catch(reject) {
    return this._execute().catch(reject)
  }
}

// ──────────────────────────────────────────────────────────────
// STORAGE MOCK
// ──────────────────────────────────────────────────────────────
const mockStorageFrom = () => ({
  upload: async (path) => ({ data: { path }, error: null }),
  download: async () => ({
    data: new Blob(['mock file content'], { type: 'application/octet-stream' }),
    error: null,
  }),
  remove: async (paths) => ({ data: paths, error: null }),
  getPublicUrl: () => ({ data: { publicUrl: '' } }),
  createSignedUrl: async () => ({ data: { signedUrl: '' }, error: null }),
  list: async () => ({ data: [], error: null }),
})

// ──────────────────────────────────────────────────────────────
// EXPORT — Client mock complet
// ──────────────────────────────────────────────────────────────
export const mockSupabase = {
  auth: mockAuth,
  from: (tableName) => new MockQueryBuilder(tableName),
  storage: { from: mockStorageFrom },
}
