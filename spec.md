# Spécification Technique

## Structure de l'extension

- `manifest.json` : Configuration de l'extension Chrome
- `src/js/background.js` : Script en arrière-plan
- `src/js/content.js` : Script injecté dans la page ComparIA
- `src/js/popup.js` : Script du popup de l'extension
- `src/css/` : Styles pour le contenu injecté et le popup
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

3. **Gestion des parcours** :
   - Structure modulaire avec `workshopPaths` pour définir les parcours
   - `stepsLibrary` pour décrire chaque étape
   - Support pour plusieurs parcours alternatifs (désactivé actuellement)

4. **Types d'étapes** :
   - Étapes standard avec titre et instructions
   - Callouts pour information spéciale (important, info, warning, success)
   - Support pour images et GIFs explicatifs
   - Suggestions copiables en un clic

## Personnalisation

Chaque étape peut avoir les propriétés suivantes :

```javascript
{
  id: "step_id",           // Identifiant unique
  order: 1,                // Ordre d'affichage
  title: "Titre étape",    // Titre affiché
  instruction: "Texte...", // Instructions
  pages: ["page1", "page2"], // Pages où l'étape s'affiche
  suggestions: ["Suggestion 1", "Suggestion 2"],
  resources: [{ title: "Titre", url: "https://..." }],
  media: [{ type: "image", url: "path", alt: "texte", caption: "légende" }],
  callout: { type: "important", icon: "💡", title: "Important", content: "Texte..." }
}
```

## Ressources Partagées

Les ressources communes (prompts, guides, etc.) sont définies dans `commonResources`.