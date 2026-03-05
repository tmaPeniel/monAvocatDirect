# Règles de Développement - MonAvocatDirect

## Conventions de Code

### Général
- Code en **anglais** pour les variables et fonctions
- Commentaires et UI en **français**
- Utiliser des composants fonctionnels React avec hooks
- Pas de classes React

### Nommage
- **Composants**: PascalCase (`LawyerCard.jsx`)
- **Fichiers utilitaires**: camelCase (`supabase.js`)
- **Constantes**: UPPER_SNAKE_CASE (`CASE_STATUS`)
- **Variables/fonctions**: camelCase (`fetchProfile`)
- **CSS classes**: kebab-case via Tailwind (`btn-primary`)

### Structure des fichiers
- Un composant par fichier
- Imports groupés : React, bibliothèques externes, composants locaux, utilitaires
- Exports nommés pour les hooks, exports par défaut pour les composants

### Identité visuelle

**Logo**
- Fichier : `public/Logo.png`
- Intégration : `<img src="/Logo.png" alt="Mon Avocat Direct" className="h-8 w-auto" />`
- Ne jamais remplacer le logo par du texte ou une icône SVG générique

**Typographie**
- Titres (h1–h6) : **League Spartan** → classe Tailwind `font-heading`
- Corps / interface : **Poppins** → classe Tailwind `font-sans` (défaut)
- Les deux polices sont déclarées dans `tailwind.config.js` et chargées via `index.html`
- Ne pas utiliser de `style={{ fontFamily: ... }}` inline

**Palette de couleurs — 3 couleurs**
- `primary` (rouge) — boutons principaux, liens, focus rings, accents
  `primary-500` = #d90429 · `primary-600` = #b80024 · `primary-800` = #7b0019
- Noir `bg-black` / `bg-[#1a1a1a]` — Navbar, sidebars, en-têtes de bannière
- Blanc `#ffffff` — fonds de page, cartes
- Gris — fonds (`gray-50`), bordures (`gray-100/200`), textes secondaires (`gray-500`)

> Toute autre couleur (bleu, doré, etc.) est **proscrite**. N'utiliser que rouge/noir/blanc/gris.

### Tailwind CSS
- Utiliser les classes utilitaires Tailwind en priorité
- Classes personnalisées dans `index.css` avec `@layer components`
- Respecter la palette et les polices définies ci-dessus

### Sécurité
- **Row Level Security (RLS)** obligatoire sur toutes les tables
- Les clients ne voient que leurs propres dossiers
- Les avocats ne voient que les dossiers qui leur sont assignés
- Les admins ont accès à tout
- Validation côté client ET côté serveur (RLS)
- Jamais de données sensibles dans le frontend

### Supabase
- Utiliser le client Supabase via `src/lib/supabase.js`
- Variables d'environnement préfixées par `VITE_`
- Storage : buckets `documents` et `avatars`
- Auth : Supabase Auth avec trigger `handle_new_user`

### Git
- Commits en anglais, descriptifs
- Une fonctionnalité par commit
- Branche de développement : `claude/lawyer-booking-mvp-frPDo`

### Pages Dashboard obligatoires

**Chaque type d'utilisateur DOIT avoir sa propre page Dashboard** accessible via la sidebar :

| Rôle | Route | Fichier |
|------|-------|---------|
| `client` | `/client/dashboard` | `src/pages/client/ClientDashboard.jsx` |
| `avocat` | `/avocat/dashboard` | `src/pages/lawyer/LawyerDashboard.jsx` |
| `admin`  | `/admin/dashboard`  | `src/pages/admin/AdminDashboard.jsx` |

- Le lien "Dashboard" (icône `Home`) doit figurer en **premier** dans la sidebar de chaque rôle
- La page Dashboard affiche toujours : message de bienvenue, statistiques clés, activité récente
- `DashboardRedirect` dans `App.jsx` redirige `/dashboard` vers le bon tableau de bord selon le rôle

## Règles Métier

### Dossiers
- Statuts possibles : `en_attente`, `en_cours`, `termine`
- Un client crée un dossier, il est en `en_attente`
- L'avocat peut changer le statut
- Les deux parties peuvent uploader des documents

### Documents
- Stockés dans Supabase Storage bucket `documents`
- Chemin : `{case_id}/{filename}`
- Limite de taille recommandée : 10 Mo par fichier
- Types acceptés : PDF, images, documents Office

### Profil Avocat
- Doit être vérifié (`is_verified`) pour apparaître dans la recherche
- Lien Cal.com optionnel pour la prise de rendez-vous
- Photo stockée dans le bucket `avatars`

## Données — Règle fondamentale

**Jamais de données en dur directement dans le code.**
Toutes les données statiques, de configuration ou mock doivent être placées dans des fichiers JSON du dossier `src/data/` et importées dans les composants.

### Structure `src/data/`

| Dossier | Usage | Exemples |
|---------|-------|---------|
| `src/data/mock/` | Données fictives (remplacées par API en production) | `lawyers.json`, `cases.json`, `conversations.json` |
| `src/data/static/` | Données immuables / référentiels | `specialites.json`, `villes.json`, `aide-juridictionnelle.json` |
| `src/data/config/` | Configuration UI / paramètres applicatifs | `availability.json` |

### Règles

- Un composant **ne doit jamais** déclarer un tableau ou objet de données de plus de 3 éléments inline
- Les constantes UPPER_SNAKE_CASE dans les composants doivent pointer vers un import JSON, pas une valeur littérale
- Les seuils métier (plafonds, montants, délais) sont dans les JSON, pas dans la logique JS
- Nommer les fichiers JSON en kebab-case : `aide-juridictionnelle.json`
- Cette architecture facilite le remplacement par de vraies API Supabase sans modifier les composants
