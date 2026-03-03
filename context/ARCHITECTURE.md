# Architecture Technique - MonAvocatDirect

## Vue d'ensemble

```
┌─────────────────────────────────────────────┐
│                 Frontend                      │
│            React + Vite + Tailwind            │
│                                               │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐ │
│  │  Pages   │  │Components│  │  Contexts    │ │
│  │  (views) │  │  (UI)    │  │  (state)     │ │
│  └────┬─────┘  └────┬─────┘  └──────┬──────┘ │
│       │              │               │         │
│       └──────────────┼───────────────┘         │
│                      │                         │
└──────────────────────┼─────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│               Supabase (BaaS)                │
│                                               │
│  ┌──────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Auth │  │ Database  │  │   Storage     │  │
│  │      │  │ (Postgres)│  │ (fichiers)    │  │
│  └──────┘  └──────────┘  └───────────────┘  │
│                                               │
│  ┌──────────────────┐  ┌──────────────────┐  │
│  │  RLS Policies    │  │  Edge Functions  │  │
│  │  (sécurité)      │  │  (optionnel)     │  │
│  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────┘
```

## Base de Données

### Tables

#### profiles
Liée à `auth.users` via trigger. Contient toutes les infos utilisateur.
```
profiles
├── id (uuid, PK, FK -> auth.users)
├── email, nom, prenom
├── role (client | avocat | admin)
├── telephone, specialite, ville
├── description, photo_url, tarif
├── aide_juridictionnelle, cal_link
├── is_verified, created_at, updated_at
```

#### cases (dossiers)
```
cases
├── id (uuid, PK)
├── titre, description
├── statut (en_attente | en_cours | termine)
├── client_id (FK -> profiles)
├── avocat_id (FK -> profiles)
├── created_at, updated_at
```

#### documents
```
documents
├── id (uuid, PK)
├── case_id (FK -> cases)
├── name, file_path, file_size
├── uploaded_by (FK -> profiles)
├── created_at
```

### Sécurité (RLS)
- **profiles**: lecture publique pour les avocats, lecture/écriture privée pour son propre profil
- **cases**: accès limité au client et à l'avocat du dossier
- **documents**: accès limité aux participants du dossier

## Storage

### Buckets
- **avatars**: Photos de profil des avocats
  - Chemin: `{user_id}/avatar.{ext}`
  - Public en lecture
- **documents**: Documents des dossiers
  - Chemin: `{case_id}/{filename}`
  - Privé, accès via RLS

## Routing

```
/ .......................... Page d'accueil
/search .................... Recherche d'avocats
/lawyer/:id ................ Profil public avocat
/login ..................... Connexion
/register .................. Inscription
/forgot-password ........... Mot de passe oublié
/reset-password ............ Réinitialisation
/dashboard ................. Redirection selon rôle
/client/dashboard .......... Dashboard client
/client/cases .............. Liste dossiers client
/client/cases/new .......... Nouveau dossier
/client/cases/:id .......... Détail dossier client
/avocat/dashboard .......... Dashboard avocat
/avocat/cases .............. Liste dossiers avocat
/avocat/cases/:id .......... Détail dossier avocat
/avocat/profile ............ Édition profil avocat
/admin/dashboard ........... Dashboard admin
```

## Flux Utilisateur

### Client
1. Inscription → Vérification email → Connexion
2. Recherche avocat → Consultation profil → Prise de RDV (Cal.com)
3. Création dossier → Upload documents → Suivi du statut

### Avocat
1. Inscription → Complétion profil → Vérification
2. Réception dossiers → Changement de statut → Consultation documents
3. Configuration Cal.com pour les rendez-vous

### Admin
1. Connexion → Dashboard → Gestion utilisateurs
2. Suppression de comptes si nécessaire

## Déploiement
- Frontend : Vercel, Netlify ou autre hébergeur statique
- Backend : Supabase (hébergé)
- Variables d'environnement requises : voir `.env.example`
