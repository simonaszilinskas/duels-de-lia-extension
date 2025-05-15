// content.js - Script that runs directly on the ComparIA website

// Charger la police Marianne via le CSS DSFR
const dfsrCSS = document.createElement('link');
dfsrCSS.rel = 'stylesheet';
dfsrCSS.href = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/dsfr.min.css';
document.head.appendChild(dfsrCSS);

// Style global avec les améliorations responsives et typographiques
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  /* We now load the Marianne font from the DSFR CSS */


  p {
    font-size: 0.85rem !important;
    line-height: 1.25rem !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    }

  .duels-guide {
    font-family: Marianne, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border: 1px solid #e6e6e6;
    transition: all 0.3s ease;
    position: fixed;
    top: 20px;
    right: 20px;
    width: min(290px, 90vw);
    max-height: 95vh; /* Allow more space, almost full viewport */
    overflow-y: auto; /* Keep scroll for the overall container */
    background-color: white;
    z-index: 10000;
    display: flex;
    flex-direction: column; /* Better for sticky header */
  }
  
  .duels-guide:not(.open) {
    transform: translateX(calc(100% + 30px));
  }
  
  .duels-header {
    background-color: #6a6af4;
    color: white;
    border-radius: 8px 8px 0 0;
    padding: 8px 12px;
    position: sticky;
    top: 0;
    z-index: 10001; /* Ensure it stays above other content */
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Add shadow for better visual separation */
    min-height: 25px; /* Shorter height */
    flex-shrink: 0; /* Prevent header from shrinking */
    width: 100%;
    box-sizing: border-box;
  }
  
  .duels-header h2 {
    margin: 0;
    font-weight: 600;
    font-size: 0.85rem;
    color: white;
  }
  
  .duels-navbar {
    display: flex;
    align-items: center;
  }
  
  .duels-resources-btn,
  .duels-paths-btn {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    font-size: 0.9rem;
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
  
  .duels-resources-btn:hover,
  .duels-paths-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
  
  .duels-resources-btn i,
  .duels-paths-btn i {
    font-size: 0.9rem;
  }
  
  .duels-paths-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    width: min(260px, 90vw);
    z-index: 10001;
    display: none;
    padding: 20px;
  }
  
  .duels-paths-dropdown.open {
    display: block;
    animation: fadeIn 0.2s ease;
  }
  
  .duels-dropdown-title {
    font-size: 0.95rem;
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
    font-size: 1rem;
    color: #6a6af4;
    margin-right: 12px;
  }
  
  .duels-path-info {
    flex: 1;
  }
  
  .duels-path-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #333;
    margin-bottom: 4px;
  }
  
  .duels-path-description {
    font-size: 0.8rem;
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
    font-size: 0.85rem;
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
    font-size: 0.8rem;
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
    font-size: 1rem;
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .duels-callout-content {
    flex: 1;
  }
  
  .duels-callout-title {
    margin-bottom: 4px;
    font-size: 0.85rem;
  }
  
  .duels-callout-text {
    font-size: 0.8rem;
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
    padding: 10px;
    background-color: #fafafa;
    border-radius: 0 0 8px 8px;
    max-height: none; /* Remove fixed height to adapt to content */
    overflow-y: visible; /* Allow content to expand */
    overflow-x: hidden;
    flex: 1 1 auto; /* Allow content to grow and take available space */
    padding-bottom: 40px; /* Extra padding at bottom to prevent content being cut off */
    width: 100%;
    box-sizing: border-box;
  }
  
  .duels-step {
    margin-bottom: 15px;
    height: auto;
    width: 100%;
    box-sizing: border-box;
  }
  
  .duels-step h3,
  .duels-accordion-header {
    color: #333;
    font-size: 0.95rem;
    margin-bottom: 12px;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  .duels-accordion-header {
    background-color: #f5f5f5;
    border-left: 4px solid #9898F8;
    padding: 10px 12px;
    font-weight: 600;
    border-radius: 4px;
    margin-bottom: 2px;
    cursor: pointer;
    transition: all 0.2s;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  /* Style différencié pour les tâches facilitateur */
  .duels-accordion.facilitator .duels-accordion-header {
    background-color: #f0f0f0;
    border-left: 4px solid #aaaaaa;
    color: #666;
    font-size: 0.85rem;
    padding: 8px 15px;
    font-weight: 500;
  }
  
  /* Style pour les étapes principales */
  .duels-accordion.main .duels-accordion-header {
    background-color: #f5f5f5;
    border-left: 4px solid #9898F8;
    color: #333;
    font-weight: 600;
  }
  
  .duels-accordion-header:hover {
    background-color: #f0f0ff;
  }
  
  .duels-accordion.facilitator .duels-accordion-header:hover {
    background-color: #e8e8e8;
  }
  
  .duels-accordion.active .duels-accordion-header {
    background-color: #e8e8ff;
    color: #000;
  }
  
  .duels-accordion.facilitator.active .duels-accordion-header {
    background-color: #e8e8e8;
    color: #444;
  }
  
  .duels-accordion-content {
    padding: 8px 8px;
    background-color: white;
    border-radius: 0 0 4px 4px;
    margin-bottom: 10px;
    display: none;
    border: 1px solid #eaeaea;
    border-top: none;
    line-height: 1.4;
    font-size: 0.75rem;
  }
  
  /* Style différencié pour les contenus de tâches facilitateur */
  .duels-accordion.facilitator .duels-accordion-content {
    padding: 10px;
    font-size: 0.85rem;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
  }
  
  .duels-accordion.active .duels-accordion-content {
    display: block;
    animation: fadeIn 0.3s ease;
    height: auto;
    overflow: visible;
  }
  
  /* Style du texte des instructions */
  .duels-accordion.main .duels-accordion-content p {
    color: #333;
    line-height: 1.4;
  }
  
  .duels-accordion.facilitator .duels-accordion-content p {
    color: #666 !important;
    line-height: 1.25rem !important;
    font-size: 0.75rem !important;
    margin: 0 0 0.5rem 0 !important;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .duels-resource-container {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .duels-resources-title {
    margin: 12px 0 5px 0;
    font-weight: 500;
    font-size: 0.75rem;
    color: #333;
    word-break: break-word;
  }
  
  .duels-resource-button {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 3px 5px;
    margin: 3px 0;
    background-color: white;
    color: #222 !important;
    text-decoration: none !important;
    border-radius: 3px;
    font-weight: 400;
    font-size: 0.6rem;
    line-height: 1.1;
    border: 1px solid #9898F8;
    box-shadow: none;
    outline: none;
    word-break: break-word;
    overflow-wrap: break-word;
    text-align: center;
    white-space: normal;
    min-height: 0;
    height: auto;
  }
  
  /* Removing hover effects and the black line */
  .duels-resource-button:hover,
  .duels-resource-button:focus,
  .duels-resource-button:active {
    background-color: white !important;
    color: #222 !important;
    opacity: 1 !important;
    --hover-tint: none !important;
    --active-tint: none !important;
    transform: none !important;
    outline: none !important;
    box-shadow: none !important;
    text-decoration: none !important;
  }
  
  .duels-fab {
    position: fixed;
    bottom: 15px;
    right: 15px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #9898F8;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
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
    font-size: 0.85rem;
  }
  
  .duels-suggestions {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .duels-suggestion {
    background-color: white;
    padding: 10px 15px;
    margin-bottom: 8px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    transition: all 0.2s;
    font-size: 0.85rem;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
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
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    word-break: break-word;
    overflow-wrap: break-word;
    width: 100%;
    box-sizing: border-box;
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
    margin-left: 10px;
    flex-shrink: 0;
  }
  
  .duels-persona.open::after {
    transform: rotate(180deg);
  }
  
  .duels-prompt {
    padding: 8px 10px 25px; /* Added padding at bottom for copy button */
    margin-top: -6px;
    margin-bottom: 8px;
    background-color: #f8f8ff;
    border: 1px solid #e0e0e0;
    border-top: none;
    border-radius: 0 0 4px 4px;
    font-size: 0.75rem;
    line-height: 1.2;
    display: none;
    color: #555;
    position: relative;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    width: 100%;
    box-sizing: border-box;
  }
  
  .duels-prompt.visible {
    display: block;
    animation: fadeIn 0.2s ease;
  }
  
  .duels-copy-button {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: #9898F8;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 2px 4px;
    font-size: 0.65rem;
    cursor: pointer;
    opacity: 0.8;
    transition: all 0.2s;
    z-index: 2;
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
    font-size: 0.85rem;
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
    font-size: 1rem;
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
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
    margin-left: 8px;
  }
  
  .duels-close-button:hover {
    opacity: 1;
  }
  
  /* Media queries for better responsiveness */
  @media (max-width: 768px) {
    .duels-guide {
      width: min(270px, 90vw);
      max-height: 92vh; /* Allow more vertical space on smaller screens */
    }
    
    .duels-content-container {
      padding: 15px;
    }
    
    .duels-header {
      padding: 12px 15px;
    }
    
    .duels-header h2 {
      font-size: 1rem;
    }
    
    /* Improve resource button display on smaller screens */
    .duels-resource-button, 
    .duels-resources-section a.duels-resource-button,
    #duels-resources-panel a.duels-resource-button {
      margin: 3px 3px 6px 0 !important; /* Smaller margins */
      padding: 4px 8px !important; /* Smaller padding */
      font-size: 0.7rem !important; /* Smaller text */
    }
  }
  
  @media (max-width: 480px) {
    .duels-guide {
      width: 90vw;
      top: 10px;
      right: 5vw;
      max-height: 95vh; /* Almost full viewport height on very small screens */
    }
    
    .duels-content-container {
      padding: 10px;
    }
    
    .duels-resources-section {
      padding: 15px;
    }
    
    /* Ensure resource buttons are well displayed on very small screens */
    .duels-resource-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .duels-resource-button, 
    .duels-resources-section a.duels-resource-button,
    #duels-resources-panel a.duels-resource-button {
      width: 100%;
      box-sizing: border-box;
      margin: 3px 0 !important;
      padding: 4px 6px !important;
      text-align: center;
      word-break: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      font-size: 0.65rem !important;
      line-height: 1.1 !important;
      min-height: 0 !important;
    }
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
      "choose_prompt", "evaluate_utility", "evaluate_frugality"
    ]
  }
};

// Bibliothèque d'étapes réutilisables
const stepsLibrary = {
  "start_duel": {
    id: "start_duel",
    order: 1,
    title: "Démarrer un duel",
    instruction: "Cliquez sur \"Commencer à discuter\" sur la page d'accueil ComparIA.",
    pages: ["main", "duel"], // Ajouté sur la page duel aussi
    suggestions: [],
    resources: [],
    media: [], // Images ou GIFs à afficher
    status: "completed" // Marquer comme complété
  },
  
  "select_mode": {
    id: "select_mode",
    order: 2,
    title: "Sélectionner le mode",
    instruction: "Choisissez \"David contre Goliath\" pour comparer un petit modèle avec un grand modèle.",
    pages: ["model_selection", "duel"],
    suggestions: [],
    resources: [],
    media: [], // Temporarily removed until images are properly set up
    callout: {
      type: "important", // types possibles: important, info, warning, success
      icon: "💡", // émoji ou classe d'icône FontAwesome (ex: "fas fa-info-circle")
      title: "Conseil facilitateur :",
      content: "Si vous voulez, vous pouvez aussi pré-sélectionner un grand et un petit modèle. Par exemple Gemma 3 4b contre Deepseek V3"
    }
  },
  
  "choose_prompt": {
    id: "choose_prompt",
    order: 3,
    title: "Étape 1 : Lancer une discussion",
    instruction: "Choisissez une question à envoyer aux deux modèles d'IA.",
    pages: ["duel"],
    suggestions: [
      "⚙️ Leila, ingénieure en mécanique : Ma machine à laver, que j'ai achetée il y a un an et demi, fuit. Écris un mail à l'entreprise qui me l'a vendue pour demander une intervention et une réparation sous garantie. Le mail doit être de 5 lignes maximum.",
      "🌱 Thomas, consultant en transition écologique : Reformule moi cette phrase - \"l'IA générative a un effet sur l'environnement donc il est nécessaire de l'utiliser de manière consciente\"",
      "👩‍🎓 Camille, étudiante : c'est quoi la différence entre un grand et un petit modèle d'IA générative ? Donne une réponse compréhensible en quelques mots",
      "👩🏻‍💼 Mei, cheffe de projet chez EDF : où trouver des petits modèles d'IA générative ? Réponse synthétique."
    ],
    resources: [
      {
        title: "Construire son prompt",
        url: ""
      }
    ],
    media: [],
    callout: {
      type: "important", // types possibles: important, info, warning, success
      icon: "💡", // émoji ou classe d'icône FontAwesome (ex: "fas fa-info-circle")
      title: "Important",
      content: "Si vous voulez, vous pouvez aussi co-construire un prompt ensemble sans piocher parmi les suggestions."
    },
    type: "main" // étape principale
  },
  
  "send_prompt": {
    id: "send_prompt",
    order: 4,
    title: "Envoyer le prompt",
    instruction: "Cliquez sur le bouton \"Envoyer\" et attendez les réponses des deux modèles.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: [] // Temporarily removed until images are properly set up
  },
  
  "evaluate_utility": {
    id: "evaluate_utility",
    order: 5,
    title: "Étape 2 : Voter",
    instruction: "Examinez les deux réponses et votez pour votre préférée.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: [],
    type: "main", // étape principale
    random_questions: [
      "Quelle réponse a le mieux répondu aux spécificités du prompt ?",
      "Auriez-vous formulé différemment la question pour obtenir une meilleure réponse ?",
      "Est ce qu’il aurait été possible de répondre à cette question sans IA ? Si oui, en combien de temps et avec quel(s) outil(s) ?",
      "À quel point la structure et la présentation de la réponse influencent votre appréciation ?",
      "À quel point le style d'écriture / le ton de l'IA influence votre appréciation ?"
    ]
  },
  
  "vote_response": {
    id: "vote_response",
    order: 6,
    title: "Voter pour une réponse",
    instruction: "Votez pour la réponse que vous préférez soit en mettant un like ou dislike sous le message, soit en cliquant sur le bouton Révélation des modèles et sélectionnant celui que vous avez préféré.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: [] // Temporarily removed until images are properly set up
  },
  
  "discover_impact": {
    id: "discover_impact",
    order: 7,
    title: "Découvrir l'impact",
    instruction: "Cliquez sur le bouton Révélation des modèles et regardez les estimations d'impact environnemental.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: [] // Temporarily removed until images are properly set up
  },
  
  "evaluate_frugality": {
    id: "evaluate_frugality",
    order: 8,
    title: "Étape 3 : Le jeu en vaut-il la chandelle ?",
    instruction: "Analysez si la différence de qualité entre les deux réponses justifie la différence d'impact environnemental.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: [],
    type: "main", // étape principale
    discussion_cards: [
      {
        question: "Est-ce que, en connaissance de l'impact environnemental des modèles, vous auriez voté pour l'autre modèle ?",
        color: "#6a6af4"
      },
      {
        question: "Dans quels cas académiques/professionnels privilégieriez-vous un petit modèle, et dans quels cas un grand modèle ?",
        color: "#ff9800"
      },
      {
        question: "Comment pourriez-vous adapter vos prompts pour obtenir de bons résultats même avec des petits modèles ?",
        color: "#4caf50"
      },
      {
        question: "Est-ce que votre manière d'utiliser des IA conversationnelles changera après la révélation de l'impact environnemental des modèles ?",
        color: "#2196f3"
      }
    ]
  },
  
  "pour_aller_plus_loin": {
    id: "pour_aller_plus_loin",
    order: 9,
    title: "Pour aller plus loin",
    instruction: "Découvrez des ressources complémentaires pour approfondir les notions d'impact environnemental des IA et de frugalité numérique.",
    pages: ["duel"],
    suggestions: [],
    resources: [
      {
        title: "⚡ Pourquoi les IA consomment-elles de l'électricité ?",
        url: "https://drive.google.com/file/d/189G2VMx52Htsm_JRj82AkcAXZ8qdIcbK/view"
      },
      {
        title: "📏 Qu'est-ce que la taille d'un modèle ?",
        url: "https://drive.google.com/file/d/1I-wrsF2rD2k8n8tp2N9qD_dkJaq3za5L/view"
      },
      {
        title: "🔍 ChatGPT ou Google : lequel est plus frugal ?",
        url: "https://drive.google.com/file/d/1GSzqbH2fZ5N7FLP7l3gOygmrZqLqZF6U/view"
      },
      {
        title: "🧠 Qu'est-ce qu'un modèle de raisonnement ?",
        url: "https://drive.google.com/file/d/1JCnZaZaklBEzqQrxlML8Drenf-1rmJl5/view"
      },
      {
        title: "🌱 Bonnes pratiques d'IA frugale",
        url: "https://drive.google.com/drive/folders/1oSgGJkBSHhj7ZXRe7iA-IwfzTy2fEZd7"
      }
    ],
    media: [],
    type: "resources_section", // Type spécial pour une section de ressources
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
  "educationalResources": [
    {
      title: "⚡ Pourquoi les IA consomment-elles de l'électricité ?",
      url: "https://drive.google.com/file/d/189G2VMx52Htsm_JRj82AkcAXZ8qdIcbK/view"
    },
    {
      title: "📏 Qu'est-ce que la taille d'un modèle ?",
      url: "https://drive.google.com/file/d/1I-wrsF2rD2k8n8tp2N9qD_dkJaq3za5L/view"
    },
    {
      title: "🔍 ChatGPT ou Google : lequel est plus frugal ?",
      url: "https://drive.google.com/file/d/1GSzqbH2fZ5N7FLP7l3gOygmrZqLqZF6U/view"
    },
    {
      title: "🧠 Qu'est-ce qu'un modèle de raisonnement ?",
      url: "https://drive.google.com/file/d/1JCnZaZaklBEzqQrxlML8Drenf-1rmJl5/view"
    },
    {
      title: "🌱 Bonnes pratiques d'IA frugale",
      url: "https://drive.google.com/drive/folders/1oSgGJkBSHhj7ZXRe7iA-IwfzTy2fEZd7"
    }
  ]
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

// State variables
let isGuideOpen = false;
let showingResources = false;

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

// Fonction pour adapter les éléments qui risquent d'être coupés
function adaptContentSize() {
  // Adjust resource buttons in choose_prompt step
  const resourceButtons = document.querySelectorAll('.duels-resource-button');
  resourceButtons.forEach(button => {
    if (button.clientWidth < button.scrollWidth) {
      // Content is being cut off, make font smaller
      button.style.fontSize = '0.55rem';
      button.style.padding = '2px 3px';
      button.style.lineHeight = '1';
    }
  });
  
  // Extra handling for personas and prompts
  const personas = document.querySelectorAll('.duels-persona');
  personas.forEach(persona => {
    if (persona.clientWidth < persona.scrollWidth) {
      persona.style.fontSize = '0.7rem';
    }
  });
}

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

// Function to create floating action button
function createFAB() {
  const fab = document.createElement('div');
  fab.className = 'duels-fab';
  fab.innerHTML = '⚔️'; // Swords emoji
  fab.title = 'Guide d\'Atelier';
  
  fab.addEventListener('click', toggleGuide);
  
  document.body.appendChild(fab);
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
  
  
  return resourcesPanel;
}

// Function to create a guide for the main page
// Note: All guide creation functions ensure resources are displayed last
// This maintains consistent positioning across all step types
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
    
    // Add class based on step type
    if (step.type === 'resources_section') {
      stepElement.classList.add('resources-section');
    } else {
      stepElement.classList.add('main');
    }
    
    // Mark current step as active
    if (step.order === currentSettings.currentStep) {
      stepElement.classList.add('active');
    }
    
    const stepTitle = document.createElement('h3');
    
    // Format by step type
    if (step.type === 'resources_section') {
      stepTitle.innerHTML = `<i class="fas fa-seedling" style="margin-right: 8px; font-size: 1rem; color: #6a6af4;"></i> ${step.title}`;
    } else {
      stepTitle.innerHTML = `<i class="fas fa-book" style="margin-right: 8px; font-size: 0.9rem; color: #6a6af4;"></i> ${step.title}`;
    }
    
    stepElement.appendChild(stepTitle);
    
    const stepInstructions = document.createElement('p');
    stepInstructions.innerHTML = step.instruction;
    stepElement.appendChild(stepInstructions);
    
    // Add callout if available
    renderCallout(step, stepElement);
    
    // Add random questions functionality if available
    if (step.random_questions && step.random_questions.length > 0) {
      renderRandomQuestions(step, stepElement);
    }
    
    // Add discussion cards if available
    if (step.discussion_cards && step.discussion_cards.length > 0) {
      renderDiscussionCards(step, stepElement);
    }
    
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
          console.log('Loading image:', media.url);
          
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
          console.log('Loading GIF:', media.url);
          
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
    
    // Add resources (always last)
    if (step.resources && step.resources.length > 0) {
      const resourceContainer = document.createElement('div');
      resourceContainer.className = 'duels-resource-container';
      
      const resourcesTitle = document.createElement('h4');
      resourcesTitle.className = 'duels-resources-title';
      resourcesTitle.textContent = 'Ressources:';
      resourceContainer.appendChild(resourcesTitle);
      
      step.resources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url || '#';
        resourceLink.target = '_blank';
        
        // Shortening long resource titles
        let title = resource.title;
        // Replace specific long titles with shorter versions
        if (title === "Comment bien construire son prompt ?") {
          title = "Construire son prompt";
        }
        resourceLink.textContent = title;
        
        // Apply special styling for small container
        resourceLink.style.fontSize = '0.6rem';
        resourceLink.style.padding = '3px 4px';
        resourceLink.style.fontWeight = '400';
        resourceLink.style.border = '1px solid #9898F8';
        
        // Add specific handling for step 3 (choose prompt step) and other specific resources
        if (step.id === 'choose_prompt') {
          resourceLink.style.fontSize = '0.5rem';  // Even smaller font
          resourceLink.style.padding = '2px 3px';  // Minimum padding
          resourceLink.style.margin = '2px 0';     // Minimum margin
          resourceLink.style.lineHeight = '1';     // Minimum line height
          
          // Handle this specific problematic button
          if (title === 'Construire son prompt') {
            resourceLink.style.fontWeight = '300';
            resourceLink.style.letterSpacing = '-0.2px';
          }
        }
        
        resourceContainer.appendChild(resourceLink);
      });
      
      stepElement.appendChild(resourceContainer);
    }
    
    stepsContainer.appendChild(stepElement);
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

// Fonction pour rendre les cartes de discussion
function renderDiscussionCards(step, container) {
  if (!step.discussion_cards || step.discussion_cards.length === 0) return;

  // Create a random questions container similar to the one in renderRandomQuestions
  const randomQuestionsContainer = document.createElement('div');
  randomQuestionsContainer.className = 'duels-random-questions-container';
  
  // Titre de la section
  const sectionTitle = document.createElement('h4');
  sectionTitle.className = 'duels-random-questions-title';
  sectionTitle.textContent = 'À débattre :';
  randomQuestionsContainer.appendChild(sectionTitle);
  
  // Conteneur pour la question affichée
  const questionDisplay = document.createElement('div');
  questionDisplay.className = 'duels-random-question-display';
  questionDisplay.textContent = 'Cliquez sur le dé pour générer une question';
  randomQuestionsContainer.appendChild(questionDisplay);
  
  // Bouton avec l'icône de dé pour générer une question aléatoire
  const diceButton = document.createElement('button');
  diceButton.className = 'duels-dice-button';
  diceButton.innerHTML = '<i class="fas fa-dice"></i>';
  diceButton.title = 'Générer une question aléatoire';
  randomQuestionsContainer.appendChild(diceButton);
  
  // Variables pour gérer l'affichage des questions
  
  // Index pour suivre la question actuelle
  let currentIndex = 0;
  
  // Fonction pour afficher la question suivante dans l'ordre
  function generateRandomQuestion() {
    // Si on a atteint la fin, revenir au début
    if (currentIndex >= step.discussion_cards.length) {
      currentIndex = 0;
    }
    
    // Récupérer la question à l'index actuel
    const cardData = step.discussion_cards[currentIndex];
    questionDisplay.textContent = cardData.question;
    
    // Add color accent based on the card color
    questionDisplay.style.borderLeft = `4px solid ${cardData.color || '#6a6af4'}`;
    
    // Incrémenter l'index pour la prochaine fois
    currentIndex++;
    
    // Animation du dé
    diceButton.classList.add('rolling');
    setTimeout(() => {
      diceButton.classList.remove('rolling');
    }, 500);
  }
  
  // Associer la fonction au clic sur le bouton
  diceButton.addEventListener('click', generateRandomQuestion);
  
  // Ajouter le conteneur au DOM
  container.appendChild(randomQuestionsContainer);
  
  // Générer une question initiale au hasard
  setTimeout(generateRandomQuestion, 500);
}

// Function to create a simplified guide for the model selection page (Step 2)
// Helper function to log image URL 
function logImageUrl(url) {
  console.log('Loading image URL:', url);
  return url;
}

// Note: All guide creation functions ensure resources are displayed last
// This maintains consistent positioning across all step types
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
    
    // Add class based on step type
    if (step.type === 'resources_section') {
      stepAccordion.classList.add('resources-section');
    } else {
      stepAccordion.classList.add('main');
    }
    
    // Mark current step as active
    if (step.order === currentSettings.currentStep) {
      stepAccordion.classList.add('active');
    }
    
    // Resources section is always active
    if (step.type === 'resources_section') {
      stepAccordion.classList.add('active');
    }
    
    // Make evaluate_frugality step active by default for demo purposes
    if (step.id === 'evaluate_frugality') {
      stepAccordion.classList.add('active');
    }
    
    const stepHeader = document.createElement('div');
    stepHeader.className = 'duels-accordion-header';
    
    // Format by step type
    if (step.type === 'resources_section') {
      stepHeader.innerHTML = `<i class="fas fa-seedling" style="margin-right: 8px; font-size: 1rem; color: #6a6af4;"></i> ${step.title}`;
    } else {
      stepHeader.innerHTML = `<i class="fas fa-book" style="margin-right: 8px; font-size: 0.9rem; color: #6a6af4;"></i> ${step.title}`;
    }    
    const stepContent = document.createElement('div');
    stepContent.className = 'duels-accordion-content';
    
    const stepInstructions = document.createElement('p');
    stepInstructions.innerHTML = step.instruction;
    stepContent.appendChild(stepInstructions);
    
    // Add callout if available
    renderCallout(step, stepContent);
    
    // Add random questions functionality if available
    if (step.random_questions && step.random_questions.length > 0) {
      renderRandomQuestions(step, stepContent);
    }
    
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
    
    // Add resources with special styling for resources_section (always last)
    if (step.resources && step.resources.length > 0) {
      const resourceContainer = document.createElement('div');
      resourceContainer.className = 'duels-resource-container';
      
      step.resources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url || '#';
        resourceLink.target = '_blank';
        resourceLink.textContent = resource.title;
        resourceContainer.appendChild(resourceLink);
      });
      
      stepContent.appendChild(resourceContainer);
    }
    
    stepAccordion.appendChild(stepHeader);
    stepAccordion.appendChild(stepContent);
    
    // Add click event to toggle accordion (except for resources section)
    if (step.type !== 'resources_section') {
      stepHeader.addEventListener('click', () => {
        stepAccordion.classList.toggle('active');
      });
    }
    
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
// Note: All guide creation functions ensure resources are displayed last
// This maintains consistent positioning across all step types
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
    
    // Add class based on step type
    if (step.type === 'resources_section') {
      stepAccordion.classList.add('resources-section');
    } else {
      stepAccordion.classList.add('main');
    }
    
    // Mark current step as active
    if (step.order === currentSettings.currentStep) {
      stepAccordion.classList.add('active');
    }
    
    // Make choose_prompt step active by default if it's present
    if (step.id === 'choose_prompt') {
      stepAccordion.classList.add('active');
    }
    
    // Resources section is always active
    if (step.type === 'resources_section') {
      stepAccordion.classList.add('active');
    }
    
    // Make evaluate_frugality step active by default for demo purposes
    if (step.id === 'evaluate_frugality') {
      stepAccordion.classList.add('active');
    }
    
    const stepHeader = document.createElement('div');
    stepHeader.className = 'duels-accordion-header';
    
    // Format by step type
    if (step.type === 'resources_section') {
      stepHeader.innerHTML = `<i class="fas fa-seedling" style="margin-right: 8px; font-size: 1rem; color: #6a6af4;"></i> ${step.title}`;
    } else {
      stepHeader.innerHTML = `<i class="fas fa-book" style="margin-right: 8px; font-size: 0.9rem; color: #6a6af4;"></i> ${step.title}`;
    }
    
    const stepContent = document.createElement('div');
    stepContent.className = 'duels-accordion-content';
    
    const stepInstructions = document.createElement('p');
    stepInstructions.innerHTML = step.instruction;
    stepContent.appendChild(stepInstructions);
    
    // Add callout if available
    renderCallout(step, stepContent);
    
    // Add random questions functionality if available
    if (step.random_questions && step.random_questions.length > 0) {
      renderRandomQuestions(step, stepContent);
    }
    
    // Add discussion cards if available
    if (step.discussion_cards && step.discussion_cards.length > 0) {
      renderDiscussionCards(step, stepContent);
    }
    
    // Add resources with special styling for resources_section (last)
    // Note: We're intentionally moving resources to the end of the function to ensure 
    // they always appear last, regardless of other content like suggestions or questions
    
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
    
    // Add resources with special styling for resources_section (always last)
    if (step.resources && step.resources.length > 0) {
      const resourceContainer = document.createElement('div');
      resourceContainer.className = 'duels-resource-container';
      
      step.resources.forEach(resource => {
        const resourceLink = document.createElement('a');
        resourceLink.className = 'duels-resource-button';
        resourceLink.href = resource.url || '#';
        resourceLink.target = '_blank';
        resourceLink.textContent = resource.title;
        resourceContainer.appendChild(resourceLink);
      });
      
      stepContent.appendChild(resourceContainer);
    }
    
    stepAccordion.appendChild(stepHeader);
    stepAccordion.appendChild(stepContent);
    
    // Add click event to toggle accordion (except for resources section)
    if (step.type !== 'resources_section') {
      stepHeader.addEventListener('click', () => {
        stepAccordion.classList.toggle('active');
      });
    }
    
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

