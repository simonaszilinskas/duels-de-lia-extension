# Duels de l'IA – extension Chrome

## Objectif

L'extension fournit un kit d'animation pour l'atelier pédagogique « Les Duels
de l'IA ». Elle accompagne compar:IA sans modifier le fonctionnement de l'arène.

## Périmètre d'activation

Le script de contenu est injecté sur tout le domaine
`comparia.beta.gouv.fr` et ses sous-domaines. L'arène se trouve à la racine du
site, `https://comparia.beta.gouv.fr/`. Le panneau reste donc disponible lors
de la navigation vers le catalogue `/models`, le classement `/ranking` et les
autres pages du site.

## Interface

- Un bouton flottant, placé en bas à droite, ouvre et ferme le kit d'animation.
- Le panneau est déplaçable par son en-tête et reste contenu dans la fenêtre.
  Il ne bloque pas les interactions avec compar:IA.
- La vue principale affiche le déroulé d'un duel et quatre entrées : prompts,
  cartes débat, ressources et FAQ.
- Les prompts et la FAQ se déplient dans le panneau. Les cartes débat sont
  tirées aléatoirement et peuvent recevoir une note temporaire.
- Les sept supports HTML s'ouvrent dans une visionneuse plein écran embarquée.
- Le lien « Le jeu en vaut-il la chandelle ? » ouvre le débat final, puis donne
  accès au récapitulatif de session ou à d'autres cartes débat.
- La rubrique « Retours » présente un QR code vers le formulaire participant
  et un bouton ouvrant le formulaire facilitateur.

Le panneau ne comporte pas d'onglets thématiques « Impact environnemental »,
« Biais » ou « Souveraineté numérique ».

## Architecture technique

L'extension utilise Manifest V3, sans étape de compilation, script d'arrière-plan
ni permission Chrome. Le script `js/content-redesign.js` construit l'interface
en JavaScript natif ; `css/new-styles.css` fournit les styles.

Les contenus de l'atelier sont centralisés dans `data/content-data.json`. Les
supports sont des pages HTML autonomes dans `data/slides/`, avec une feuille de
style et un script de navigation communs. Les ressources nécessaires au panneau
sont déclarées dans `web_accessible_resources` du manifeste.

## Contraintes

- Le panneau et le bouton utilisent le préfixe `duelsia-` pour limiter les
  collisions avec la page hôte.
- Aucun script en ligne ni gestionnaire HTML de type `onclick` n'est admis dans
  les supports, conformément à la politique de sécurité de Manifest V3.
- L'extension ne collecte ni ne transmet automatiquement de données. Les deux
  formulaires Typeform ne sont accessibles qu'à la suite d'une action volontaire.
