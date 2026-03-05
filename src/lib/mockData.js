/**
 * MOCK DATA — Mode test frontend sans backend Supabase
 *
 * Les données sont centralisées dans src/data/mock/*.json
 * Ce fichier les importe et les réexporte pour le client mock Supabase.
 *
 * Comptes de test :
 *   client@test.com  / test123
 *   avocat@test.com  / test123
 *   admin@test.com   / test123
 */

import mockUsers     from '../data/mock/users.json'
import mockProfiles  from '../data/mock/profiles.json'
import mockCases     from '../data/mock/cases.json'
import mockDocuments from '../data/mock/documents.json'

export const MOCK_USERS     = mockUsers
export const MOCK_PROFILES  = mockProfiles
export const MOCK_CASES     = mockCases
export const MOCK_DOCUMENTS = mockDocuments