// Function to create appropriate guide based on detected page
function createGuideForCurrentPage() {
  // Check what page we're on
  const isMainPage = window.location.pathname === "/" || window.location.pathname === "";
  const isModelSelectionPage = window.location.href.includes("/arene") && 
                           document.body.textContent.includes("Sélection des modèles");
  const isDuelPage = window.location.href.includes("/arene") && 
                    !document.body.textContent.includes("Sélection des modèles");
  
  // Create appropriate guide
  if (isMainPage) {
    createMainPageGuide();
  } else if (isModelSelectionPage) {
    createModelSelectionGuide();
  } else if (isDuelPage) {
    createDuelGuide();
  }
}

// Only continue if we're on the ComparIA site
// Function to apply consistent styling to all resource buttons
function applyResourceButtonStyles() {
  // Apply styling to all resource buttons
  const resourceButtons = document.querySelectorAll('.duels-resource-button');
  resourceButtons.forEach(button => {
    button.setAttribute('style', 'background-color: white !important; color: #222 !important; border: 2px solid #9898F8 !important; box-shadow: none !important; outline: none !important; text-decoration: none !important;');
    
    // Also remove any hover effects by adding event listeners
    button.addEventListener('mouseenter', (e) => {
      e.target.style.backgroundColor = 'white';
      e.target.style.color = '#222';
      e.target.style.boxShadow = 'none';
      e.target.style.outline = 'none';
      e.target.style.textDecoration = 'none';
      e.target.style.transform = 'none';
    });
  });
}

