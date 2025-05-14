# Extension "Les Duels de l'IA"

Extension Chrome pour faciliter l'animation des ateliers "Les Duels de l'IA".

## 🚀 Installation

1. Téléchargez ou clonez ce dépôt
2. Ouvrez Chrome, allez dans `chrome://extensions/`
3. Activez le "Mode développeur" (en haut à droite)
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant l'extension

## 🧩 Fonctionnalités

- Guide d'étapes pour animer l'atelier sur [ComparIA](https://comparia.beta.gouv.fr)
- Suggestions de prompts pour les participants
- Ressources documentaires sur l'IA frugale
- Interface compacte pour ne pas gêner l'utilisation de ComparIA

## 📝 Personnalisation

Pour modifier les étapes, prompts et ressources, modifiez les variables au début du fichier `/src/js/content.js` :

```javascript
// Structure des parcours d'atelier
const workshopPaths = { ... }

// Bibliothèque d'étapes réutilisables
const stepsLibrary = { ... }

// Ressources communes
const commonResources = { ... }
```

## 📄 Licence

[MIT](LICENSE)