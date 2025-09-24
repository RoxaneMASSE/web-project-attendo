# Attendo - Gestion de Présences

## Description

**Attendo** est une application web de gestion de présences développée pour faciliter le suivi des participants lors des sessions d'examens. L'application permet aux enseignants de gérer les locaux, les surveillants et les présences des étudiants de manière intuitive et efficace.

## Fonctionnalités Principales

### Gestion Complète des Sessions
- **Sessions d'examens** : Création et gestion des périodes d'évaluation
- **UEs (Unités d'Enseignement)** : Association des matières aux sessions
- **Épreuves** : Organisation des différents types d'examens (bilan, projet, examen...)
- **Locaux** : Attribution des salles d'examen avec gestion de capacité

### Prise de Présence
- **Interface intuitive** : Clic simple pour marquer présent/absent
- **Suivi en temps réel** : Mise à jour optimiste de l'interface
- **Gestion des capacités** : Alertes en cas de dépassement de capacité des locaux
- **Attribution des surveillants** : Assignation flexible des enseignants responsables

### Authentification Sécurisée
- **OAuth Google** : Connexion via compte Google
- **Protection des routes** : Accès restreint aux fonctionnalités selon l'authentification

## Architecture Technique

### Technologies Utilisées
**Frontend** : Vue.js 3 avec Composition API et Options API hybride
**Styling** : Tailwind CSS pour interface moderne et responsive
**Backend** : Supabase (PostgreSQL + API REST + Authentification)
**State Management** : Pinia pour gestion d'état centralisée
**Routing** : Vue Router avec guards d'authentification

### Structure de l'Application

**Components réutilisables** :
- `BaseTable` : Tableau générique avec tri et actions
- `Breadcrumb` : Navigation contextuelle automatique
- `ClickableCard` : Cartes interactives pour interfaces
- `AuthenticateButton` : Bouton d'authentification Google

**Services organisés** :
- `authStore` : Gestion centralisée de l'authentification
- `sessionDetailService` : CRUD sessions et UEs
- `eventService` : Gestion des épreuves
- `examinationService` : Logique de présence et surveillants

### Navigation Hiérarchique
```
Accueil → Sessions → Session Details → UE Details → Event Rooms → Examinations
```

## Fonctionnalités Avancées

### Interface Utilisateur
- **Design responsive** : Adaptation mobile et desktop
- **Feedback visuel** : États de chargement et validation
- **Navigation intuitive** : Breadcrumb automatique contextuel
- **Interactions optimisées** : Clics directs sur tableaux et cartes

### Gestion des Données
- **Mise à jour optimiste** : Interface réactive avant confirmation serveur  
- **Validation côté client** : Contrôles avant envoi des données
- **Gestion d'erreurs** : Messages explicites et récupération d'état
- **Relations complexes** : Jointures automatiques avec Supabase

### Performance
- **Lazy loading** : Chargement à la demande des vues
- **State persistence** : Conservation de l'état d'authentification
- **API optimisée** : Requêtes ciblées avec sélection de colonnes
- **Cache intelligent** : Réutilisation des données chargées

## Structure de Base de Données

### Entités Principales
**Sessions** : Périodes d'examens avec label et métadonnées
**UEs** : Unités d'enseignement avec codes et compositions
**Events** : Épreuves spécifiques par UE et session
**Rooms** : Locaux avec capacité et identification
**Students** : Étudiants avec PAE (Programme Annuel Étudiant)
**Teachers** : Enseignants avec acronymes et noms complets

### Relations Complexes
- Sessions ↔ UEs via `session_compo`
- Events ↔ Rooms via `examination_room` 
- Students ↔ Examinations pour présences
- Teachers ↔ Examination_rooms pour surveillance

## Configuration et Déploiement

### Variables d'Environnement
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation et Lancement
```bash
npm install
npm run dev
```

### Build Production
```bash
npm run build
```

## Sécurité et Authentification

### Protection des Routes
- **Guards automatiques** : Vérification de session Supabase
- **Redirection intelligente** : Retour vers accueil si non authentifié
- **État persistant** : Maintien de la connexion entre sessions

### Gestion des Permissions
- **Authentification OAuth** : Délégation à Google pour sécurité
- **Validation backend** : Contrôles côté Supabase
- **Session management** : Gestion automatique des tokens

---

**Auteur** : Roxane Masse (g62514)  
**Cours** : 4WEB3D - Développement WEB 3  
**Année** : 2024-2025

*Application développée avec Vue.js 3 moderne - Architecture Supabase - Interface Tailwind CSS*
