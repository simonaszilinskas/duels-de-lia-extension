// Content Loader Module
(function() {
  'use strict';
  
  const ContentLoader = {
    // Cache for loaded content
    contentCache: null,
    
    /**
     * Load content data from JSON file
     * @returns {Promise<Object>} Content data
     */
    async loadContent() {
      if (this.contentCache) {
        return this.contentCache;
      }
      
      try {
        const response = await fetch(chrome.runtime.getURL('data/content-data.json'));
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        
        const data = await response.json();
        this.contentCache = data;
        return data;
      } catch (error) {
        console.error('Error loading content data:', error);
        // Fallback to embedded data if JSON fails to load
        return this.getFallbackContent();
      }
    },
    
    /**
     * Get fallback content if JSON loading fails
     * @returns {Object} Fallback content data
     */
    getFallbackContent() {
      return {
        duels: {
          'comment-se-deroule': {
            title: "Comment se déroule un duel ?",
            steps: [
              {
                title: "Choisissez David contre Goliath",
                description: "Ce mode permet de comparer un petit modèle économe avec un grand modèle"
              }
            ],
            blocks: {
              prompts: {
                icon: "✍️",
                title: "Prompts",
                description: "Liste de prompts prêts à l'usage",
                personas: []
              },
              cartes: {
                icon: "🃏",
                title: "Cartes débat",
                description: "Pour susciter le débat parmi les participants",
                cards: []
              },
              ressources: {
                icon: "📚",
                title: "Ressources",
                description: "Slides complètes pour aller plus loin",
                items: []
              },
              faq: {
                icon: "❓",
                title: "FAQ",
                description: "Réponses aux questions générales sur l'IA",
                questions: []
              }
            },
            ultimateQuestion: "Le jeu en vaut-il la chandelle ?"
          }
        }
      };
    },
    
    /**
     * Clear content cache
     */
    clearCache() {
      this.contentCache = null;
    }
  };
  
  // Make ContentLoader available globally within the extension
  window.DuelsContentLoader = ContentLoader;
})();