// Duels de l'IA - Content Script
(function() {
  'use strict';
  
  // Content data embedded directly
  const CONTENT_DATA = {
    impact: {
      title: "💡 Impact environnemental",
      blocks: {
        prompt: {
          title: "Prompts éco-responsables",
          content: `
            <h3>Comment formuler des prompts éco-responsables ?</h3>
            <ul>
              <li>Soyez précis dès le début pour éviter les itérations inutiles</li>
              <li>Évitez les requêtes en chaîne quand une seule suffit</li>
              <li>Préférez les modèles adaptés à votre besoin (pas toujours le plus gros)</li>
              <li>Réutilisez les réponses existantes quand c'est possible</li>
            </ul>
            <p><strong>Exemple concret :</strong></p>
            <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin: 12px 0;">
              Au lieu de : "Qu'est-ce que le réchauffement climatique ?"<br>
              Préférez : "Explique en 3 points les principales causes du réchauffement climatique"
            </div>
          `
        },
        debate: {
          title: "Cartes débat",
          content: `
            <h3>Questions pour animer le débat</h3>
            <div style="display: grid; gap: 12px;">
              <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <strong>🤔 Question 1:</strong><br>
                L'IA peut-elle être une solution au changement climatique ou fait-elle partie du problème ?
              </div>
              <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <strong>🤔 Question 2:</strong><br>
                Comment mesurer l'impact environnemental réel de nos usages de l'IA ?
              </div>
              <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <strong>🤔 Question 3:</strong><br>
                Quels critères utiliser pour choisir un modèle d'IA plus responsable ?
              </div>
            </div>
          `
        },
        resources: {
          title: "Ressources pédagogiques",
          content: `
            <h3>Pour approfondir</h3>
            <ul style="line-height: 1.8;">
              <li>📊 <a href="https://www.nature.com/articles/s41558-022-01377-7" target="_blank">Étude sur l'empreinte carbone de l'IA</a></li>
              <li>📈 <a href="https://arxiv.org/abs/1906.02243" target="_blank">Energy and Policy Considerations for Deep Learning in NLP</a></li>
              <li>🎮 <a href="https://huggingface.co/spaces/huggingface/carbon-footprint" target="_blank">Calculateur d'empreinte carbone Hugging Face</a></li>
              <li>📚 <a href="https://www.thegreenwebfoundation.org/" target="_blank">The Green Web Foundation</a></li>
            </ul>
            <p style="margin-top: 16px;"><strong>Chiffres clés :</strong></p>
            <div style="background: #fef3c7; padding: 12px; border-radius: 8px;">
              • L'entraînement de GPT-3 = ~550 tonnes de CO2<br>
              • Une requête ChatGPT = ~4,32g de CO2<br>
              • Data centers = 1% de la consommation électrique mondiale
            </div>
          `
        },
        faq: {
          title: "FAQ",
          content: `
            <h3>Questions fréquentes</h3>
            <div style="display: grid; gap: 16px;">
              <div>
                <h4 style="color: #2563eb;">Q: L'IA consomme-t-elle vraiment beaucoup d'énergie ?</h4>
                <p>R: Oui, particulièrement pendant l'entraînement. Par exemple, l'entraînement de GPT-3 a nécessité autant d'énergie que 120 foyers américains pendant un an.</p>
              </div>
              <div>
                <h4 style="color: #2563eb;">Q: Peut-on utiliser l'IA de manière éco-responsable ?</h4>
                <p>R: Absolument ! En choisissant des modèles adaptés, en optimisant nos prompts, et en privilégiant des services alimentés en énergie renouvelable.</p>
              </div>
              <div>
                <h4 style="color: #2563eb;">Q: Comment réduire mon impact ?</h4>
                <p>R: Évitez les requêtes inutiles, réutilisez les réponses, préférez des modèles plus petits quand c'est suffisant, et sensibilisez votre entourage.</p>
              </div>
            </div>
          `
        }
      },
      ultimateQuestion: {
        question: "Comment concilier innovation technologique et responsabilité environnementale dans l'usage de l'IA ?",
        link: "https://comparia.beta.gouv.fr/conclusion-impact",
        linkText: "Découvrir la conclusion →"
      }
    },
    bias: {
      title: "Biais",
      blocks: {},
      ultimateQuestion: {
        question: "Comment garantir une IA équitable et non discriminante ?",
        link: "https://comparia.beta.gouv.fr/conclusion-biais",
        linkText: "Découvrir la conclusion →"
      }
    },
    sovereignty: {
      title: "Souveraineté numérique",
      blocks: {},
      ultimateQuestion: {
        question: "Comment préserver notre autonomie numérique face aux géants de l'IA ?",
        link: "https://comparia.beta.gouv.fr/conclusion-souverainete",
        linkText: "Découvrir la conclusion →"
      }
    }
  };

  // Create FAB button
  function createFAB() {
    const fab = document.createElement('button');
    fab.id = 'duelsia-fab';
    fab.innerHTML = '🤖';
    fab.title = 'Duels de l\'IA';
    fab.addEventListener('click', toggleModal);
    document.body.appendChild(fab);
  }

  // Create draggable panel interface
  function createModal() {
    // Create draggable panel
    const panel = document.createElement('div');
    panel.id = 'duelsia-panel';
    panel.className = 'duelsia-hidden';
    
    panel.innerHTML = `
      <div class="duelsia-panel-content">
        <div class="duelsia-header duelsia-draggable">
          <h2>Duels de l'IA</h2>
          <button class="duelsia-close">✕</button>
        </div>
        
        <div class="duelsia-tabs">
          <button class="duelsia-tab active" data-tab="impact">💡 Impact environnemental</button>
          <button class="duelsia-tab" data-tab="bias">Biais</button>
          <button class="duelsia-tab" data-tab="sovereignty">Souveraineté numérique</button>
        </div>
        
        <div class="duelsia-tab-content" id="impact-content">
          <div class="duelsia-blocks">
            <button class="duelsia-block" data-action="prompt">
              <span class="duelsia-block-icon">💬</span>
              <span class="duelsia-block-text">Prompt</span>
            </button>
            <button class="duelsia-block" data-action="debate">
              <span class="duelsia-block-icon">🎯</span>
              <span class="duelsia-block-text">Cartes débat</span>
            </button>
            <button class="duelsia-block" data-action="resources">
              <span class="duelsia-block-icon">📚</span>
              <span class="duelsia-block-text">Ressource pédagogique</span>
            </button>
            <button class="duelsia-block" data-action="faq">
              <span class="duelsia-block-icon">❓</span>
              <span class="duelsia-block-text">FAQ</span>
            </button>
          </div>
          
          <button class="duelsia-reveal" data-tab="impact">Révéler la question ultime</button>
          
          <div class="duelsia-ultimate-question hidden" id="impact-question">
            <p>${CONTENT_DATA.impact.ultimateQuestion.question}</p>
            <a href="${CONTENT_DATA.impact.ultimateQuestion.link}" target="_blank">${CONTENT_DATA.impact.ultimateQuestion.linkText}</a>
          </div>
        </div>
        
        <div class="duelsia-tab-content hidden" id="bias-content">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
            <h3 style="color: #6b7280; font-size: 24px; margin-bottom: 16px;">Contenu à venir</h3>
            <p style="color: #9ca3af; font-size: 16px;">Cette section sera bientôt disponible</p>
          </div>
        </div>
        
        <div class="duelsia-tab-content hidden" id="sovereignty-content">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
            <h3 style="color: #6b7280; font-size: 24px; margin-bottom: 16px;">Contenu à venir</h3>
            <p style="color: #9ca3af; font-size: 16px;">Cette section sera bientôt disponible</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Make panel draggable
    initDraggable(panel);
  }

  // Toggle panel visibility
  function toggleModal() {
    const panel = document.getElementById('duelsia-panel');
    panel.classList.toggle('duelsia-hidden');
  }

  // Initialize tab switching
  function initTabs() {
    const tabs = document.querySelectorAll('.duelsia-tab');
    const contents = document.querySelectorAll('.duelsia-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update visible content
        contents.forEach(content => content.classList.add('hidden'));
        document.getElementById(`${targetTab}-content`).classList.remove('hidden');
      });
    });
  }

  // Initialize block actions
  function initBlocks() {
    const blocks = document.querySelectorAll('.duelsia-block');
    
    blocks.forEach(block => {
      block.addEventListener('click', () => {
        const action = block.getAttribute('data-action');
        handleBlockAction(action);
      });
    });
  }

  // Handle block actions
  function handleBlockAction(action) {
    const activeTab = document.querySelector('.duelsia-tab.active').getAttribute('data-tab');
    
    // Use the embedded CONTENT_DATA
    if (CONTENT_DATA[activeTab]?.blocks[action]) {
      showBlockContent(CONTENT_DATA[activeTab].blocks[action], activeTab);
    } else {
      alert(`Contenu "${action}" à venir`);
    }
  }
  
  // Show block content inside the panel
  function showBlockContent(blockData, tabId) {
    const tabContent = document.getElementById(`${tabId}-content`);
    
    // Store the original content
    const originalContent = tabContent.innerHTML;
    
    // Create content view
    const contentView = `
      <div class="duelsia-content-view">
        <div class="duelsia-content-nav">
          <button class="duelsia-back-button">← Retour</button>
          <h3>${blockData.title}</h3>
        </div>
        <div class="duelsia-content-display">
          ${blockData.content}
        </div>
      </div>
    `;
    
    // Replace tab content with detail view
    tabContent.innerHTML = contentView;
    
    // Add event listener to back button
    tabContent.querySelector('.duelsia-back-button').addEventListener('click', () => {
      tabContent.innerHTML = originalContent;
      initBlocks(); // Reinitialize block listeners
      initRevealButtons(); // Reinitialize reveal button
    });
  }

  // Initialize reveal buttons
  function initRevealButtons() {
    const revealButtons = document.querySelectorAll('.duelsia-reveal');
    
    revealButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        const question = document.getElementById(`${tab}-question`);
        question.classList.toggle('hidden');
      });
    });
  }

  // Initialize drag functionality
  function initDraggable(panel) {
    const header = panel.querySelector('.duelsia-draggable');
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
      if (e.target.classList.contains('duelsia-close')) return;
      
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      
      if (e.target.closest('.duelsia-draggable')) {
        isDragging = true;
        panel.style.cursor = 'grabbing';
      }
    }
    
    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        xOffset = currentX;
        yOffset = currentY;
        
        panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    }
    
    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      
      isDragging = false;
      panel.style.cursor = 'auto';
    }
  }
  
  // Initialize extension
  function init() {
    createFAB();
    createModal();
    initTabs();
    initBlocks();
    initRevealButtons();
    
    // Fix close button
    document.querySelector('.duelsia-close').addEventListener('click', toggleModal);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();