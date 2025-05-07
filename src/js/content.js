// content.js - Script that runs directly on the ComparIA website

// Charger la police Marianne
const marianneFont = document.createElement('link');
marianneFont.rel = 'stylesheet';
marianneFont.href = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Bold.woff2';
document.head.appendChild(marianneFont);

// Style global
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  @import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Bold.woff2');
  @import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Regular.woff2');
  @import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Medium.woff2');

  .duels-guide {
    font-family: 'Marianne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border: 1px solid #e6e6e6;
    transition: all 0.3s ease;
    position: fixed;
    top: 20px;
    right: 20px;
    width: 370px;
    max-width: 90vw;
    max-height: 85vh;
    overflow-y: auto;
    background-color: white;
    z-index: 10000;
  }
  
  .duels-guide:not(.open) {
    transform: translateX(calc(100% + 30px));
  }
  
  .duels-header {
    background-color: #6a6af4;
    color: white;
    border-radius: 8px 8px 0 0;
    padding: 15px 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .duels-header h2 {
    margin: 0;
    font-weight: 700;
    font-size: 1.25rem;
    color: white;
  }
  
  .duels-navbar {
    display: flex;
    align-items: center;
  }
  
  .duels-resources-btn {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 50%;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .duels-resources-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
  
  .duels-resources-btn i,
  .duels-paths-btn i {
    font-size: 0.9rem;
  }
  
  .duels-paths-btn {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 50%;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .duels-paths-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
  
  .duels-paths-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    width: 300px;
    max-width: 90vw;
    z-index: 10001;
    display: none;
    padding: 20px;
  }
  
  .duels-paths-dropdown.open {
    display: block;
    animation: fadeIn 0.2s ease;
  }
  
  .duels-dropdown-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
  }
  
  .duels-paths-list {
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .duels-path-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #f5f5f5;
    border-left: 3px solid transparent;
  }
  
  .duels-path-item:hover {
    background-color: #e8e8ff;
    transform: translateY(-1px);
  }
  
  .duels-path-item.active {
    border-left: 3px solid #6a6af4;
    background-color: #f0f0ff;
  }
  
  .duels-path-item i {
    font-size: 18px;
    color: #6a6af4;
    margin-right: 12px;
  }
  
  .duels-path-info {
    flex: 1;
  }
  
  .duels-path-name {
    font-weight: 600;
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
  }
  
  .duels-path-description {
    font-size: 12px;
    color: #666;
  }
  
  .duels-dropdown-close {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 15px;
    padding: 8px;
    background-color: #f0f0ff;
    border: 1px solid #6a6af4;
    color: #6a6af4;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }
  
  .duels-dropdown-close:hover {
    background-color: #6a6af4;
    color: white;
  }
  
  .duels-media-container {
    margin: 10px 0;
  }
  
  .duels-media-image,
  .duels-media-gif {
    max-width: 100%;
    border-radius: 4px;
    border: 1px solid #ddd;
    display: block;
    margin-bottom: 5px;
  }
  
  .duels-media-caption {
    font-size: 12px;
    color: #666;
    font-style: italic;
    margin-bottom: 10px;
  }
  
  /* Styles pour les callouts */
  .duels-callout {
    display: flex;
    padding: 10px 12px;
    margin: 8px 0 12px;
    border-radius: 4px;
    border-left: 4px solid;
  }
  
  .duels-callout-icon {
    font-size: 16px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .duels-callout-content {
    flex: 1;
  }
  
  .duels-callout-title {
    margin-bottom: 4px;
  }
  
  .duels-callout-text {
    font-size: 13px;
    line-height: 1.4;
  }
  
  /* Types de callouts */
  .duels-callout-important {
    background-color: #fff3cd;
    border-color: #ffc107;
    color: #856404;
  }
  
  .duels-callout-info {
    background-color: #d1ecf1;
    border-color: #0dcaf0;
    color: #0c5460;
  }
  
  .duels-callout-warning {
    background-color: #f8d7da;
    border-color: #dc3545;
    color: #721c24;
  }
  
  .duels-callout-success {
    background-color: #d4edda;
    border-color: #28a745;
    color: #155724;
  }
  
  .duels-content-container {
    padding: 20px;
    background-color: #fafafa;
    border-radius: 0 0 8px 8px;
    max-height: calc(85vh - 60px);
    overflow-y: auto;
  }
  
  .duels-step {
    margin-bottom: 20px;
  }
  
  .duels-step h3,
  .duels-accordion-header {
    color: #333;
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  .duels-accordion-header {
    background-color: #f5f5f5;
    border-left: 4px solid #9898F8;
    padding: 12px 15px;
    font-weight: 600;
    border-radius: 4px;
    margin-bottom: 2px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .duels-accordion-header:hover {
    background-color: #f0f0ff;
  }
  
  .duels-accordion.active .duels-accordion-header {
    background-color: #e8e8ff;
    color: #000;
  }
  
  .duels-accordion-content {
    padding: 15px;
    background-color: white;
    border-radius: 0 0 4px 4px;
    margin-bottom: 15px;
    display: none;
    border: 1px solid #eaeaea;
    border-top: none;
    line-height: 1.5;
  }
  
  .duels-accordion.active .duels-accordion-content {
    display: block;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .duels-resource-container {
    margin-top: 15px;
  }
  
  .duels-resources-title {
    margin: 15px 0 10px 0;
    font-weight: 600;
    font-size: 0.95rem;
    color: #333;
  }
  
  .duels-resource-button {
    display: inline-block;
    padding: 8px 15px;
    margin: 5px 10px 5px 0;
    background-color: #6a6af4;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s;
    border: none;
    box-shadow: 0 2px 4px rgba(152, 152, 248, 0.3);
  }
  
  .duels-resource-button:hover {
    background-color: #5252e0;
    color: white;
    box-shadow: 0 4px 8px rgba(152, 152, 248, 0.4);
    transform: translateY(-1px);
  }
  
  .duels-fab {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #9898F8;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: white;
    cursor: pointer;
    z-index: 10000;
    transition: all 0.2s;
  }
  
  .duels-fab:hover {
    transform: scale(1.05);
    background-color: #8080ff;
    box-shadow: 0 4px 12px rgba(152, 152, 248, 0.5);
  }
  
  .duels-model-instruction {
    background-color: #f0f0ff;
    border-left: 3px solid #9898F8;
    padding: 10px 15px;
    margin: 15px 0;
    border-radius: 0 4px 4px 0;
    font-size: 0.95rem;
  }
  
  .duels-suggestion {
    background-color: white;
    padding: 10px 15px;
    margin-bottom: 8px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  
  .duels-suggestion:hover {
    background-color: #f5f5ff;
    border-color: #9898F8;
    box-shadow: 0 2px 5px rgba(152, 152, 248, 0.2);
  }
  
  .duels-suggestion.copied {
    background-color: #ebfbee;
    border-color: #4caf50;
  }
  
  /* Style pour les personas et prompts */
  .duels-persona {
    background-color: white;
    padding: 10px 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .duels-persona:hover {
    background-color: #f5f5ff;
    border-color: #9898F8;
    box-shadow: 0 2px 5px rgba(152, 152, 248, 0.2);
  }
  
  .duels-persona::after {
    content: '▼';
    font-size: 0.7rem;
    color: #777;
    transition: transform 0.2s;
  }
  
  .duels-persona.open::after {
    transform: rotate(180deg);
  }
  
  .duels-prompt {
    padding: 8px 10px 10px;
    margin-top: -6px;
    margin-bottom: 8px;
    background-color: #f8f8ff;
    border: 1px solid #e0e0e0;
    border-top: none;
    border-radius: 0 0 4px 4px;
    font-size: 0.85rem;
    display: none;
    color: #555;
    position: relative;
  }
  
  .duels-prompt.visible {
    display: block;
    animation: fadeIn 0.2s ease;
  }
  
  .duels-copy-button {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: #9898F8;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 3px 6px;
    font-size: 0.75rem;
    cursor: pointer;
    opacity: 0.8;
    transition: all 0.2s;
  }
  
  .duels-copy-button:hover {
    opacity: 1;
    transform: translateY(-1px);
  }
  
  .duels-prompt.copied .duels-copy-button {
    background-color: #4caf50;
  }
  
  .duels-links {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    text-align: center;
  }
  
  .duels-link {
    color: #9898F8;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  
  .duels-link:hover {
    color: #7070ff;
    text-decoration: underline;
  }
  
  #duels-resources-panel {
    background-color: #f0f0ff;
    border-radius: 0 0 8px 8px;
  }
  
  .duels-resources-section {
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(106, 106, 244, 0.2);
    padding-bottom: 20px;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(106, 106, 244, 0.1);
    margin-bottom: 15px;
  }
  
  .duels-resources-section:last-child {
    margin-bottom: 0;
  }
  
  .duels-resources-section-title {
    color: #6a6af4;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 2px solid #6a6af4;
    display: inline-block;
  }
  
  .duels-back-to-steps {
    display: inline-block;
    padding: 6px;
    background-color: white;
    color: #6a6af4;
    border: 2px solid #6a6af4;
    border-radius: 50%;
    font-weight: 600;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
  }
  
  .duels-back-to-steps:hover {
    background-color: #6a6af4;
    color: white;
    transform: translateY(-1px);
  }
  
  .duels-back-to-steps i {
    font-size: 0.9rem;
  }
  
  .duels-close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
  }
  
  .duels-close-button:hover {
    opacity: 1;
  }
`;
document.head.appendChild(globalStyle);

// =============================================
// CONFIGURATION DES PARCOURS ET ÉTAPES
// =============================================
// Cette section est facilement éditable pour ajouter/modifier des étapes 
// ou créer de nouveaux parcours complets.

// Structure des parcours d'atelier
const workshopPaths = {
  // Parcours principal unique pour le moment
  "duels": {
    id: "duels",
    name: "Les Duels de l'IA",
    description: "Atelier standard: découvrir l'impact environnemental des IA",
    icon: "fas fa-bolt",
    steps: [
      // Les étapes sont définies dans stepsLibrary et référencées par leur ID
      "start_duel", "select_mode", "enter_prompt", "send_prompt", 
      "vote_response", "discover_impact", "worth_it"
    ]
  }
};

// Bibliothèque d'étapes réutilisables
const stepsLibrary = {
  "start_duel": {
    id: "start_duel",
    order: 1,
    title: "Lancer un duel",
    instruction: "Cliquez sur \"Commencer à discuter\" sur ComparIA.",
    pages: ["main"], // Sur quelles pages cette étape s'affiche
    suggestions: [],
    resources: [],
    media: [] // Images ou GIFs à afficher
  },
  
  "select_mode": {
    id: "select_mode",
    order: 2,
    title: "Sélectionner le mode",
    instruction: "Choisissez \"David contre Goliath\" ou sélectionnez deux modèles.",
    pages: ["model_selection", "duel"],
    suggestions: [],
    resources: [],
    media: [],
    callout: {
      type: "important", // types possibles: important, info, warning, success
      icon: "💡", // émoji ou classe d'icône FontAwesome (ex: "fas fa-info-circle")
      title: "Important :",
      content: "Vous pouvez aussi choisir deux petits modèles manuellement parmi la liste. Par exemple DeepSeek V3 contre Gemma 3 4b"
    }
  },
  
  "enter_prompt": {
    id: "enter_prompt",
    order: 3,
    title: "Entrer un prompt",
    instruction: "Entrez votre propre prompt ou essayez une des suggestions.\n\nLes suggestions incluent différents personnages qui représentent divers cas d'usage.",
    pages: ["duel"],
    suggestions: [
      "⚙️ Leila, ingénieure en mécanique : Ma machine à laver, que j'ai achetée il y a un an et demi, fuit. Écris un mail à l'entreprise qui me l'a vendue pour demander une intervention et une réparation sous garantie. Le mail doit être de 5 lignes maximum.",
      "🌱 Thomas, consultant en transition écologique : Reformule moi cette phrase - \"l'IA générative a un effet sur l'environnement donc il est nécessaire de l'utiliser de manière consciente\"",
      "👩‍🎓 Camille, étudiante : c'est quoi la différence entre un grand et un petit modèle d'IA générative ? Donne une réponse compréhensible en quelques mots",
      "👩🏻‍💼 Mei, cheffe de projet chez EDF : où trouver des petits modèles d'IA générative ? Réponse synthétique."
    ],
    resources: [
      {
        title: "Comment bien prompter ?",
        url: "https://atelier-numerique.notion.site/Faciliter-un-Duel-de-l-IA-1b247c728624801b84f0f805b23544b8"
      }
    ],
    media: [
      // Exemple pour ajouter une image (à décommenter et compléter si besoin)
      // { type: "image", url: "https://example.com/image.png", alt: "Description", caption: "Légende" }
    ]
  },
  
  "send_prompt": {
    id: "send_prompt",
    order: 4,
    title: "Cliquer sur \"Envoyer\"",
    instruction: "Attendez les réponses des deux modèles.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: []
  },
  
  "vote_response": {
    id: "vote_response",
    order: 5,
    title: "Voter sur les réponses",
    instruction: "\"Quelle réponse préférez-vous ?\"",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: []
  },
  
  "discover_impact": {
    id: "discover_impact",
    order: 6,
    title: "Découvrir l'impact environnemental",
    instruction: "Cliquez pour révéler quel modèle est lequel. Examinez les métriques d'impact environnemental pour chaque modèle.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: []
  },
  
  "worth_it": {
    id: "worth_it",
    order: 7,
    title: "La réponse en vaut-elle l'impact environnemental ?",
    instruction: "\"Les réponses justifient-elles l'énergie consommée ?\"<br><br>Voici quelques points à considérer:<br>- La qualité de la réponse<br>- Son utilité<br>- Son originalité",
    pages: ["duel"],
    suggestions: [],
    resources: [
      {
        title: "Pourquoi les IA consomment de l'énergie ?",
        url: "https://drive.google.com/drive/u/0/folders/17F2AJ4YAVIBt1WvKZE_JWcwi1iNwBSCq"
      }
    ],
    media: []
  }
};

// Ressources communes à tous les parcours
const commonResources = {
  "promptSuggestions": [
    "⚙️ Leila, ingénieure en mécanique : Ma machine à laver, que j'ai achetée il y a un an et demi, fuit. Écris un mail à l'entreprise qui me l'a vendue pour demander une intervention et une réparation sous garantie. Le mail doit être de 5 lignes maximum.",
    "🌱 Thomas, consultant en transition écologique : Reformule moi cette phrase - \"l'IA générative a un effet sur l'environnement donc il est nécessaire de l'utiliser de manière consciente\"",
    "👩‍🎓 Camille, étudiante : c'est quoi la différence entre un grand et un petit modèle d'IA générative ? Donne une réponse compréhensible en quelques mots",
    "👩🏻‍💼 Mei, cheffe de projet chez EDF : où trouver des petits modèles d'IA générative ? Réponse synthétique."
  ],
  "facilitatorGuide": {
    title: "Guide du facilitateur",
    url: "https://atelier-numerique.notion.site/Faciliter-un-Duel-de-l-IA-1b247c728624801b84f0f805b23544b8?pvs=74"
  },
  "educationalResources": [
    {
      title: "📚 Introduction aux duels sur l'impact environnemental",
      url: "https://drive.google.com/file/d/1xsrkj1vJehdMKJo3FhcuVCk285qCiU6V/view"
    },
    {
      title: "⚡ Pourquoi les IA consomment-elles de l'électricité ?",
      url: "https://drive.google.com/file/d/189G2VMx52Htsm_JRj82AkcAXZ8qdIcbK/view"
    },
    {
      title: "📏 Qu'est-ce que la \"taille\" d'un modèle ?",
      url: "https://drive.google.com/file/d/1I-wrsF2rD2k8n8tp2N9qD_dkJaq3za5L/view"
    },
    {
      title: "🔍 ChatGPT ou Google : lequel est plus frugal ?",
      url: "https://drive.google.com/file/d/1GSzqbH2fZ5N7FLP7l3gOygmrZqLqZF6U/view"
    },
    {
      title: "🧠 Qu'est-ce qu'un modèle de raisonnement ?",
      url: "https://drive.google.com/file/d/1JCnZaZaklBEzqQrxlML8Drenf-1rmJl5/view"
    }
  ],
  "frugalAI": {
    title: "Pourquoi les IA consomment de l'énergie ?",
    url: "https://drive.google.com/file/d/189G2VMx52Htsm_JRj82AkcAXZ8qdIcbK/view"
  }
};

// Paramètres actuels (à modifier avec les préférences utilisateur)
let currentSettings = {
  activePath: "duels", // Parcours actif par défaut
  showCompletedSteps: true, // Afficher/masquer les étapes terminées
  currentStep: 1 // Étape actuelle
};

// Check if we're on the ComparIA site
const isComparIASite = window.location.hostname === "comparia.beta.gouv.fr";

// Notify the background script about our current domain
chrome.runtime.sendMessage({ 
  action: "checkDomain", 
  isComparIASite: isComparIASite 
});

// State variables (declare them outside the if block to avoid redeclaration)
let isGuideOpen = false;
let showingResources = false;

// Fonction utilitaire pour obtenir les étapes à afficher sur la page actuelle
function getStepsForCurrentPage(pageName) {
  const activePath = workshopPaths[currentSettings.activePath];
  if (!activePath) return [];
  
  return activePath.steps
    .map(stepId => stepsLibrary[stepId])
    .filter(step => step && step.pages.includes(pageName))
    .sort((a, b) => a.order - b.order);
}

// Fonction utilitaire pour obtenir le chemin actif
function getActivePath() {
  return workshopPaths[currentSettings.activePath];
}

// Only continue if we're on the ComparIA site
if (isComparIASite) {
  // Check what page we're on
  const isMainPage = window.location.pathname === "/" || window.location.pathname === "";
  const isModelSelectionPage = window.location.href.includes("/arene") && 
                              document.body.textContent.includes("Sélection des modèles");
  const isDuelPage = window.location.href.includes("/arene") && 
                    !document.body.textContent.includes("Sélection des modèles");
  
  // Create the FAB
  createFAB();
  
  // Determine what guide to show based on the current page
  if (isMainPage) {
    createMainPageGuide();
  } else if (isModelSelectionPage) {
    createModelSelectionGuide();
  } else if (isDuelPage) {
    createDuelGuide();
  }
  
  // Function to create floating action button
  function createFAB() {
    const fab = document.createElement('div');
    fab.className = 'duels-fab';
    fab.innerHTML = '⚔️'; // Swords emoji
    fab.title = 'Guide d\'Atelier';
    
    fab.addEventListener('click', toggleGuide);
    
    document.body.appendChild(fab);
  }
  
  // Create resources panel for any guide
  function createResourcesPanel() {
    const resourcesPanel = document.createElement('div');
    resourcesPanel.className = 'duels-content-container';
    resourcesPanel.id = 'duels-resources-panel';
    resourcesPanel.style.display = 'none';
    
    // Add back to steps button (icon only)
    const backButton = document.createElement('button');
    backButton.className = 'duels-back-to-steps';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.title = 'Retour aux étapes';
    backButton.addEventListener('click', toggleResources);
    resourcesPanel.appendChild(backButton);
    
    // Get current path and relevant steps
    const activePath = getActivePath();
    const currentPathSteps = activePath.steps.map(stepId => stepsLibrary[stepId]);
    
    // Prompt suggestions section
    if (commonResources.promptSuggestions && commonResources.promptSuggestions.length > 0) {
      const promptsSection = document.createElement('div');
      promptsSection.className = 'duels-resources-section';
      
      const promptsTitle = document.createElement('h3');
      promptsTitle.className = 'duels-resources-section-title';
      promptsTitle.textContent = 'Suggestions de prompts';
      promptsSection.appendChild(promptsTitle);
      
      const promptsList = document.createElement('div');
      promptsList.className = 'duels-suggestions';
      
      commonResources.promptSuggestions.forEach(suggestion => {
        // Extract persona and prompt from the suggestion
        const parts = suggestion.split(":");
        const persona = parts[0].trim(); // e.g. "⚙️ Leila, ingénieure en mécanique"
        const prompt = parts.slice(1).join(":").trim(); // Rest of the message
        
        // Create persona element (toggleable header)
        const personaElement = document.createElement('div');
        personaElement.className = 'duels-persona';
        personaElement.textContent = persona;
        
        // Create prompt element (toggleable content)
        const promptElement = document.createElement('div');
        promptElement.className = 'duels-prompt';
        promptElement.textContent = prompt;
        
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'duels-copy-button';
        copyButton.textContent = 'Copier';
        promptElement.appendChild(copyButton);
        
        // Add toggle functionality
        personaElement.addEventListener('click', () => {
          personaElement.classList.toggle('open');
          promptElement.classList.toggle('visible');
        });
        
        // Add copy functionality
        copyButton.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent toggle when clicking the button
          navigator.clipboard.writeText(suggestion)
            .then(() => {
              // Visual feedback
              promptElement.classList.add('copied');
              copyButton.textContent = 'Copié!';
              setTimeout(() => {
                promptElement.classList.remove('copied');
                copyButton.textContent = 'Copier';
              }, 1000);
            });
        });
        
        promptsList.appendChild(personaElement);
        promptsList.appendChild(promptElement);
      });
      
      promptsSection.appendChild(promptsList);
      resourcesPanel.appendChild(promptsSection);
    }
    
    // Collect all resources from steps in current path
    const allResources = [];
    currentPathSteps.forEach(step => {
      if (step.resources && step.resources.length > 0) {
        step.resources.forEach(resource => {
          // Check if resource is already in allResources to avoid duplicates
          if (!allResources.some(r => r.url === resource.url)) {
            allResources.push(resource);
          }
        });
      }
    });
    
    // Educational Resources section
    if (commonResources.educationalResources && commonResources.educationalResources.length > 0) {
      const educationalSection = document.createElement('div');
      educationalSection.className = 'duels-resources-section';
      
      const educationalTitle = document.createElement('h3');
      educationalTitle.className = 'duels-resources-section-title';
      educationalTitle.textContent = 'Ressources pédagogiques';
      educationalSection.appendChild(educationalTitle);
      
      // Add all educational resources
      commonResources.educationalResources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url;
        resourceLink.target = '_blank';
        resourceLink.textContent = resource.title;
        educationalSection.appendChild(resourceLink);
      });
      
      resourcesPanel.appendChild(educationalSection);
    }
    
    // AI Frugale section (if needed for compatibility)
    if (allResources.length > 0) {
      const frugaleSection = document.createElement('div');
      frugaleSection.className = 'duels-resources-section';
      
      const frugaleTitle = document.createElement('h3');
      frugaleTitle.className = 'duels-resources-section-title';
      frugaleTitle.textContent = 'Autres ressources';
      frugaleSection.appendChild(frugaleTitle);
      
      // Add resources from steps
      allResources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url;
        resourceLink.target = '_blank';
        resourceLink.textContent = resource.title;
        frugaleSection.appendChild(resourceLink);
      });
      
      resourcesPanel.appendChild(frugaleSection);
    }
    
    // Notes de facilitation section
    if (commonResources.facilitatorGuide) {
      const notesSection = document.createElement('div');
      notesSection.className = 'duels-resources-section';
      
      const notesTitle = document.createElement('h3');
      notesTitle.className = 'duels-resources-section-title';
      notesTitle.textContent = 'Notes de facilitation';
      notesSection.appendChild(notesTitle);
      
      const facilitatorLink = document.createElement('a');
      facilitatorLink.className = 'duels-resource-button';
      facilitatorLink.href = commonResources.facilitatorGuide.url;
      facilitatorLink.target = '_blank';
      facilitatorLink.textContent = commonResources.facilitatorGuide.title;
      notesSection.appendChild(facilitatorLink);
      
      resourcesPanel.appendChild(notesSection);
    }
    
    // Educational resources section (nouveau)
    if (commonResources.educationalResources && commonResources.educationalResources.length > 0) {
      const educationalSection = document.createElement('div');
      educationalSection.className = 'duels-resources-section';
      
      const educationalTitle = document.createElement('h3');
      educationalTitle.className = 'duels-resources-section-title';
      educationalTitle.textContent = 'Ressources pédagogiques';
      educationalSection.appendChild(educationalTitle);
      
      commonResources.educationalResources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url;
        resourceLink.target = '_blank';
        resourceLink.textContent = resource.title;
        educationalSection.appendChild(resourceLink);
      });
      
      resourcesPanel.appendChild(educationalSection);
    }
    
    return resourcesPanel;
  }
  
  // Load Font Awesome for icons
  function loadFontAwesome() {
    if (!document.getElementById('fontawesome-css')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.id = 'fontawesome-css';
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
  }

  // Functions for guide interaction

  // Function to toggle the guide visibility
  function toggleGuide() {
    const guide = document.getElementById('duels-guide');
    isGuideOpen = !isGuideOpen;
    
    if (isGuideOpen) {
      guide.classList.add('open');
    } else {
      guide.classList.remove('open');
      // Reset to steps view when closing
      showingResources = false;
      updateGuideContent();
    }
  }

  // Function to toggle between steps and resources
  function toggleResources() {
    showingResources = !showingResources;
    updateGuideContent();
  }

  // Function to update the guide content based on current state
  function updateGuideContent() {
    const stepsContainer = document.getElementById('duels-steps-container');
    const resourcesContainer = document.getElementById('duels-resources-panel');
    
    if (showingResources) {
      if (stepsContainer) stepsContainer.style.display = 'none';
      if (resourcesContainer) resourcesContainer.style.display = 'block';
    } else {
      if (stepsContainer) stepsContainer.style.display = 'block';
      if (resourcesContainer) resourcesContainer.style.display = 'none';
    }
  }
  
  // Function to create a guide with standardized header and navigation
  function createGuideBase() {
    const guide = document.createElement('div');
    guide.className = 'duels-guide';
    guide.id = 'duels-guide';
    
    // Create header with navigation
    const header = document.createElement('div');
    header.className = 'duels-header';
    
    // Get active path information
    const activePath = getActivePath();
    
    const title = document.createElement('h2');
    title.innerHTML = `<i class="${activePath.icon}"></i> ${activePath.name}`;
    header.appendChild(title);
    
    // Create navbar
    const navbar = document.createElement('div');
    navbar.className = 'duels-navbar';
    
    // Paths dropdown button (désactivé pour l'instant - un seul parcours)
    // Décommentez ce bloc lorsque vous ajouterez d'autres parcours
    /*
    if (Object.keys(workshopPaths).length > 1) {
      const pathsButton = document.createElement('button');
      pathsButton.className = 'duels-paths-btn';
      pathsButton.innerHTML = '<i class="fas fa-map-signs"></i>';
      pathsButton.title = 'Changer de parcours';
      
      // Create a dropdown for paths selection
      pathsButton.addEventListener('click', togglePathsDropdown);
      navbar.appendChild(pathsButton);
    }
    */
    
    // Resources button with icon only
    const resourcesButton = document.createElement('button');
    resourcesButton.className = 'duels-resources-btn';
    resourcesButton.innerHTML = '<i class="fas fa-book"></i>';
    resourcesButton.title = 'Ressources';
    resourcesButton.addEventListener('click', toggleResources);
    navbar.appendChild(resourcesButton);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'duels-close-button';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', toggleGuide);
    navbar.appendChild(closeButton);
    
    header.appendChild(navbar);
    guide.appendChild(header);
    
    return guide;
  }
  
  // Function to create paths dropdown menu
  function createPathsDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'duels-paths-dropdown';
    dropdown.id = 'duels-paths-dropdown';
    
    const title = document.createElement('div');
    title.className = 'duels-dropdown-title';
    title.textContent = 'Sélectionner un parcours';
    dropdown.appendChild(title);
    
    const pathsList = document.createElement('div');
    pathsList.className = 'duels-paths-list';
    
    // Add each available path
    Object.values(workshopPaths).forEach(path => {
      const pathItem = document.createElement('div');
      pathItem.className = 'duels-path-item';
      if (path.id === currentSettings.activePath) {
        pathItem.classList.add('active');
      }
      
      const pathIcon = document.createElement('i');
      pathIcon.className = path.icon;
      pathItem.appendChild(pathIcon);
      
      const pathInfo = document.createElement('div');
      pathInfo.className = 'duels-path-info';
      
      const pathName = document.createElement('div');
      pathName.className = 'duels-path-name';
      pathName.textContent = path.name;
      pathInfo.appendChild(pathName);
      
      const pathDesc = document.createElement('div');
      pathDesc.className = 'duels-path-description';
      pathDesc.textContent = path.description;
      pathInfo.appendChild(pathDesc);
      
      pathItem.appendChild(pathInfo);
      
      // Add click handler to change path
      pathItem.addEventListener('click', () => {
        changePath(path.id);
        togglePathsDropdown(); // Close dropdown after selection
      });
      
      pathsList.appendChild(pathItem);
    });
    
    dropdown.appendChild(pathsList);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'duels-dropdown-close';
    closeBtn.innerHTML = 'Fermer';
    closeBtn.addEventListener('click', togglePathsDropdown);
    dropdown.appendChild(closeBtn);
    
    // Add to document
    document.body.appendChild(dropdown);
  }
  
  // Function to toggle paths dropdown visibility
  function togglePathsDropdown() {
    const dropdown = document.getElementById('duels-paths-dropdown');
    
    if (!dropdown) {
      createPathsDropdown();
    } else {
      dropdown.classList.toggle('open');
    }
  }
  
  // Function to change the active path
  function changePath(pathId) {
    if (workshopPaths[pathId]) {
      currentSettings.activePath = pathId;
      
      // Re-render the guide with the new path
      const existingGuide = document.getElementById('duels-guide');
      if (existingGuide) {
        existingGuide.remove();
      }
      
      if (isMainPage) {
        createMainPageGuide();
      } else if (isModelSelectionPage) {
        createModelSelectionGuide();
      } else if (isDuelPage) {
        createDuelGuide();
      }
    }
  }
  
  // Function to create resources panel that can be reused across different guides
  function createResourcesPanel() {
    const resourcesPanel = document.createElement('div');
    resourcesPanel.className = 'duels-content-container';
    resourcesPanel.id = 'duels-resources-panel';
    resourcesPanel.style.display = 'none';
    
    // Add back to steps button
    const backButton = document.createElement('button');
    backButton.className = 'duels-back-to-steps';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.title = 'Retour aux étapes';
    backButton.addEventListener('click', toggleResources);
    resourcesPanel.appendChild(backButton);
    
    // Prompt suggestions section
    const promptsSection = document.createElement('div');
    promptsSection.className = 'duels-resources-section';
    
    const promptsTitle = document.createElement('h3');
    promptsTitle.className = 'duels-resources-section-title';
    promptsTitle.textContent = 'Suggestions de prompts';
    promptsSection.appendChild(promptsTitle);
    
    const promptsList = document.createElement('div');
    promptsList.className = 'duels-suggestions';
    
    // Using the commonResources instead of workshopSteps
    const suggestions = commonResources.promptSuggestions;
    suggestions.forEach(suggestion => {
      // Séparer l'emoji et le persona du prompt
      const parts = suggestion.split(":");
      const persona = parts[0].trim(); // e.g. "⚙️ Leila, ingénieure en mécanique"
      const prompt = parts.slice(1).join(":").trim(); // Rest of the message
      
      // Create persona element (toggleable header)
      const personaElement = document.createElement('div');
      personaElement.className = 'duels-persona';
      personaElement.textContent = persona;
      
      // Create prompt element (toggleable content)
      const promptElement = document.createElement('div');
      promptElement.className = 'duels-prompt';
      promptElement.textContent = prompt;
      
      // Ajouter un bouton de copie
      const copyButton = document.createElement('button');
      copyButton.className = 'duels-copy-button';
      copyButton.textContent = 'Copier';
      copyButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêcher le toggle du persona au clic sur le bouton
        navigator.clipboard.writeText(suggestion)
          .then(() => {
            // Feedback visuel
            promptElement.classList.add('copied');
            copyButton.textContent = 'Copié !';
            setTimeout(() => {
              promptElement.classList.remove('copied');
              copyButton.textContent = 'Copier';
            }, 1000);
          });
      });
      promptElement.appendChild(copyButton);
      
      // Ajouter l'événement de toggle au persona
      personaElement.addEventListener('click', () => {
        personaElement.classList.toggle('open');
        promptElement.classList.toggle('visible');
      });
      
      // Ajouter les éléments au DOM
      promptsList.appendChild(personaElement);
      promptsList.appendChild(promptElement);
    });
    
    promptsSection.appendChild(promptsList);
    resourcesPanel.appendChild(promptsSection);
    
    // Educational Resources section
    if (commonResources.educationalResources && commonResources.educationalResources.length > 0) {
      const educationalSection = document.createElement('div');
      educationalSection.className = 'duels-resources-section';
      
      const educationalTitle = document.createElement('h3');
      educationalTitle.className = 'duels-resources-section-title';
      educationalTitle.textContent = 'Ressources pédagogiques';
      educationalSection.appendChild(educationalTitle);
      
      // Add all educational resources
      commonResources.educationalResources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url;
        resourceLink.target = '_blank';
        resourceLink.textContent = resource.title;
        educationalSection.appendChild(resourceLink);
      });
      
      resourcesPanel.appendChild(educationalSection);
    }
    
    // Notes de facilitation section
    const notesSection = document.createElement('div');
    notesSection.className = 'duels-resources-section';
    
    const notesTitle = document.createElement('h3');
    notesTitle.className = 'duels-resources-section-title';
    notesTitle.textContent = 'Notes de facilitation';
    notesSection.appendChild(notesTitle);
    
    const facilitatorLink = document.createElement('a');
    facilitatorLink.className = 'duels-resource-button';
    facilitatorLink.href = commonResources.facilitatorGuide.url;
    facilitatorLink.target = '_blank';
    facilitatorLink.textContent = commonResources.facilitatorGuide.title;
    notesSection.appendChild(facilitatorLink);
    
    resourcesPanel.appendChild(notesSection);
    
    // Educational resources section (nouveau)
    if (commonResources.educationalResources && commonResources.educationalResources.length > 0) {
      const educationalSection = document.createElement('div');
      educationalSection.className = 'duels-resources-section';
      
      const educationalTitle = document.createElement('h3');
      educationalTitle.className = 'duels-resources-section-title';
      educationalTitle.textContent = 'Ressources pédagogiques';
      educationalSection.appendChild(educationalTitle);
      
      commonResources.educationalResources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url;
        resourceLink.target = '_blank';
        resourceLink.textContent = resource.title;
        educationalSection.appendChild(resourceLink);
      });
      
      resourcesPanel.appendChild(educationalSection);
    }
    
    return resourcesPanel;
  }
  
  // Function to load Font Awesome if it's not already loaded
  function loadFontAwesome() {
    if (!document.getElementById('fontawesome-css')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.id = 'fontawesome-css';
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
  }
  
  // Fonction pour créer et afficher un callout dans une étape
  function renderCallout(step, container) {
    if (step.callout) {
      const calloutElement = document.createElement('div');
      calloutElement.className = `duels-callout duels-callout-${step.callout.type}`;
      
      // Add icon if provided
      if (step.callout.icon) {
        let iconElement;
        
        // Check if it's a FontAwesome icon class or an emoji
        if (step.callout.icon.startsWith('fas ') || step.callout.icon.startsWith('far ') || step.callout.icon.startsWith('fab ')) {
          iconElement = document.createElement('i');
          iconElement.className = `${step.callout.icon} duels-callout-icon`;
        } else {
          iconElement = document.createElement('span');
          iconElement.className = 'duels-callout-icon';
          iconElement.textContent = step.callout.icon;
        }
        
        calloutElement.appendChild(iconElement);
      }
      
      // Add callout content
      const calloutContent = document.createElement('div');
      calloutContent.className = 'duels-callout-content';
      
      // Add title if provided
      if (step.callout.title) {
        const calloutTitle = document.createElement('div');
        calloutTitle.className = 'duels-callout-title';
        calloutTitle.innerHTML = `<strong>${step.callout.title}</strong>`;
        calloutContent.appendChild(calloutTitle);
      }
      
      // Add content
      const calloutText = document.createElement('div');
      calloutText.className = 'duels-callout-text';
      calloutText.textContent = step.callout.content;
      calloutContent.appendChild(calloutText);
      
      calloutElement.appendChild(calloutContent);
      container.appendChild(calloutElement);
    }
  }

// Function to create a guide for the main page
  function createMainPageGuide() {
    const guide = createGuideBase();
    
    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'duels-content-container';
    stepsContainer.id = 'duels-steps-container';
    
    // Get all steps for the main page
    const mainPageSteps = getStepsForCurrentPage('main');
    
    // Add each step
    mainPageSteps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'duels-step';
      // Mark current step as active
      if (step.order === currentSettings.currentStep) {
        stepElement.classList.add('active');
      }
      
      const stepTitle = document.createElement('h3');
      stepTitle.textContent = `Étape ${step.order}: ${step.title}`;
      stepElement.appendChild(stepTitle);
      
      const stepInstructions = document.createElement('p');
      stepInstructions.innerHTML = step.instruction;
      stepElement.appendChild(stepInstructions);
      
      // Add callout if available
      renderCallout(step, stepElement);
      
      // Add media content if available
      if (step.media && step.media.length > 0) {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'duels-media-container';
        
        step.media.forEach(media => {
          if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.url;
            img.alt = media.alt || '';
            img.className = 'duels-media-image';
            mediaContainer.appendChild(img);
            
            if (media.caption) {
              const caption = document.createElement('div');
              caption.className = 'duels-media-caption';
              caption.textContent = media.caption;
              mediaContainer.appendChild(caption);
            }
          } else if (media.type === 'gif') {
            const img = document.createElement('img');
            img.src = media.url;
            img.alt = media.alt || '';
            img.className = 'duels-media-gif';
            mediaContainer.appendChild(img);
            
            if (media.caption) {
              const caption = document.createElement('div');
              caption.className = 'duels-media-caption';
              caption.textContent = media.caption;
              mediaContainer.appendChild(caption);
            }
          }
        });
        
        stepElement.appendChild(mediaContainer);
      }
      
      // Add suggestions if available
      if (step.suggestions && step.suggestions.length > 0) {
        const suggestionsTitle = document.createElement('h4');
        suggestionsTitle.className = 'duels-suggestions-title';
        suggestionsTitle.textContent = 'Suggestions:';
        stepElement.appendChild(suggestionsTitle);
        
        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'duels-suggestions';
        
        step.suggestions.forEach(suggestion => {
          // Séparer l'emoji et le persona du prompt
          const parts = suggestion.split(":");
          const persona = parts[0].trim(); // e.g. "⚙️ Leila, ingénieure en mécanique"
          const prompt = parts.slice(1).join(":").trim(); // Rest of the message
          
          // Create persona element (toggleable header)
          const personaElement = document.createElement('div');
          personaElement.className = 'duels-persona';
          personaElement.textContent = persona;
          
          // Create prompt element (toggleable content)
          const promptElement = document.createElement('div');
          promptElement.className = 'duels-prompt';
          promptElement.textContent = prompt;
          
          // Ajouter un bouton de copie
          const copyButton = document.createElement('button');
          copyButton.className = 'duels-copy-button';
          copyButton.textContent = 'Copier';
          copyButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêcher le toggle du persona au clic sur le bouton
            navigator.clipboard.writeText(suggestion)
              .then(() => {
                // Feedback visuel
                promptElement.classList.add('copied');
                copyButton.textContent = 'Copié !';
                setTimeout(() => {
                  promptElement.classList.remove('copied');
                  copyButton.textContent = 'Copier';
                }, 1000);
              });
          });
          promptElement.appendChild(copyButton);
          
          // Ajouter l'événement de toggle au persona
          personaElement.addEventListener('click', () => {
            personaElement.classList.toggle('open');
            promptElement.classList.toggle('visible');
          });
          
          // Ajouter les éléments au DOM
          suggestionsList.appendChild(personaElement);
          suggestionsList.appendChild(promptElement);
        });
        
        stepElement.appendChild(suggestionsList);
      }
      
      stepsContainer.appendChild(stepElement);
    });
    
    guide.appendChild(stepsContainer);
    
    // Create resources panel (initially hidden)
    const resourcesPanel = createResourcesPanel();
    guide.appendChild(resourcesPanel);
    
    // Add guide to the page
    document.body.appendChild(guide);
    
    // Load Font Awesome for icons if needed
    loadFontAwesome();
  }
  
  // Function to create a simplified guide for the model selection page (Step 2)
  function createModelSelectionGuide() {
    const guide = createGuideBase();
    
    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'duels-content-container';
    stepsContainer.id = 'duels-steps-container';
    
    // Get steps for model selection page
    const modelSelectionSteps = getStepsForCurrentPage('model_selection');
    
    // Add each step as an accordion
    modelSelectionSteps.forEach(step => {
      const stepAccordion = document.createElement('div');
      stepAccordion.className = 'duels-accordion';
      
      // Mark current step as active
      if (step.order === currentSettings.currentStep) {
        stepAccordion.classList.add('active');
      }
      
      const stepHeader = document.createElement('div');
      stepHeader.className = 'duels-accordion-header';
      stepHeader.textContent = `Étape ${step.order}: ${step.title}`;
      
      const stepContent = document.createElement('div');
      stepContent.className = 'duels-accordion-content';
      
      const stepInstructions = document.createElement('p');
      stepInstructions.innerHTML = step.instruction;
      stepContent.appendChild(stepInstructions);
      
      // Add callout if available
      renderCallout(step, stepContent);
      
      // Add suggestions if available
      if (step.suggestions && step.suggestions.length > 0) {
        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'duels-suggestions';
        
        step.suggestions.forEach(suggestion => {
          // Séparer l'emoji et le persona du prompt
          const parts = suggestion.split(":");
          const persona = parts[0].trim(); // e.g. "⚙️ Leila, ingénieure en mécanique"
          const prompt = parts.slice(1).join(":").trim(); // Rest of the message
          
          // Create persona element (toggleable header)
          const personaElement = document.createElement('div');
          personaElement.className = 'duels-persona';
          personaElement.textContent = persona;
          
          // Create prompt element (toggleable content)
          const promptElement = document.createElement('div');
          promptElement.className = 'duels-prompt';
          promptElement.textContent = prompt;
          
          // Ajouter un bouton de copie
          const copyButton = document.createElement('button');
          copyButton.className = 'duels-copy-button';
          copyButton.textContent = 'Copier';
          copyButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêcher le toggle du persona au clic sur le bouton
            navigator.clipboard.writeText(suggestion)
              .then(() => {
                // Feedback visuel
                promptElement.classList.add('copied');
                copyButton.textContent = 'Copié !';
                setTimeout(() => {
                  promptElement.classList.remove('copied');
                  copyButton.textContent = 'Copier';
                }, 1000);
              });
          });
          promptElement.appendChild(copyButton);
          
          // Ajouter l'événement de toggle au persona
          personaElement.addEventListener('click', () => {
            personaElement.classList.toggle('open');
            promptElement.classList.toggle('visible');
          });
          
          // Ajouter les éléments au DOM
          suggestionsList.appendChild(personaElement);
          suggestionsList.appendChild(promptElement);
        });
        
        stepContent.appendChild(suggestionsList);
      }
      
      stepAccordion.appendChild(stepHeader);
      stepAccordion.appendChild(stepContent);
      
      // Add click event to toggle accordion
      stepHeader.addEventListener('click', () => {
        stepAccordion.classList.toggle('active');
      });
      
      stepsContainer.appendChild(stepAccordion);
    });
    
    guide.appendChild(stepsContainer);
    
    // Create resources panel (initially hidden)
    const resourcesPanel = createResourcesPanel();
    guide.appendChild(resourcesPanel);
    
    // Add guide to the page
    document.body.appendChild(guide);
    
    // Load Font Awesome for icons
    loadFontAwesome();
  }
  
  // Function to create guide for the duel page (steps 2-7)
  function createDuelGuide() {
    const guide = createGuideBase();
    
    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'duels-content-container';
    stepsContainer.id = 'duels-steps-container';
    
    // Get steps for duel page
    const duelSteps = getStepsForCurrentPage('duel');
    
    // Add each step as an accordion
    duelSteps.forEach(step => {
      const stepAccordion = document.createElement('div');
      stepAccordion.className = 'duels-accordion';
      
      // Mark current step as active
      if (step.order === currentSettings.currentStep) {
        stepAccordion.classList.add('active');
      }
      
      // Make prompt entry step active by default if it's present
      if (step.id === 'enter_prompt') {
        stepAccordion.classList.add('active');
      }
      
      const stepHeader = document.createElement('div');
      stepHeader.className = 'duels-accordion-header';
      stepHeader.textContent = `Étape ${step.order}: ${step.title}`;
      
      const stepContent = document.createElement('div');
      stepContent.className = 'duels-accordion-content';
      
      const stepInstructions = document.createElement('p');
      stepInstructions.innerHTML = step.instruction;
      stepContent.appendChild(stepInstructions);
      
      // Add callout if available
      renderCallout(step, stepContent);
      
      // Add suggestions if available
      if (step.suggestions && step.suggestions.length > 0) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'duels-suggestions';
        
        step.suggestions.forEach(suggestion => {
          // Séparer l'emoji et le persona du prompt
          const parts = suggestion.split(":");
          const persona = parts[0].trim(); // e.g. "⚙️ Leila, ingénieure en mécanique"
          const prompt = parts.slice(1).join(":").trim(); // Rest of the message
          
          // Create persona element (toggleable header)
          const personaElement = document.createElement('div');
          personaElement.className = 'duels-persona';
          personaElement.textContent = persona;
          
          // Create prompt element (toggleable content)
          const promptElement = document.createElement('div');
          promptElement.className = 'duels-prompt';
          promptElement.textContent = prompt;
          
          // Ajouter un bouton de copie
          const copyButton = document.createElement('button');
          copyButton.className = 'duels-copy-button';
          copyButton.textContent = 'Copier';
          copyButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêcher le toggle du persona au clic sur le bouton
            navigator.clipboard.writeText(suggestion)
              .then(() => {
                // Feedback visuel
                promptElement.classList.add('copied');
                copyButton.textContent = 'Copié !';
                setTimeout(() => {
                  promptElement.classList.remove('copied');
                  copyButton.textContent = 'Copier';
                }, 1000);
              });
          });
          promptElement.appendChild(copyButton);
          
          // Ajouter l'événement de toggle au persona
          personaElement.addEventListener('click', () => {
            personaElement.classList.toggle('open');
            promptElement.classList.toggle('visible');
          });
          
          // Ajouter les éléments au DOM
          suggestionsContainer.appendChild(personaElement);
          suggestionsContainer.appendChild(promptElement);
        });
        
        stepContent.appendChild(suggestionsContainer);
      }
      
      stepAccordion.appendChild(stepHeader);
      stepAccordion.appendChild(stepContent);
      
      // Add click event to toggle accordion
      stepHeader.addEventListener('click', () => {
        stepAccordion.classList.toggle('active');
      });
      
      stepsContainer.appendChild(stepAccordion);
    });
    
    guide.appendChild(stepsContainer);
    
    // Create resources panel (initially hidden)
    const resourcesPanel = createResourcesPanel();
    guide.appendChild(resourcesPanel);
    
    // Add guide to the page
    document.body.appendChild(guide);
    
    // Load Font Awesome for icons
    loadFontAwesome();
  }
  
  // Add URL change detection to handle navigation within the ComparIA site
  let lastUrl = window.location.href;
  
  // Create a MutationObserver to watch for URL changes
  const observer = new MutationObserver(() => {
    // Check for URL changes
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      
      // Check which page we're on after URL change
      const isNowMainPage = window.location.pathname === "/" || window.location.pathname === "";
      const isNowModelPage = window.location.href.includes("/arene") && 
                            document.body.textContent.includes("Sélection des modèles");
      const isNowDuelPage = window.location.href.includes("/arene") && 
                           !document.body.textContent.includes("Sélection des modèles");
      
      // Remove existing guide
      const existingGuide = document.getElementById('duels-guide');
      if (existingGuide) {
        existingGuide.remove();
      }
      
      // Create appropriate guide
      if (isNowMainPage) {
        createMainPageGuide();
      } else if (isNowModelPage) {
        createModelSelectionGuide();
      } else if (isNowDuelPage) {
        createDuelGuide();
      }
    }
  });
  
  // Start observing
  observer.observe(document, { subtree: true, childList: true });
}