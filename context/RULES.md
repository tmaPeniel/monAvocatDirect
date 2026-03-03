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

### Tailwind CSS
- Utiliser les classes utilitaires Tailwind en priorité
- Classes personnalisées dans `index.css` avec `@layer components`
- Palette de couleurs :
  - Primary : bleu (`primary-500` = #1a56db)
  - Gold : doré (`gold-400` = #c8a951)
  - Gris pour les fonds et bordures

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
