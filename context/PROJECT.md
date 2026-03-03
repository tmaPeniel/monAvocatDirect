# MonAvocatDirect - Contexte du Projet

## Vision
MonAvocatDirect est une plateforme web de mise en relation entre clients et avocats, inspirée du modèle Doctolib mais dédiée au domaine juridique. L'objectif est de simplifier l'accès aux services juridiques en permettant aux clients de trouver facilement un avocat, prendre rendez-vous et gérer leurs dossiers en ligne.

## Stack Technique
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend/BaaS**: Supabase (Auth, Database PostgreSQL, Storage)
- **Rendez-vous**: Cal.com (intégration via lien externe)
- **Notifications**: React Hot Toast (in-app), OneSignal (push), Email (Supabase)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Upload**: React Dropzone

## Architecture
```
src/
├── components/        # Composants réutilisables
│   └── layout/       # Layout (Navbar, Sidebar, Footer)
├── contexts/         # React Contexts (Auth)
├── lib/              # Configuration (Supabase, constantes)
├── pages/            # Pages de l'application
│   ├── auth/         # Authentification
│   ├── client/       # Espace client
│   ├── lawyer/       # Espace avocat
│   └── admin/        # Espace admin
supabase/
└── schema.sql        # Schéma de base de données
context/
├── PROJECT.md        # Ce fichier
├── RULES.md          # Règles de développement
└── ARCHITECTURE.md   # Architecture technique
```

## Utilisateurs
| Rôle | Description |
|------|-------------|
| Client | Cherche un avocat, prend RDV, uploade des documents, gère ses dossiers |
| Avocat | Crée son profil, reçoit des RDV, consulte documents, gère ses dossiers |
| Admin | Gère les utilisateurs, supervise la plateforme |

## Fonctionnalités MVP
1. **Authentification** - Inscription, connexion, déconnexion, reset mot de passe (Supabase Auth)
2. **Profil avocat** - Profil complet avec spécialité, ville, tarif, aide juridictionnelle
3. **Recherche** - Filtres par ville, spécialité, aide juridictionnelle
4. **Rendez-vous** - Intégration Cal.com via lien externe
5. **Dossiers** - Création, suivi, gestion de statut (en attente, en cours, terminé)
6. **Documents** - Upload drag & drop, download, suppression (Supabase Storage)
7. **Dashboard** - Tableaux de bord personnalisés par rôle
8. **Admin** - Gestion des utilisateurs

## Non inclus dans le MVP
- Paiement en ligne
- Chat/messagerie
- Intelligence artificielle
