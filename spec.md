# Spécification Technique - Extension des Duels de l'IA

## Structure de l'extension

- `manifest.json` : Configuration de l'extension Chrome
- `src/js/background.js` : Script en arrière-plan
- `src/js/content.js` : Script injecté dans la page ComparIA
- `src/js/modules/` : Modules JavaScript pour l'organisation du code
  - `config.js` : Configuration des parcours et étapes
  - `components.js` : Composants UI réutilisables
  - `guides.js` : Création des guides pour différentes pages
  - `utils.js` : Fonctions utilitaires
  - `styles.js` : Styles dynamiques
- `src/css/` : Styles pour le contenu injecté et le popup
  - `content.css` : Styles principaux pour l'interface injectée
  - `popup.css` : Styles pour le popup de l'extension
  - `facilitator-styles.css` : Styles spécifiques pour les tâches facilitateur
- `src/html/` : Fichiers HTML pour le popup
- `src/images/` : Icônes et ressources graphiques

## Fonctionnement

1. **Détection de la page ComparIA** :
   - Vérification du domaine `comparia.beta.gouv.fr`
   - Identification de la page spécifique (accueil, sélection, duel)

2. **Affichage du guide** :
   - Bouton flottant (FAB) en bas à droite de l'écran
   - Guide latéral affichant les étapes pertinentes
   - Contenu adapté à la page courante
   - Support pour afficher/masquer les tâches facilitateur

3. **Gestion des parcours** :
   - Structure modulaire avec `workshopPaths` pour définir les parcours
   - `stepsLibrary` pour décrire chaque étape
   - Support pour plusieurs parcours alternatifs (désactivé actuellement)

4. **Types d'étapes** :
   - Étapes principales (type "main") - Instructions pédagogiques visibles pour tous
   - Étapes facilitateur (type "facilitator") - Instructions techniques pour les animateurs
   - Callouts pour information spéciale (important, info, warning, success)
   - Support pour images et GIFs explicatifs
   - Suggestions copiables en un clic avec support pour personas

## Fonctionnalités spécifiques

1. **Tâches facilitateur** :
   - Style visuel distinct (opacité réduite, typographie plus légère, couleur grisée)
   - Bouton dédié pour afficher/masquer ces tâches
   - Persistance de l'état de visibilité lors de la navigation
   - Possibilité de personalization via `facilitator-styles.css`

2. **Interface utilisateur adaptative** :
   - Design responsive pour différentes tailles d'écran
   - Accordéons pour organiser les étapes sur les pages de duel
   - Styles visuels différenciés pour les étapes principales vs facilitateur

3. **Personnalisation de contenu** :
   - Support pour différentes personas dans les suggestions de prompts
   - Système de toggle pour afficher/masquer les suggestions
   - Système de ressources pédagogiques organisées par catégories

## Personnalisation

Chaque étape peut avoir les propriétés suivantes :

```javascript
{
  id: "step_id",           // Identifiant unique
  order: 1,                // Ordre d'affichage
  title: "Titre étape",    // Titre affiché
  instruction: "Texte...", // Instructions
  pages: ["page1", "page2"], // Pages où l'étape s'affiche
  type: "main" | "facilitator", // Type d'étape (principale ou facilitateur)
  suggestions: ["Persona : Texte prompt", "Persona 2 : Autre prompt"],
  resources: [{ title: "Titre", url: "https://..." }],
  media: [{ type: "image", url: "path", alt: "texte", caption: "légende" }],
  callout: { type: "important", icon: "💡", title: "Important", content: "Texte..." }
}
```

## Ressources Partagées

Les ressources communes (prompts, guides, etc.) sont définies dans `commonResources` :

```javascript
commonResources: {
  promptSuggestions: [], // Suggestions de prompts avec persona
  facilitatorGuide: { title: "Guide du facilitateur", url: "..." },
  educationalResources: [], // Ressources pédagogiques
}
```

## État technique actuel

L'extension est actuellement fonctionnelle avec les spécifications suivantes :

1. **Interface utilisateur** :
   - Guide d'étapes adapté au contexte de la page
   - Style visuel cohérent avec le site ComparIA
   - Support pour différentes pages (accueil, sélection de modèles, duel)

2. **Gestion des étapes facilitateur** :
   - Style distinct pour les tâches facilitateur (opacité réduite, texte plus petit, grisé)
   - Bouton dans la barre de navigation pour afficher/masquer ces tâches
   - Application de styles via CSS et JavaScript pour garantir la cohérence

3. **Expérience utilisateur** :
   - Animations subtiles pour la navigation
   - Support pour copier les suggestions de prompts
   - Interface responsive adaptée à différentes tailles d'écran

## Roadmap technique future

<!-- À compléter par le facilitateur -->
[Vos priorités pour l'évolution de l'extension peuvent être décrites ici, telles que l'ajout de nouvelles fonctionnalités, l'amélioration de l'interface utilisateur, etc.]