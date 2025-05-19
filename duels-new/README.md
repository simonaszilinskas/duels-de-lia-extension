# Duels de l'IA - Extension Chrome

Extension Chrome pour l'atelier pédagogique "Duel de l'IA" sur Comparia.

## Installation

1. Clonez ce dépôt ou téléchargez le code source
2. Ouvrez Chrome et allez dans `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant l'extension

## Utilisation

1. Naviguez vers https://comparia.beta.gouv.fr/arene
2. Un bouton flottant (FAB) apparaîtra en bas à droite
3. Cliquez sur le bouton pour ouvrir l'interface
4. Explorez les trois onglets thématiques :
   - Impact environnemental ✅
   - Biais (à venir)
   - Souveraineté numérique (à venir)

## Structure

```
duels-new/
├── manifest.json
├── js/
│   ├── content.js
│   └── content-data.js
├── css/
│   └── styles.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Fonctionnalités

- ✅ Activation uniquement sur l'URL spécifique
- ✅ Bouton flottant (FAB)
- ✅ Interface modale avec onglets
- ✅ Contenu pour l'impact environnemental
- ✅ Boutons interactifs (Prompt, Cartes débat, Ressources, FAQ)
- ✅ Question ultime révélable
- ✅ Architecture modulaire et extensible

## Développement

Le contenu est facilement modifiable dans le fichier `js/content.js` dans l'objet `CONTENT_DATA`.

Pour ajouter du contenu aux autres onglets, modifiez les sections correspondantes dans `CONTENT_DATA.bias` et `CONTENT_DATA.sovereignty`.

## Note

Les icônes sont actuellement des placeholders. Remplacez-les par de vraies icônes PNG aux dimensions appropriées :
- icon16.png : 16x16 pixels
- icon48.png : 48x48 pixels
- icon128.png : 128x128 pixels