// Duels de l'IA - Redesigned Content Script
(function() {
  'use strict';
  
  // Content data embedded directly
  const CONTENT_DATA = {
    'comment-se-deroule': {
      title: "Comment se déroule un duel ?",
      steps: [
        {
          title: "Choisissez David contre Goliath",
          description: "Ce mode permet de comparer un petit modèle économe avec un grand modèle"
        },
        {
          title: "Envoyez votre prompt",
          description: "Sélectionnez le parmi les suggestions de prompts ou co-construisez le avec le public"
        },
        {
          title: "Examinez les réponses et votez",
          description: "Échangez puis votez avec le public pour votre modèle préféré"
        },
        {
          title: "Terminez par le débat général",
          description: "Tous ensemble, débattez sur le sujet \"Le jeu en vaut-il la chandelle ?\" à travers des questions de relance"
        }
      ],
      blocks: {
        prompts: {
          icon: "✍️",
          title: "Prompts",
          description: "Liste de prompts prêts à l'usage",
          content: `
            <h3>Prompts pour démarrer</h3>
            <ul>
              <li>"Explique la différence entre IA forte et IA faible"</li>
              <li>"Comment l'IA peut-elle aider dans l'éducation ?"</li>
              <li>"Quels sont les risques de l'IA pour l'emploi ?"</li>
              <li>"Décris l'impact environnemental de ChatGPT"</li>
            </ul>
          `
        },
        cartes: {
          icon: "🃏",
          title: "Cartes débat",
          description: "Pour susciter le débat parmi les participants",
          content: `
            <h3>Cartes pour animer le débat</h3>
            <div style="display: grid; gap: 12px;">
              <div style="background: #f7f6ff; padding: 16px; border-radius: 8px; border-left: 4px solid #715CF6;">
                <strong>Carte 1: Créativité</strong><br>
                L'IA peut-elle vraiment être créative ou ne fait-elle qu'imiter ?
              </div>
              <div style="background: #f7f6ff; padding: 16px; border-radius: 8px; border-left: 4px solid #715CF6;">
                <strong>Carte 2: Éthique</strong><br>
                Qui est responsable quand une IA prend une mauvaise décision ?
              </div>
              <div style="background: #f7f6ff; padding: 16px; border-radius: 8px; border-left: 4px solid #715CF6;">
                <strong>Carte 3: Avenir</strong><br>
                Dans 10 ans, quel métier aura disparu à cause de l'IA ?
              </div>
            </div>
          `
        },
        ressources: {
          icon: "📚",
          title: "Ressources",
          description: "Slides complètes pour aller plus loin",
          content: `
            <h3>Ressources pédagogiques</h3>
            <ul>
              <li>📊 <a href="#" target="_blank">Présentation générale sur l'IA</a></li>
              <li>📈 <a href="#" target="_blank">Guide du facilitateur</a></li>
              <li>🎮 <a href="#" target="_blank">Activités ludiques autour de l'IA</a></li>
              <li>📚 <a href="#" target="_blank">Bibliographie recommandée</a></li>
            </ul>
          `
        },
        faq: {
          icon: "❓",
          title: "FAQ", 
          description: "Réponses aux questions générales sur l'IA",
          content: `
            <h3>Questions fréquentes</h3>
            <div style="display: grid; gap: 16px;">
              <div>
                <h4 style="color: #715CF6;">Q: Qu'est-ce qu'un duel de l'IA ?</h4>
                <p>R: Un atelier participatif où les participants débattent des enjeux de l'IA de manière ludique et accessible.</p>
              </div>
              <div>
                <h4 style="color: #715CF6;">Q: Combien de temps dure un duel ?</h4>
                <p>R: Entre 45 minutes et 2 heures selon le format choisi.</p>
              </div>
              <div>
                <h4 style="color: #715CF6;">Q: Faut-il des connaissances techniques ?</h4>
                <p>R: Non, les duels sont conçus pour être accessibles à tous les publics.</p>
              </div>
            </div>
          `
        }
      },
      ultimateQuestion: "Le jeu en vaut-il la chandelle ?"
    }
  };

  let currentView = 'main';
  let currentSection = 'comment-se-deroule';
  let currentBlock = null;

  // Create FAB button
  function createFAB() {
    const fab = document.createElement('button');
    fab.id = 'duelsia-fab';
    fab.innerHTML = '🤖';
    fab.title = 'Duels de l\'IA';
    fab.addEventListener('click', toggleModal);
    document.body.appendChild(fab);
  }

  // Create redesigned modal interface
  function createModal() {
    const panel = document.createElement('div');
    panel.id = 'duelsia-panel';
    panel.className = 'duelsia-hidden';
    
    panel.innerHTML = `
      <div class="duelsia-panel-content">
        <div class="duelsia-header duelsia-draggable">
          <span>Aide facilitateur - Duel de l'IA</span>
          <button class="duelsia-close">✕</button>
        </div>
        
        <div class="duelsia-main-content">
          <div class="duelsia-dropdown-container" id="duelsia-dropdown">
            <span>Comment se déroule un duel ?</span>
            <span class="duelsia-dropdown-icon">⌄</span>
            
            <div class="duelsia-dropdown-content" id="duelsia-dropdown-content">
              <ol>
                ${CONTENT_DATA['comment-se-deroule'].steps.map(step => `
                  <li>
                    <strong>${step.title}</strong>
                    <p>${step.description}</p>
                  </li>
                `).join('')}
              </ol>
            </div>
          </div>
          
          <div class="duelsia-overlay" id="duelsia-overlay"></div>
          
          <div class="duelsia-card-grid" id="duelsia-cards">
            <!-- Cards will be dynamically inserted here -->
          </div>
          
          <div class="duelsia-footer-link">
            <a href="#" id="duelsia-ultimate-link">Le jeu en vaut-il la chandelle ?</a>
          </div>
        </div>
        
        <div class="duelsia-content-view" style="display: none;">
          <div class="duelsia-content-nav">
            <button class="duelsia-back-button">← Retour</button>
            <h3 id="duelsia-content-title"></h3>
            <button class="duelsia-close duelsia-close-content">✕</button>
          </div>
          <div class="duelsia-content-display" id="duelsia-content-display">
            <!-- Content will be dynamically inserted here -->
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Make panel draggable
    makeElementDraggable(panel);
    
    // Event listeners
    panel.querySelector('.duelsia-close').addEventListener('click', toggleModal);
    panel.querySelector('.duelsia-close-content').addEventListener('click', toggleModal);
    panel.querySelector('.duelsia-back-button').addEventListener('click', showMainView);
    panel.querySelector('.duelsia-dropdown-container').addEventListener('click', toggleDropdown);
    
    // Setup overlay
    setupOverlay();
    
    // Initial render
    renderCards();
  }

  // Render cards based on current section
  function renderCards() {
    const cardsContainer = document.getElementById('duelsia-cards');
    const sectionData = CONTENT_DATA[currentSection];
    
    if (!sectionData) return;
    
    const cardsHTML = Object.entries(sectionData.blocks).map(([key, block]) => `
      <div class="duelsia-card" data-block="${key}">
        <div class="duelsia-emoji">${block.icon}</div>
        <h3>${block.title}</h3>
        <p>${block.description}</p>
      </div>
    `).join('');
    
    cardsContainer.innerHTML = cardsHTML;
    
    // Add click handlers to cards
    cardsContainer.querySelectorAll('.duelsia-card').forEach(card => {
      card.addEventListener('click', () => {
        const blockKey = card.dataset.block;
        showBlockContent(blockKey);
      });
    });
    
    // Update ultimate question link
    const ultimateLink = document.getElementById('duelsia-ultimate-link');
    if (sectionData.ultimateQuestion) {
      ultimateLink.textContent = sectionData.ultimateQuestion;
    }
  }

  // Show block content
  function showBlockContent(blockKey) {
    const sectionData = CONTENT_DATA[currentSection];
    const block = sectionData.blocks[blockKey];
    
    if (!block) return;
    
    currentBlock = blockKey;
    currentView = 'content';
    
    document.getElementById('duelsia-content-title').textContent = block.title;
    document.getElementById('duelsia-content-display').innerHTML = block.content;
    
    document.querySelector('.duelsia-main-content').style.display = 'none';
    document.querySelector('.duelsia-content-view').style.display = 'flex';
  }

  // Show main view
  function showMainView() {
    currentView = 'main';
    currentBlock = null;
    
    document.querySelector('.duelsia-main-content').style.display = 'block';
    document.querySelector('.duelsia-content-view').style.display = 'none';
  }

  // Toggle dropdown content
  function toggleDropdown() {
    const content = document.getElementById('duelsia-dropdown-content');
    const overlay = document.getElementById('duelsia-overlay');
    const icon = document.querySelector('.duelsia-dropdown-icon');
    
    content.classList.toggle('show');
    overlay.classList.toggle('show');
    icon.classList.toggle('rotate');
  }
  
  // Close dropdown when clicking overlay
  function setupOverlay() {
    const overlay = document.getElementById('duelsia-overlay');
    if (overlay) {
      overlay.addEventListener('click', toggleDropdown);
    }
  }

  // Toggle modal visibility
  function toggleModal() {
    const panel = document.getElementById('duelsia-panel');
    panel.classList.toggle('duelsia-hidden');
    
    if (!panel.classList.contains('duelsia-hidden') && currentView === 'content') {
      showMainView();
    }
  }

  // Make element draggable
  function makeElementDraggable(element) {
    const header = element.querySelector('.duelsia-draggable');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
      if (e.target.closest('.duelsia-close')) return;
      
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target.closest('.duelsia-draggable')) {
        isDragging = true;
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }
  }

  // Initialize extension
  function initialize() {
    // Create styles
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = chrome.runtime.getURL('css/new-styles.css');
    document.head.appendChild(style);
    
    // Create UI elements
    createFAB();
    createModal();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();