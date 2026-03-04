/**
 * MOCK DATA — Mode test frontend sans backend Supabase
 *
 * Comptes de test :
 *   client@test.com  / test123
 *   avocat@test.com  / test123
 *   admin@test.com   / test123
 */

// ──────────────────────────────────────────────────────────────
// Users (auth uniquement — email + mot de passe)
// ──────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 'client-001', email: 'client@test.com', password: 'test123' },
  { id: 'avocat-001', email: 'avocat@test.com', password: 'test123' },
  { id: 'avocat-002', email: 'marie.leblanc@avocat.fr', password: 'test123' },
  { id: 'admin-001', email: 'admin@test.com', password: 'test123' },
]

// ──────────────────────────────────────────────────────────────
// Profiles (table `profiles`)
// ──────────────────────────────────────────────────────────────
export const MOCK_PROFILES = [
  {
    id: 'client-001',
    nom: 'Dupont',
    prenom: 'Sophie',
    email: 'client@test.com',
    role: 'client',
    telephone: '+33 6 12 34 56 78',
    photo_url: null,
    created_at: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'avocat-001',
    nom: 'Martin',
    prenom: 'Alexandre',
    email: 'avocat@test.com',
    role: 'avocat',
    telephone: '+33 1 23 45 67 89',
    specialite: 'Droit de la famille',
    ville: 'Paris',
    adresse: '12 rue de la Paix, 75001 Paris',
    description:
      'Avocat au barreau de Paris depuis 15 ans, spécialisé en droit de la famille et des successions. Disponible pour vous accompagner dans toutes vos démarches.',
    tarif: 150,
    aide_juridictionnelle: true,
    cal_link: '',
    photo_url: null,
    created_at: '2024-01-10T09:00:00.000Z',
  },
  {
    id: 'avocat-002',
    nom: 'Leblanc',
    prenom: 'Marie',
    email: 'marie.leblanc@avocat.fr',
    role: 'avocat',
    telephone: '+33 4 78 90 12 34',
    specialite: 'Droit du travail',
    ville: 'Lyon',
    adresse: '5 place Bellecour, 69002 Lyon',
    description:
      'Spécialiste en droit du travail et droit social. Défense des salariés et des employeurs dans toutes les procédures prud\'homales.',
    tarif: 120,
    aide_juridictionnelle: false,
    cal_link: '',
    photo_url: null,
    created_at: '2024-01-12T11:00:00.000Z',
  },
  {
    id: 'admin-001',
    nom: 'Admin',
    prenom: 'Super',
    email: 'admin@test.com',
    role: 'admin',
    telephone: null,
    photo_url: null,
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

// ──────────────────────────────────────────────────────────────
// Cases (table `cases`)
// ──────────────────────────────────────────────────────────────
export const MOCK_CASES = [
  {
    id: 'case-001',
    titre: "Divorce à l'amiable",
    description:
      'Procédure de divorce par consentement mutuel. Répartition des biens et garde partagée des enfants à formaliser.',
    client_id: 'client-001',
    avocat_id: 'avocat-001',
    statut: 'en_cours',
    created_at: '2024-02-01T10:00:00.000Z',
    updated_at: '2024-02-15T14:00:00.000Z',
  },
  {
    id: 'case-002',
    titre: 'Litige locatif — Dépôt de garantie',
    description:
      "Réclamation du remboursement du dépôt de garantie suite au départ du logement. Le propriétaire refuse de restituer la somme sans justification.",
    client_id: 'client-001',
    avocat_id: 'avocat-001',
    statut: 'en_attente',
    created_at: '2024-02-10T09:00:00.000Z',
    updated_at: '2024-02-10T09:00:00.000Z',
  },
  {
    id: 'case-003',
    titre: 'Succession parentale',
    description:
      "Ouverture de succession suite au décès d'un parent. Inventaire et partage des biens mobiliers et immobiliers.",
    client_id: 'client-001',
    avocat_id: 'avocat-001',
    statut: 'termine',
    created_at: '2024-01-05T14:00:00.000Z',
    updated_at: '2024-01-20T16:00:00.000Z',
  },
]

// ──────────────────────────────────────────────────────────────
// Documents (table `documents`)
// ──────────────────────────────────────────────────────────────
export const MOCK_DOCUMENTS = [
  {
    id: 'doc-001',
    case_id: 'case-001',
    name: 'Acte de mariage.pdf',
    file_path: 'mock/acte-mariage.pdf',
    file_size: 245000,
    uploaded_by: 'client-001',
    created_at: '2024-02-02T10:00:00.000Z',
  },
  {
    id: 'doc-002',
    case_id: 'case-001',
    name: 'Convention de divorce.pdf',
    file_path: 'mock/convention-divorce.pdf',
    file_size: 312000,
    uploaded_by: 'avocat-001',
    created_at: '2024-02-05T15:00:00.000Z',
  },
  {
    id: 'doc-003',
    case_id: 'case-002',
    name: 'Bail de location.pdf',
    file_path: 'mock/bail.pdf',
    file_size: 180000,
    uploaded_by: 'client-001',
    created_at: '2024-02-11T09:00:00.000Z',
  },
  {
    id: 'doc-004',
    case_id: 'case-003',
    name: 'Certificat de décès.pdf',
    file_path: 'mock/certificat-deces.pdf',
    file_size: 95000,
    uploaded_by: 'client-001',
    created_at: '2024-01-06T10:00:00.000Z',
  },
  {
    id: 'doc-005',
    case_id: 'case-003',
    name: 'Acte notarié — Partage.pdf',
    file_path: 'mock/acte-notarie.pdf',
    file_size: 420000,
    uploaded_by: 'avocat-001',
    created_at: '2024-01-18T14:00:00.000Z',
  },
]
