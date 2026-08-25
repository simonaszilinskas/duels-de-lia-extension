// Duels de l'IA - Redesigned Content Script
(function() {
  'use strict';
  
  console.log('====================================');
  console.log('🎯 Duels de l\'IA - Script chargé');
  console.log('⏰ Timestamp:', new Date().toISOString());
  console.log('🔧 Extension ID:', chrome.runtime.id);
  console.log('====================================');
  console.log('📍 URL complète:', window.location.href);
  console.log('🌐 Hostname:', window.location.hostname);
  console.log('📄 Pathname:', window.location.pathname);
  console.log('🔍 Recherche:', window.location.search);
  console.log('📌 Hash:', window.location.hash);
  console.log('====================================');
  
  // On garde le widget sur tout le site : l'arène est à la racine depuis la refonte,
  // et le site navigue côté client, donc un test de chemin à l'injection ne tient pas.
  const host = window.location.hostname;
  const hostCheck = host === 'comparia.beta.gouv.fr' || host.endsWith('.comparia.beta.gouv.fr') ||
    host === 'localhost' || host === '127.0.0.1';
  console.log('✅ Hôte compar:IA ?', hostCheck);

  if (!hostCheck) {
    console.warn('⚠️ Duels de l\'IA - Hors du site compar:IA, arrêt de l\'initialisation');
    return;
  }
  console.log('🚀 Duels de l\'IA - Début de l\'initialisation');
  
  // Content data will be loaded from JSON
  let CONTENT_DATA = null;
  let isLoading = true;

  let currentView = 'main';
  let currentSection = 'comment-se-deroule';
  let currentBlock = null;
  let lastCardIndex = -1;
  let groupOpinion = '';
  let slideOverlayOpener = null;
  const extensionUrl = new URL(chrome.runtime.getURL('/'));
  const extensionOrigin = `${extensionUrl.protocol}//${extensionUrl.host}`;

  // Les réponses de la FAQ sont écrites avec des **gras** en markdown : on les rend,
  // sinon les astérisques s'affichent telles quelles devant le public.
  function enGras(texte) {
    return String(texte)
      .replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  // Create FAB button
  function createFAB() {
    console.log('🔨 Création du FAB...');
    
    // Check if FAB already exists
    if (document.getElementById('duelsia-fab')) {
      console.warn('⚠️ FAB déjà existant, abandon de la création');
      return;
    }
    
    // Check if body exists
    if (!document.body) {
      console.error('❌ document.body n\'existe pas! Impossible de créer le FAB');
      return;
    }
    
    const fab = document.createElement('button');
    fab.id = 'duelsia-fab';
    fab.textContent = '⚔️';
    fab.title = 'Duels de l\'IA';
    fab.setAttribute('aria-label', 'Ouvrir les ressources des Duels de l’IA');
    fab.setAttribute('aria-controls', 'duelsia-panel');
    fab.setAttribute('aria-expanded', 'false');
    fab.addEventListener('click', toggleModal);
    
    console.log('📐 Ajout du FAB au body...');
    document.body.appendChild(fab);
    
    // Verify FAB was added
    const addedFab = document.getElementById('duelsia-fab');
    if (addedFab) {
      console.log('✅ FAB créé avec succès');
      const styles = window.getComputedStyle(addedFab);
      console.log('🎨 Styles du FAB:', {
        display: styles.display,
        visibility: styles.visibility,
        position: styles.position,
        zIndex: styles.zIndex,
        bottom: styles.bottom,
        right: styles.right
      });
    } else {
      console.error('❌ FAB non trouvé après création!');
    }
  }

  // Create redesigned modal interface
  function createModal() {
    const panel = document.createElement('div');
    panel.id = 'duelsia-panel';
    panel.className = 'duelsia-hidden';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Ressources des Duels de l’IA');
    
    panel.innerHTML = `
      <div class="duelsia-panel-content">
        <div class="duelsia-header duelsia-draggable">
          <span>Kit d’animation</span>
          <div class="duelsia-header-actions">
            <button type="button" class="duelsia-feedback-btn" title="Retours" aria-label="Ouvrir les formulaires de retour">💬</button>
            <button type="button" class="duelsia-close" aria-label="Fermer les ressources">✕</button>
          </div>
        </div>
        
        <div class="duelsia-main-content">
          <div class="duelsia-dropdown-container" id="duelsia-dropdown">
            <button type="button" class="duelsia-dropdown-trigger" aria-expanded="false" aria-controls="duelsia-dropdown-content">
              <span>Comment se déroule un duel ?</span>
              <span class="duelsia-dropdown-icon" aria-hidden="true">⌄</span>
            </button>
            
            <div class="duelsia-dropdown-content" id="duelsia-dropdown-content">
              <ol id="duelsia-steps-list">
                <li>Chargement des étapes...</li>
              </ol>
            </div>
          </div>
          
          <div class="duelsia-overlay" id="duelsia-overlay"></div>
          
          <div class="duelsia-card-grid" id="duelsia-cards">
            <div class="duelsia-loading">Chargement des contenus...</div>
          </div>
          
          <div class="duelsia-footer-link">
            <a href="#" id="duelsia-ultimate-link">Le jeu en vaut-il la chandelle ?</a>
          </div>
        </div>
        
        <div class="duelsia-content-view" style="display: none;">
          <div class="duelsia-content-nav">
            <button type="button" class="duelsia-back-button" aria-label="Revenir à la liste">←</button>
            <h3 id="duelsia-content-title"></h3>
            <button type="button" class="duelsia-close duelsia-close-content" aria-label="Fermer les ressources">✕</button>
          </div>
          <div class="duelsia-content-display" id="duelsia-content-display">
            <!-- Content will be dynamically inserted here -->
          </div>
        </div>
        
        <div class="duelsia-feedback-view" style="display: none;">
          <div class="duelsia-content-nav">
            <button type="button" class="duelsia-back-button" aria-label="Revenir à la liste">←</button>
            <h3>Retours</h3>
            <button type="button" class="duelsia-close duelsia-close-feedback" aria-label="Fermer les ressources">✕</button>
          </div>
          <div class="duelsia-feedback-content">
            <div class="duelsia-feedback-participants">
              <h4>Participants</h4>
              <div class="duelsia-qr-code" id="duelsia-qr-code">
                <!-- QR code will be generated here -->
              </div>
              <p class="duelsia-qr-url">https://adtk8x51mbw.eu.typeform.com/to/YyVO0zl6</p>
            </div>
            <div class="duelsia-feedback-facilitator">
              <h4>Facilitateur</h4>
              <button class="duelsia-facilitator-feedback-btn">Accéder au formulaire facilitateur</button>
            </div>
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
    panel.querySelector('.duelsia-close-feedback').addEventListener('click', toggleModal);
    
    // Handle all back buttons
    panel.querySelectorAll('.duelsia-back-button').forEach(button => {
      button.addEventListener('click', showMainView);
    });
    
    panel.querySelector('.duelsia-dropdown-trigger').addEventListener('click', toggleDropdown);
    
    // Add feedback button click handler
    panel.querySelector('.duelsia-feedback-btn').addEventListener('click', showFeedbackView);
    
    // Add facilitator feedback button handler
    panel.querySelector('.duelsia-facilitator-feedback-btn').addEventListener('click', () => {
      window.open('https://adtk8x51mbw.eu.typeform.com/facilit-duel', '_blank');
    });
    
    // Add debate final click handler
    panel.querySelector('#duelsia-ultimate-link').addEventListener('click', (e) => {
      e.preventDefault();
      showDebateFinal();
    });
    
    // Setup overlay
    setupOverlay();
  }

  // Load content data from JSON
  async function loadContentData() {
    console.log('📚 Chargement des données JSON...');
    try {
      const jsonUrl = chrome.runtime.getURL('data/content-data.json');
      console.log('🔗 URL du JSON:', jsonUrl);
      
      const response = await fetch(jsonUrl);
      console.log('📡 Réponse fetch:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Données JSON chargées:', Object.keys(data));
      
      CONTENT_DATA = data.duels;
      isLoading = false;
      
      // Update UI with loaded content
      updateUIWithContent();
    } catch (error) {
      console.error('❌ Erreur de chargement des données:', error);
      console.error('Stack trace:', error.stack);
      isLoading = false;
      showError('Erreur de chargement des données');
    }
  }
  
  // Update UI with loaded content
  function updateUIWithContent() {
    if (!CONTENT_DATA || !CONTENT_DATA['comment-se-deroule']) {
      showError('Données invalides');
      return;
    }
    
    // Update steps list
    const stepsList = document.getElementById('duelsia-steps-list');
    if (stepsList && CONTENT_DATA['comment-se-deroule'].steps) {
      stepsList.innerHTML = CONTENT_DATA['comment-se-deroule'].steps.map(step => `
        <li>
          <strong>${step.title}</strong>
          <p>${step.description}</p>
        </li>
      `).join('');
    }
    
    // Update ultimate question
    const ultimateLink = document.getElementById('duelsia-ultimate-link');
    if (ultimateLink && CONTENT_DATA['comment-se-deroule'].ultimateQuestion) {
      ultimateLink.textContent = CONTENT_DATA['comment-se-deroule'].ultimateQuestion;
    }
    
    // Render cards
    renderCards();
  }

  // Render cards based on current section
  function renderCards() {
    const cardsContainer = document.getElementById('duelsia-cards');
    
    if (!CONTENT_DATA) {
      cardsContainer.innerHTML = `
        <div class="duelsia-loading-cards">
          ${[1, 2, 3, 4].map(() => `
            <div class="duelsia-loading-card">
              <div class="duelsia-skeleton"></div>
              <div class="duelsia-skeleton"></div>
              <div class="duelsia-skeleton"></div>
            </div>
          `).join('')}
        </div>
      `;
      return;
    }
    
    const sectionData = CONTENT_DATA[currentSection];
    if (!sectionData) {
      cardsContainer.innerHTML = '<div class="duelsia-error">Section non trouvée</div>';
      return;
    }
    
    const cardsHTML = Object.entries(sectionData.blocks).map(([key, block]) => `
      <button type="button" class="duelsia-card" data-block="${key}">
        <div class="duelsia-emoji">${block.icon}</div>
        <h3>${block.title}</h3>
        <p>${block.description}</p>
      </button>
    `).join('');
    
    cardsContainer.innerHTML = cardsHTML;
    
    // Add click handlers to cards
    cardsContainer.querySelectorAll('.duelsia-card').forEach(card => {
      card.addEventListener('click', () => {
        const blockKey = card.dataset.block;
        showBlockContent(blockKey);
      });
    });
  }

  // Show block content
  function showBlockContent(blockKey) {
    if (!CONTENT_DATA) {
      showError('Les données sont en cours de chargement...');
      return;
    }
    
    const sectionData = CONTENT_DATA[currentSection];
    if (!sectionData || !sectionData.blocks) {
      showError('Section non trouvée');
      return;
    }
    
    const block = sectionData.blocks[blockKey];
    if (!block) {
      showError('Contenu non disponible');
      return;
    }
    
    currentBlock = blockKey;
    currentView = 'content';
    
    document.getElementById('duelsia-content-title').textContent = block.title;
    
    // Handle special cases
    if (blockKey === 'cartes') {
      showRandomCard();
    } else if (blockKey === 'prompts') {
      showPersonas();
    } else if (blockKey === 'faq') {
      showFAQ();
    } else if (blockKey === 'ressources') {
      showRessources();
    } else {
      document.getElementById('duelsia-content-display').innerHTML = block.content || 'Contenu non disponible';
    }
    
    document.querySelector('.duelsia-main-content').style.display = 'none';
    document.querySelector('.duelsia-content-view').style.display = 'flex';
  }
  
  // Show personas
  function showPersonas() {
    const sectionData = CONTENT_DATA[currentSection];
    const personas = sectionData.blocks.prompts.personas || [];
    
    const content = `
      <div class="duelsia-personas-list">
        ${personas.map((persona, index) => `
          <div class="duelsia-persona-item" id="persona-${index}">
            <div class="duelsia-persona-header" data-index="${index}" role="button" tabindex="0" aria-expanded="false" aria-controls="persona-content-${index}">
              <div class="duelsia-persona-info">
                <span class="duelsia-persona-emoji">${persona.emoji}</span>
                <div class="duelsia-persona-details">
                  <span class="duelsia-persona-name">${persona.name}</span>
                  <span class="duelsia-persona-profession">${persona.profession}</span>
                  <span class="duelsia-persona-category-inline">${persona.category}</span>
                </div>
              </div>
              <span class="duelsia-persona-arrow" aria-hidden="true">⌄</span>
            </div>
            <div class="duelsia-persona-content" id="persona-content-${index}">
              <div class="duelsia-persona-prompt-container">
                <div class="duelsia-persona-prompt">${persona.prompt}</div>
                <button class="duelsia-copy-btn" data-prompt="${persona.prompt.replace(/"/g, '&quot;')}" aria-live="polite">
                  Copier
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    document.getElementById('duelsia-content-display').innerHTML = content;
    
    // Add click handlers after inserting the content
    document.querySelectorAll('.duelsia-persona-header').forEach(header => {
      header.addEventListener('click', () => {
        const index = header.dataset.index;
        togglePersona(index);
      });
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
    
    // Add copy button handlers
    document.querySelectorAll('.duelsia-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prompt = btn.dataset.prompt;
        copyToClipboard(prompt);
        
        // Update button text temporarily
        const originalText = btn.textContent;
        btn.textContent = 'Copié';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      });
    });
  }
  
  // Copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Show a success message
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
  
  // Show FAQ section
  function showFAQ() {
    const sectionData = CONTENT_DATA[currentSection];
    const questions = sectionData.blocks.faq.questions || [];
    
    const content = `
      <div class="duelsia-faq-list">
        ${questions.map((item, index) => `
          <div class="duelsia-faq-item" id="faq-${index}">
            <div class="duelsia-faq-header" data-index="${index}" role="button" tabindex="0" aria-expanded="false" aria-controls="faq-content-${index}">
              <div class="duelsia-faq-info">
                <span class="duelsia-faq-emoji">${item.emoji}</span>
                <div class="duelsia-faq-question">
                  ${item.question}
                </div>
              </div>
              <span class="duelsia-faq-arrow" aria-hidden="true">⌄</span>
            </div>
            <div class="duelsia-faq-content" id="faq-content-${index}">
              <div class="duelsia-faq-answer">
                ${enGras(item.answer)}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    document.getElementById('duelsia-content-display').innerHTML = content;
    
    // Add click handlers after inserting the content
    document.querySelectorAll('.duelsia-faq-header').forEach(header => {
      header.addEventListener('click', () => {
        const index = header.dataset.index;
        toggleFAQ(index);
      });
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }
  
  // Toggle FAQ display
  function toggleFAQ(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const arrow = document.querySelector(`#faq-${index} .duelsia-faq-arrow`);
    const header = document.querySelector(`#faq-${index} .duelsia-faq-header`);
    
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      arrow.classList.remove('rotate');
      header.setAttribute('aria-expanded', 'false');
    } else {
      content.classList.add('show');
      arrow.classList.add('rotate');
      header.setAttribute('aria-expanded', 'true');
    }
  }
  
  // Show resources section
  function showRessources() {
    const sectionData = CONTENT_DATA[currentSection];
    const resources = sectionData.blocks.ressources.items || [];
    
    const content = `
      <div class="duelsia-resources-list">
        ${resources.map((resource, index) => `
          <div class="duelsia-resource-item" data-index="${index}" role="button" tabindex="0">
            <span class="duelsia-resource-emoji">${resource.emoji}</span>
            <div class="duelsia-resource-content">
              <h4>${resource.title}</h4>
            </div>
            <span class="duelsia-resource-arrow">→</span>
          </div>
        `).join('')}
      </div>
    `;
    
    document.getElementById('duelsia-content-display').innerHTML = content;
    
    // Add click handlers after inserting the content
    document.querySelectorAll('.duelsia-resource-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        item.focus();
        handleResourceClick(resources[index]);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
    
    // Using global overlay now instead of local ones
  }
  
  // Handle resource click
  function handleResourceClick(resource) {
    if (resource.type === 'google-drive') {
      // Convert Google Drive view link to embed link
      const fileId = resource.url.match(/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        openSlideOverlay(embedUrl);
      } else {
        // Fallback to opening in new tab if can't extract file ID
        window.open(resource.url, '_blank');
      }
    } else if (resource.type === 'slides' || resource.type === 'local-pdf') {
      // Supports embarqués dans l'extension (HTML, et PDF pour l'ancien format)
      openSlideOverlay(chrome.runtime.getURL(resource.url), resource.title);
    } else {
      // Open external links in new tab
      window.open(resource.url, '_blank');
    }
  }
  
  // Ouvre un support en plein écran
  function openSlideOverlay(embedUrl, title) {
    // Create overlay at document level if it doesn't exist
    let overlay = document.getElementById('duelsia-global-slide-overlay');
    let frame = document.getElementById('duelsia-global-slide-frame');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'duelsia-global-slide-overlay';
      overlay.className = 'duelsia-slide-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      
      const container = document.createElement('div');
      container.className = 'duelsia-slide-container';
      
      const closeBtn = document.createElement('button');
      closeBtn.id = 'duelsia-global-slide-close';
      closeBtn.className = 'duelsia-slide-close';
      closeBtn.type = 'button';
      closeBtn.textContent = '✕';
      closeBtn.setAttribute('aria-label', 'Fermer le support');
      closeBtn.addEventListener('click', closeSlideOverlay);
      
      frame = document.createElement('iframe');
      frame.id = 'duelsia-global-slide-frame';
      frame.className = 'duelsia-slide-frame';
      frame.frameBorder = '0';
      
      container.appendChild(closeBtn);
      container.appendChild(frame);
      overlay.appendChild(container);
      
      // Close when clicking outside
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeSlideOverlay();
        }
      });
      
      document.body.appendChild(overlay);
    }

    slideOverlayOpener = document.activeElement;
    overlay.setAttribute('aria-label', title || 'Support de présentation');
    frame.title = title || 'Support de présentation';
    frame.src = embedUrl;
    overlay.style.display = 'flex';

    // Hide the panel while viewing the document
    const panel = document.getElementById('duelsia-panel');
    if (panel) {
      panel.classList.add('duelsia-hidden');
    }

    document.getElementById('duelsia-global-slide-close').focus();
  }
  
  // Ferme le support
  function closeSlideOverlay() {
    const overlay = document.getElementById('duelsia-global-slide-overlay');
    const frame = document.getElementById('duelsia-global-slide-frame');
    
    if (overlay && frame) {
      overlay.style.display = 'none';
      frame.src = 'about:blank';
      
      // Show the panel again when closing the document
      const panel = document.getElementById('duelsia-panel');
      if (panel) {
        panel.classList.remove('duelsia-hidden');
      }

      if (slideOverlayOpener instanceof HTMLElement && slideOverlayOpener.isConnected) {
        slideOverlayOpener.focus();
      }
      slideOverlayOpener = null;
    }
  }
  
  // Le support tourne dans une iframe : c'est lui qui signale la fermeture.
  window.addEventListener('message', (e) => {
    const frame = document.getElementById('duelsia-global-slide-frame');
    if (
      frame &&
      e.source === frame.contentWindow &&
      e.origin === extensionOrigin &&
      e.data &&
      e.data.duelsia === 'fermer'
    ) {
      closeSlideOverlay();
    }
  });

  document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('duelsia-global-slide-overlay');
    if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
      e.preventDefault();
      closeSlideOverlay();
      return;
    }

    const dropdown = document.getElementById('duelsia-dropdown-content');
    if (e.key === 'Escape' && dropdown?.classList.contains('show')) {
      e.preventDefault();
      toggleDropdown();
      document.querySelector('.duelsia-dropdown-trigger')?.focus();
    }
  });

  // Le focus reste dans le dialogue tant que le support est ouvert.
  document.addEventListener('focusin', (e) => {
    const overlay = document.getElementById('duelsia-global-slide-overlay');
    if (overlay && overlay.style.display === 'flex' && !overlay.contains(e.target)) {
      document.getElementById('duelsia-global-slide-close').focus();
    }
  });

  // Toggle persona display
  function togglePersona(index) {
    const content = document.getElementById(`persona-content-${index}`);
    const arrow = document.querySelector(`#persona-${index} .duelsia-persona-arrow`);
    const header = document.querySelector(`#persona-${index} .duelsia-persona-header`);
    
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      arrow.classList.remove('rotate');
      header.setAttribute('aria-expanded', 'false');
    } else {
      content.classList.add('show');
      arrow.classList.add('rotate');
      header.setAttribute('aria-expanded', 'true');
    }
  }
  
  // Show random debate card
  function showRandomCard() {
    const existingOpinion = document.getElementById('duelsia-group-opinion');
    if (existingOpinion) {
      groupOpinion = existingOpinion.value;
    }

    const sectionData = CONTENT_DATA[currentSection];
    const cards = sectionData.blocks.cartes.cards || [];
    
    if (cards.length === 0) {
      showError('Aucune carte disponible');
      return;
    }
    
    // Get a different card than the last one
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * cards.length);
    } while (randomIndex === lastCardIndex && cards.length > 1);
    
    lastCardIndex = randomIndex;
    const card = cards[randomIndex];
    
    const content = `
      <div class="duelsia-card-display">
        <div class="duelsia-debate-card">
          <div class="duelsia-debate-theme">${card.theme}</div>
          <div class="duelsia-debate-question">${card.question}</div>
        </div>
        <div class="duelsia-opinion-section">
          <label for="duelsia-group-opinion">Avis du groupe (optionnel):</label>
          <textarea 
            id="duelsia-group-opinion" 
            class="duelsia-opinion-textarea"
            placeholder="Notez ici les réflexions et l'avis du groupe sur cette question..."
            rows="3"
          ></textarea>
        </div>
        <button class="duelsia-random-card-btn" id="duelsia-random-btn">
          Autre carte débat
        </button>
      </div>
    `;
    
    document.getElementById('duelsia-content-display').innerHTML = content;

    const opinionField = document.getElementById('duelsia-group-opinion');
    opinionField.value = groupOpinion;
    opinionField.addEventListener('input', () => {
      groupOpinion = opinionField.value;
    });
    
    // Add click handler after inserting the content
    document.getElementById('duelsia-random-btn').addEventListener('click', showRandomCard);
  }

  // Show main view
  function showMainView() {
    currentView = 'main';
    currentBlock = null;
    
    document.querySelector('.duelsia-main-content').style.display = 'block';
    document.querySelector('.duelsia-content-view').style.display = 'none';
    document.querySelector('.duelsia-feedback-view').style.display = 'none';
  }
  
  // Show feedback view
  function showFeedbackView() {
    currentView = 'feedback';
    
    document.querySelector('.duelsia-main-content').style.display = 'none';
    document.querySelector('.duelsia-content-view').style.display = 'none';
    document.querySelector('.duelsia-feedback-view').style.display = 'block';
    
    // Display the actual QR code image
    const qrContainer = document.getElementById('duelsia-qr-code');
    if (qrContainer && !qrContainer.querySelector('img')) {
      const qrImageUrl = chrome.runtime.getURL('data/qr_code_transparent_fixed.png');
      qrContainer.innerHTML = `
        <img src="${qrImageUrl}" alt="QR Code pour feedback" class="duelsia-qr-image" />
      `;
    }
  }

  // Toggle dropdown content
  function toggleDropdown() {
    const content = document.getElementById('duelsia-dropdown-content');
    const overlay = document.getElementById('duelsia-overlay');
    const icon = document.querySelector('.duelsia-dropdown-icon');
    const trigger = document.querySelector('.duelsia-dropdown-trigger');
    
    content.classList.toggle('show');
    overlay.classList.toggle('show');
    icon.classList.toggle('rotate');
    trigger.setAttribute('aria-expanded', String(content.classList.contains('show')));
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
    const ouvert = !panel.classList.contains('duelsia-hidden');
    document.getElementById('duelsia-fab')?.setAttribute('aria-expanded', String(ouvert));
    
  }

  // Make element draggable
  function makeElementDraggable(element) {
    const header = element.querySelector('.duelsia-draggable');
    let isDragging = false;
    let currentX;
    let currentY;
    let xOffset = 0;
    let yOffset = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;
    let startPointerX = 0;
    let startPointerY = 0;
    let startRect = null;
    const viewportMargin = 8;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    window.addEventListener('resize', constrainToViewport);

    function dragStart(e) {
      if (e.target.closest('button, a')) return;

      if (e.target.closest('.duelsia-draggable')) {
        isDragging = true;
        startPointerX = e.clientX;
        startPointerY = e.clientY;
        startOffsetX = xOffset;
        startOffsetY = yOffset;
        startRect = element.getBoundingClientRect();
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        const maxLeft = Math.max(viewportMargin, window.innerWidth - startRect.width - viewportMargin);
        const maxTop = Math.max(viewportMargin, window.innerHeight - startRect.height - viewportMargin);
        const nextLeft = Math.min(maxLeft, Math.max(viewportMargin, startRect.left + e.clientX - startPointerX));
        const nextTop = Math.min(maxTop, Math.max(viewportMargin, startRect.top + e.clientY - startPointerY));

        currentX = startOffsetX + nextLeft - startRect.left;
        currentY = startOffsetY + nextTop - startRect.top;

        xOffset = currentX;
        yOffset = currentY;

        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    }

    function dragEnd(e) {
      isDragging = false;
    }

    function constrainToViewport() {
      const rect = element.getBoundingClientRect();
      const maxRight = window.innerWidth - viewportMargin;
      const maxBottom = window.innerHeight - viewportMargin;
      let adjustmentX = 0;
      let adjustmentY = 0;

      if (rect.left < viewportMargin) adjustmentX = viewportMargin - rect.left;
      if (rect.right > maxRight) adjustmentX = maxRight - rect.right;
      if (rect.top < viewportMargin) adjustmentY = viewportMargin - rect.top;
      if (rect.bottom > maxBottom) adjustmentY = maxBottom - rect.bottom;

      xOffset += adjustmentX;
      yOffset += adjustmentY;
      element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }
  }
  
  // Show debate final screen
  function showDebateFinal() {
    currentView = 'content';
    
    const content = `
      <div class="duelsia-debate-final">
        <p class="duelsia-debate-subquestion">Maintenant que vous avez vu l'énergie consommée et la classe énergétique de chaque modèle, cela change-t-il votre vote ?</p>
        
        <div class="duelsia-radio-options">
          <h3>Votre avis :</h3>
          <label class="duelsia-radio-label">
            <input type="radio" name="debate-opinion" value="yes" class="duelsia-radio-input">
            <div class="duelsia-radio-text">
              <strong>Non, il ne change pas</strong>
              <span class="duelsia-radio-subtext">Les modèles d'IA me sont utiles et l'énergie dépensée est acceptable pour cette requête.</span>
            </div>
          </label>
          <label class="duelsia-radio-label">
            <input type="radio" name="debate-opinion" value="no" class="duelsia-radio-input">
            <div class="duelsia-radio-text">
              <strong>Oui, il change</strong>
              <span class="duelsia-radio-subtext">J'aurais pu me passer de l'assistance des modèles d'IA</span>
            </div>
          </label>
          <label class="duelsia-radio-label">
            <input type="radio" name="debate-opinion" value="complex" class="duelsia-radio-input">
            <div class="duelsia-radio-text">
              <strong>Ce n'est pas si simple</strong>
              <span class="duelsia-radio-subtext">L'assistance des modèles est utile, mais l'énergie dépensée me fait réfléchir</span>
            </div>
          </label>
        </div>
        
        <div class="duelsia-session-recap">
          <div class="duelsia-resource-item" id="duelsia-recap-btn" role="button" tabindex="0">
            <span class="duelsia-resource-emoji">📄</span>
            <div class="duelsia-resource-content">
              <h4>Récapitulatif de la session</h4>
            </div>
            <span class="duelsia-resource-arrow">→</span>
          </div>
          <div class="duelsia-resource-item duelsia-secondary-btn" id="duelsia-more-questions-btn" role="button" tabindex="0">
            <span class="duelsia-resource-emoji">🃏</span>
            <div class="duelsia-resource-content">
              <h4>Plus de questions de débat</h4>
            </div>
            <span class="duelsia-resource-arrow">→</span>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('duelsia-content-title').textContent = 'Le jeu en vaut-il la chandelle ?';
    document.getElementById('duelsia-content-display').innerHTML = content;
    
    // Add click handler for recap button
    const recapButton = document.getElementById('duelsia-recap-btn');
    recapButton.addEventListener('click', () => {
      const recapUrl = chrome.runtime.getURL('data/slides/ce-quon-retient.html');
      openSlideOverlay(recapUrl, 'Ce qu’on retient');
    });
    
    // Add click handler for more debate questions button
    const moreQuestionsButton = document.getElementById('duelsia-more-questions-btn');
    moreQuestionsButton.addEventListener('click', () => {
      // Back to main view, then navigate to debate cards
      showMainView();
      // After a short delay to ensure the main view is shown, show cards content
      setTimeout(() => {
        showBlockContent('cartes');
      }, 100);
    });

    [recapButton, moreQuestionsButton].forEach(button => {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
    
    document.querySelector('.duelsia-main-content').style.display = 'none';
    document.querySelector('.duelsia-content-view').style.display = 'flex';
  }
  // Show error message
  function showError(message) {
    const content = `
      <div class="duelsia-error-container">
        <div class="duelsia-error-icon">⚠️</div>
        <div class="duelsia-error-message">${message}</div>
        <button type="button" class="duelsia-retry-btn">Réessayer</button>
      </div>
    `;
    
    const display = document.getElementById('duelsia-content-display');
    if (display) {
      display.innerHTML = content;
      display.querySelector('.duelsia-retry-btn').addEventListener('click', () => location.reload());
    }
  }

  // Initialize extension
  async function initialize() {
    console.log('🎬 Début de l\'initialisation...');
    console.log('📊 État du document:', document.readyState);
    console.log('🏷️ Body existe?', !!document.body);
    console.log('🏷️ Head existe?', !!document.head);
    
    try {
      // Create styles
      console.log('🎨 Ajout des styles CSS...');
      const styleUrl = chrome.runtime.getURL('css/new-styles.css');
      console.log('🔗 URL du CSS:', styleUrl);
      
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = styleUrl;
      document.head.appendChild(style);
      console.log('✅ Styles CSS ajoutés');
      
      // Create UI elements
      console.log('🏗️ Création des éléments UI...');
      createFAB();
      createModal();
      
      // Load content data
      console.log('📥 Chargement du contenu...');
      await loadContentData();
      
      console.log('🎉 Initialisation terminée avec succès!');
    } catch (error) {
      console.error('❌ Erreur d\'initialisation:', error);
      console.error('Stack trace:', error.stack);
    }
  }

  // Initialize when DOM is ready
  console.log('🔄 Vérification de l\'état du DOM...');
  console.log('📊 document.readyState actuel:', document.readyState);
  
  if (document.readyState === 'loading') {
    console.log('⏳ DOM en cours de chargement, attente de DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', function() {
      console.log('✅ DOMContentLoaded déclenché!');
      initialize();
    });
  } else {
    console.log('✅ DOM déjà chargé, initialisation immédiate...');
    initialize();
  }
  
  // Fallback: also try on window load
  window.addEventListener('load', function() {
    console.log('🔄 Window load event - vérification du FAB...');
    if (!document.getElementById('duelsia-fab')) {
      console.warn('⚠️ FAB manquant au window.load, tentative de réinitialisation...');
      initialize();
    }
  });
})();
