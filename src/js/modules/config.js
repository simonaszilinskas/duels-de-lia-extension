// config.js - Configuration data for the extension

// Structure des parcours d'atelier
export const workshopPaths = {
  // Parcours principal unique pour le moment
  "duels": {
    id: "duels",
    name: "Les Duels de l'IA",
    description: "Atelier standard: découvrir l'impact environnemental des IA",
    icon: "fas fa-bolt",
    steps: [
      // Les étapes sont définies dans stepsLibrary et référencées par leur ID
      "start_duel", "enter_prompt", "send_prompt", 
      "vote_response", "discover_impact", "worth_it"
    ]
  }
};

// Bibliothèque d'étapes réutilisables
export const stepsLibrary = {
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
  
  
  "enter_prompt": {
    id: "enter_prompt",
    order: 2,
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
    order: 3,
    title: "Cliquer sur \"Envoyer\"",
    instruction: "Attendez les réponses des deux modèles.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: []
  },
  
  "vote_response": {
    id: "vote_response",
    order: 4,
    title: "Voter sur les réponses",
    instruction: "\"Quelle réponse préférez-vous ?\"",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: []
  },
  
  "discover_impact": {
    id: "discover_impact",
    order: 5,
    title: "Découvrir l'impact environnemental",
    instruction: "Cliquez pour révéler quel modèle est lequel. Examinez les métriques d'impact environnemental pour chaque modèle.",
    pages: ["duel"],
    suggestions: [],
    resources: [],
    media: []
  },
  
  "worth_it": {
    id: "worth_it",
    order: 6,
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
export const commonResources = {
  "promptSuggestions": [
    "⚙️ Leila, ingénieure en mécanique : Ma machine à laver, que j'ai achetée il y a un an et demi, fuit. Écris un mail à l'entreprise qui me l'a vendue pour demander une intervention et une réparation sous garantie. Le mail doit être de 5 lignes maximum.",
    "🌱 Thomas, consultant en transition écologique : Reformule moi cette phrase - \"l'IA générative a un effet sur l'environnement donc il est nécessaire de l'utiliser de manière consciente\"",
    "👩‍🎓 Camille, étudiante : c'est quoi la différence entre un grand et un petit modèle d'IA générative ? Donne une réponse compréhensible en quelques mots",
    "👩🏻‍💼 Mei, cheffe de projet chez EDF : où trouver des petits modèles d'IA générative ? Réponse synthétique."
  ],
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
export const defaultSettings = {
  activePath: "duels", // Parcours actif par défaut
  showCompletedSteps: true, // Afficher/masquer les étapes terminées
  currentStep: 1 // Étape actuelle
};