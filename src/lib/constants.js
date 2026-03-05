import specialitesData from '../data/static/specialites.json'
import villesData      from '../data/static/villes.json'

export const ROLES = {
  CLIENT: 'client',
  AVOCAT: 'avocat',
  ADMIN:  'admin',
}

export const CASE_STATUS = {
  EN_ATTENTE: 'en_attente',
  EN_COURS:   'en_cours',
  TERMINE:    'termine',
}

export const CASE_STATUS_LABELS = {
  en_attente: 'En attente',
  en_cours:   'En cours',
  termine:    'Terminé',
}

export const CASE_STATUS_COLORS = {
  en_attente: 'badge-yellow',
  en_cours:   'badge-blue',
  termine:    'badge-green',
}

export const SPECIALITES = specialitesData
export const VILLES      = villesData
