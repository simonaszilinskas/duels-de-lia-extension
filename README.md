# Duels de l'IA - Extension Chrome

Extension Chrome pour l'atelier pédagogique "Duel de l'IA" sur Comparia.

## Installation

1. Clonez ce dépôt ou téléchargez le code source
2. Ouvrez Chrome et allez dans `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant l'extension



https://github.com/user-attachments/assets/d8730b18-2955-46f2-a575-dc8ffe3d4454



## Utilisation

1. Naviguez vers https://comparia.beta.gouv.fr
2. Un bouton flottant (FAB) apparaîtra en bas à droite
3. Cliquez sur le bouton pour ouvrir l'interface

## Modifier le contenu

Tout le contenu de l'atelier vit dans `data/content-data.json` : étapes du duel,
personas et prompts, cartes de débat, FAQ, liste des supports.

Les supports de présentation sont des fichiers HTML dans `data/slides/`, un par
sujet. Ils partagent `slides.css` (mise en page) et `slides.js` (navigation aux
flèches, boutons, compteur). Pour modifier une diapositive, ouvrez le fichier et
changez le texte : plus besoin de rouvrir un outil de présentation et de
réexporter un PDF.

Une contrainte à connaître : la politique de sécurité des extensions Chrome
interdit le script en ligne. Un `<script>` ou un `onclick` dans une diapositive
la laisse blanche. Tout le comportement passe par `slides.js`.

## Ce que l'extension enseigne

Les supports décrivent ce que compar:IA affiche réellement : l'énergie estimée
d'une réponse en milliwattheures, une classe énergétique de A à F, des classes
de taille de XS à XL, le matériel nécessaire, le coût, et trois scénarios
d'usage. Le site n'affiche plus d'émissions de CO₂ : les fournisseurs ne
publient pas où tournent leurs serveurs, et les rares chiffres communiqués
reposent sur des méthodes trop différentes pour être comparées.