if (isComparIASite) {
  // Create the FAB
  createFAB();
  
  // Create guide for current page
  createGuideForCurrentPage();
  
  // Apply resource button styles and adapt content
  setTimeout(() => {
    applyResourceButtonStyles();
    adaptContentSize();
  }, 500);
  
  // Add URL change detection to handle navigation within the ComparIA site
  let lastUrl = window.location.href;
  
  // Create a MutationObserver to watch for URL changes
  const observer = new MutationObserver(() => {
    // Check for URL changes
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      
      // Remove existing guide
      const existingGuide = document.getElementById('duels-guide');
      if (existingGuide) {
        existingGuide.remove();
      }
      
      // Create appropriate guide
      createGuideForCurrentPage();
      
      // Apply resource button styles
      setTimeout(applyResourceButtonStyles, 500);
    }
  });
  
  // Start observing
  observer.observe(document, { subtree: true, childList: true });
  
  
  // Observer pour l'application des styles des boutons de ressources
  const styleObserver = new MutationObserver(() => {
    // Petit délai pour s'assurer que le DOM est bien mis à jour
    setTimeout(() => {
      applyResourceButtonStyles();
      adaptContentSize(); // Add dynamic content adaptation
    }, 50);
  });
  
  // Observer le DOM pour les changements
  styleObserver.observe(document.body, { 
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
}

// Fonction pour rendre et gérer la fonctionnalité de questions aléatoires
function renderRandomQuestions(step, container) {
  if (!step.random_questions || step.random_questions.length === 0) return;
  
  // Si c'est l'étape 2 (evaluate_utility), on utilise un formulaire spécial
  if (step.id === 'evaluate_utility') {
    // Container pour la section de questions
    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'duels-random-questions-container';
    
    // Titre de la section
    const sectionTitle = document.createElement('h4');
    sectionTitle.className = 'duels-random-questions-title';
    sectionTitle.textContent = 'À débattre :';
    questionsContainer.appendChild(sectionTitle);
    
    // Question principale
    const mainQuestion = document.createElement('div');
    mainQuestion.className = 'duels-question-main';
    mainQuestion.innerHTML = "Est ce qu'il aurait été possible de répondre à cette question sans IA ?";
    questionsContainer.appendChild(mainQuestion);
    
    // Form pour la réponse Oui/Non
    const yesNoContainer = document.createElement('div');
    yesNoContainer.className = 'duels-yesno-container';
    
    const yesLabel = document.createElement('label');
    yesLabel.className = 'duels-radio-label';
    const yesInput = document.createElement('input');
    yesInput.type = 'radio';
    yesInput.name = 'ai-alternative';
    yesInput.value = 'yes';
    yesInput.className = 'duels-radio';
    yesLabel.appendChild(yesInput);
    yesLabel.appendChild(document.createTextNode(' Oui'));
    
    const noLabel = document.createElement('label');
    noLabel.className = 'duels-radio-label';
    const noInput = document.createElement('input');
    noInput.type = 'radio';
    noInput.name = 'ai-alternative';
    noInput.value = 'no';
    noInput.className = 'duels-radio';
    noLabel.appendChild(noInput);
    noLabel.appendChild(document.createTextNode(' Non'));
    
    yesNoContainer.appendChild(yesLabel);
    yesNoContainer.appendChild(noLabel);
    questionsContainer.appendChild(yesNoContainer);
    
    // Sous-question qui apparaît lorsque "Oui" est sélectionné
    const conditionalFields = document.createElement('div');
    conditionalFields.className = 'duels-conditional-fields';
    conditionalFields.style.display = 'none';
    
    // Question du temps uniquement
    const timeLabel = document.createElement('label');
    timeLabel.className = 'duels-field-label';
    timeLabel.textContent = 'En combien de temps ?';
    const timeInput = document.createElement('input');
    timeInput.type = 'text';
    timeInput.className = 'duels-text-input';
    timeInput.placeholder = 'Ex: 5 minutes, 1 heure...';
    
    conditionalFields.appendChild(timeLabel);
    conditionalFields.appendChild(timeInput);
    
    questionsContainer.appendChild(conditionalFields);
    
    // Événement pour afficher/masquer les champs conditionnels
    yesInput.addEventListener('change', function() {
      if (this.checked) {
        conditionalFields.style.display = 'block';
      }
    });
    
    noInput.addEventListener('change', function() {
      if (this.checked) {
        conditionalFields.style.display = 'none';
      }
    });
    
    // Ajouter le conteneur au DOM
    container.appendChild(questionsContainer);
    
  } else {
    // Pour les autres étapes, on garde le comportement original avec le dé
    // Container pour la section de questions aléatoires
    const randomQuestionsContainer = document.createElement('div');
    randomQuestionsContainer.className = 'duels-random-questions-container';
    
    // Titre de la section
    const sectionTitle = document.createElement('h4');
    sectionTitle.className = 'duels-random-questions-title';
    sectionTitle.textContent = 'À débattre :';
    randomQuestionsContainer.appendChild(sectionTitle);
    
    // Conteneur pour la question affichée
    const questionDisplay = document.createElement('div');
    questionDisplay.className = 'duels-random-question-display';
    questionDisplay.textContent = 'Cliquez sur le dé pour générer une question';
    randomQuestionsContainer.appendChild(questionDisplay);
    
    // Bouton avec l'icône de dé pour générer une question aléatoire
    const diceButton = document.createElement('button');
    diceButton.className = 'duels-dice-button';
    diceButton.innerHTML = '<i class="fas fa-dice"></i>';
    diceButton.title = 'Générer une question aléatoire';
    randomQuestionsContainer.appendChild(diceButton);
    
    // Index pour suivre la question actuelle
    let currentIndex = 0;
    
    // Fonction pour afficher la question suivante dans l'ordre
    function generateRandomQuestion() {
      // Si on a atteint la fin, revenir au début
      if (currentIndex >= step.random_questions.length) {
        currentIndex = 0;
      }
      
      // Récupérer la question à l'index actuel
      questionDisplay.textContent = step.random_questions[currentIndex];
      
      // Incrémenter l'index pour la prochaine fois
      currentIndex++;
      
      // Animation du dé
      diceButton.classList.add('rolling');
      setTimeout(() => {
        diceButton.classList.remove('rolling');
      }, 500);
    }
    
    // Associer la fonction au clic sur le bouton
    diceButton.addEventListener('click', generateRandomQuestion);
    
    // Ajouter le conteneur au DOM
    container.appendChild(randomQuestionsContainer);
  }
  
  // Ajouter le style CSS pour cette fonctionnalité
  if (!document.getElementById('random-questions-style')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'random-questions-style';
    styleElement.innerHTML = `
      .duels-random-questions-container {
        margin: 15px 0;
        padding: 10px 15px;
        background-color: #f5f5ff;
        border-radius: 6px;
        border: 1px solid #ddd;
        position: relative;
      }
      
      .duels-random-questions-title {
        font-size: 0.9rem;
        color: #6a6af4;
        margin-bottom: 12px;
        font-weight: 600;
      }
      
      .duels-random-question-display {
        padding: 12px;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        margin-bottom: 10px;
        font-size: 0.9rem;
        min-height: 20px;
      }
      
      .duels-dice-button {
        position: absolute;
        top: 10px;
        right: 15px;
        background-color: #6a6af4;
        color: white;
        border: none;
        border-radius: 4px;
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .duels-dice-button:hover {
        background-color: #5a5ad4;
        transform: translateY(-2px);
      }
      
      .duels-dice-button.rolling {
        animation: roll 0.5s ease;
      }
      
      @keyframes roll {
        0% { transform: rotate(0deg); }
        20% { transform: rotate(-30deg); }
        40% { transform: rotate(30deg); }
        60% { transform: rotate(-15deg); }
        80% { transform: rotate(15deg); }
        100% { transform: rotate(0deg); }
      }
      
      /* Styles pour le formulaire de l'étape 2 */
      .duels-question-main {
        padding: 12px;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        margin-bottom: 15px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
      }
      
      .duels-yesno-container {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;
        padding: 0 10px;
      }
      
      .duels-radio-label {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        cursor: pointer;
        color: #333;
      }
      
      .duels-radio {
        margin-right: 5px;
        cursor: pointer;
      }
      
      .duels-conditional-fields {
        background-color: white;
        padding: 15px;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        margin-top: 5px;
      }
      
      .duels-field-label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 5px;
        color: #333;
      }
      
      .duels-text-input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.85rem;
        margin-bottom: 12px;
        font-family: inherit;
      }
      
      .duels-text-input:focus {
        border-color: #6a6af4;
        outline: none;
        box-shadow: 0 0 0 2px rgba(106, 106, 244, 0.2);
      }
    `;
    document.head.appendChild(styleElement);
  }
}

// Function to initialize facilitator task visibility
