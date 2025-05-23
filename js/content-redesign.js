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
  
  // Check if we're on the correct page
  const currentUrl = window.location.href;
  const urlCheck = currentUrl.includes('comparia.beta.gouv.fr/arene/');
  console.log('✅ URL contient "comparia.beta.gouv.fr/arene/"?', urlCheck);
  
  if (!urlCheck) {
    console.warn('⚠️ Duels de l\'IA - Pas sur la page arène, arrêt de l\'initialisation');
    console.log('💡 L\'extension s\'active uniquement sur les URLs contenant "comparia.beta.gouv.fr/arene/"');
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
    fab.innerHTML = '⚔️';
    fab.title = 'Duels de l\'IA';
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
    
    panel.innerHTML = `
      <div class="duelsia-panel-content">
        <div class="duelsia-header duelsia-draggable">
          <span>Bienvenue dans les duels de l'IA</span>
          <button class="duelsia-close">✕</button>
        </div>
        
        <div class="duelsia-main-content">
          <div class="duelsia-dropdown-container" id="duelsia-dropdown">
            <span>Comment se déroule un duel ?</span>
            <span class="duelsia-dropdown-icon">⌄</span>
            
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
            <a href="#" id="duelsia-ultimate-link">IA ou pas d'IA: telle est la question !</a>
          </div>
        </div>
        
        <div class="duelsia-content-view" style="display: none;">
          <div class="duelsia-content-nav">
            <button class="duelsia-back-button">←</button>
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
            <div class="duelsia-persona-header" data-index="${index}">
              <div class="duelsia-persona-info">
                <span class="duelsia-persona-emoji">${persona.emoji}</span>
                <div class="duelsia-persona-details">
                  <span class="duelsia-persona-name">${persona.name}</span>
                  <span class="duelsia-persona-profession">${persona.profession}</span>
                  <span class="duelsia-persona-category-inline">${persona.category}</span>
                </div>
              </div>
              <span class="duelsia-persona-arrow">⌄</span>
            </div>
            <div class="duelsia-persona-content" id="persona-content-${index}">
              <div class="duelsia-persona-prompt-container">
                <div class="duelsia-persona-prompt">${persona.prompt}</div>
                <button class="duelsia-copy-btn" data-prompt="${persona.prompt.replace(/"/g, '&quot;')}">
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
    });
    
    // Add copy button handlers
    document.querySelectorAll('.duelsia-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prompt = btn.dataset.prompt;
        copyToClipboard(prompt);
        
        // Update button text temporarily
        const originalText = btn.textContent;
        btn.textContent = 'Copié!';
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
            <div class="duelsia-faq-header" data-index="${index}">
              <div class="duelsia-faq-info">
                <span class="duelsia-faq-emoji">${item.emoji}</span>
                <div class="duelsia-faq-question">
                  ${item.question}
                </div>
              </div>
              <span class="duelsia-faq-arrow">⌄</span>
            </div>
            <div class="duelsia-faq-content" id="faq-content-${index}">
              <div class="duelsia-faq-answer">
                ${item.answer}
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
    });
  }
  
  // Toggle FAQ display
  function toggleFAQ(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const arrow = document.querySelector(`#faq-${index} .duelsia-faq-arrow`);
    
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      arrow.classList.remove('rotate');
    } else {
      content.classList.add('show');
      arrow.classList.add('rotate');
    }
  }
  
  // Show resources section
  function showRessources() {
    const sectionData = CONTENT_DATA[currentSection];
    const resources = sectionData.blocks.ressources.items || [];
    
    const content = `
      <div class="duelsia-resources-list">
        ${resources.map((resource, index) => `
          <div class="duelsia-resource-item" data-index="${index}">
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
        handleResourceClick(resources[index]);
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
        openPdfOverlay(embedUrl);
      } else {
        // Fallback to opening in new tab if can't extract file ID
        window.open(resource.url, '_blank');
      }
    } else {
      // Open external links in new tab
      window.open(resource.url, '_blank');
    }
  }
  
  // Open PDF overlay
  function openPdfOverlay(embedUrl) {
    // Create overlay at document level if it doesn't exist
    let overlay = document.getElementById('duelsia-global-pdf-overlay');
    let frame = document.getElementById('duelsia-global-pdf-frame');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'duelsia-global-pdf-overlay';
      overlay.className = 'duelsia-pdf-overlay';
      
      const container = document.createElement('div');
      container.className = 'duelsia-pdf-container duelsia-fullscreen-container';
      
      const closeBtn = document.createElement('button');
      closeBtn.id = 'duelsia-global-pdf-close';
      closeBtn.className = 'duelsia-pdf-close';
      closeBtn.innerHTML = '✕';
      closeBtn.addEventListener('click', closePdfOverlay);
      
      frame = document.createElement('iframe');
      frame.id = 'duelsia-global-pdf-frame';
      frame.className = 'duelsia-pdf-frame';
      frame.frameBorder = '0';
      
      container.appendChild(closeBtn);
      container.appendChild(frame);
      overlay.appendChild(container);
      
      // Close when clicking outside
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closePdfOverlay();
        }
      });
      
      document.body.appendChild(overlay);
    }
    
    frame.src = embedUrl;
    overlay.style.display = 'flex';
    
    // Hide the panel while viewing the document
    const panel = document.getElementById('duelsia-panel');
    if (panel) {
      panel.classList.add('duelsia-hidden');
    }
  }
  
  // Close PDF overlay
  function closePdfOverlay() {
    const overlay = document.getElementById('duelsia-global-pdf-overlay');
    const frame = document.getElementById('duelsia-global-pdf-frame');
    
    if (overlay && frame) {
      overlay.style.display = 'none';
      frame.src = '';
      
      // Show the panel again when closing the document
      const panel = document.getElementById('duelsia-panel');
      if (panel) {
        panel.classList.remove('duelsia-hidden');
      }
    }
  }
  
  // Toggle persona display
  function togglePersona(index) {
    const content = document.getElementById(`persona-content-${index}`);
    const arrow = document.querySelector(`#persona-${index} .duelsia-persona-arrow`);
    
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      arrow.classList.remove('rotate');
    } else {
      content.classList.add('show');
      arrow.classList.add('rotate');
    }
  }
  
  // Show random debate card
  function showRandomCard() {
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
    
    // Add click handler after inserting the content
    document.getElementById('duelsia-random-btn').addEventListener('click', showRandomCard);
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
  
  // Show debate final screen
  function showDebateFinal() {
    currentView = 'content';
    
    const content = `
      <div class="duelsia-debate-final">
        <h2 class="duelsia-main-question">Le jeu en vaut-il la chandelle ?</h2>
        <p class="duelsia-debate-subquestion">Maintenant que vous connaissez l'impact environnemental des modèles, cela changerait-il votre vote ?</p>
        
        <div class="duelsia-radio-options">
          <h3>Votre avis :</h3>
          <label class="duelsia-radio-label">
            <input type="radio" name="debate-opinion" value="yes" class="duelsia-radio-input">
            <span class="duelsia-radio-text">Oui, les modèles d'IA me sont utiles par rapport à la demande et l'impact environnemental est acceptable</span>
          </label>
          <label class="duelsia-radio-label">
            <input type="radio" name="debate-opinion" value="no" class="duelsia-radio-input">
            <span class="duelsia-radio-text">Non, j'aurais pu me passer de l'assistance des modèles d'IA</span>
          </label>
          <label class="duelsia-radio-label">
            <input type="radio" name="debate-opinion" value="complex" class="duelsia-radio-input">
            <span class="duelsia-radio-text">Ce n'est pas si simple: l'assistance des modèles est utile mais l'impact environnemental me fait réfléchir</span>
          </label>
        </div>
        
        <div class="duelsia-session-recap">
          <div class="duelsia-resource-item" id="duelsia-recap-btn">
            <span class="duelsia-resource-emoji">📄</span>
            <div class="duelsia-resource-content">
              <h4>Récapitulatif de la session</h4>
            </div>
            <span class="duelsia-resource-arrow">→</span>
          </div>
          <div class="duelsia-resource-item duelsia-secondary-btn" id="duelsia-more-questions-btn">
            <span class="duelsia-resource-emoji">🃏</span>
            <div class="duelsia-resource-content">
              <h4>Plus de questions de débat</h4>
            </div>
            <span class="duelsia-resource-arrow">→</span>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('duelsia-content-title').textContent = 'IA ou pas d\'IA: telle est la question !';
    document.getElementById('duelsia-content-display').innerHTML = content;
    
    // Add click handler for recap button
    document.getElementById('duelsia-recap-btn').addEventListener('click', () => {
      const recapUrl = 'https://drive.google.com/file/d/1dvEtIEickBAgk5RpQ5ljxRg02hAbid6t/view?usp=drive_link';
      // Extract file ID and convert to embed URL
      const fileId = recapUrl.match(/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        openPdfOverlay(embedUrl);
      } else {
        // Fallback to opening in new tab
        window.open(recapUrl, '_blank');
      }
    });
    
    // Add click handler for more debate questions button
    document.getElementById('duelsia-more-questions-btn').addEventListener('click', () => {
      // Back to main view, then navigate to debate cards
      showMainView();
      // After a short delay to ensure the main view is shown, show cards content
      setTimeout(() => {
        showBlockContent('cartes');
      }, 100);
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
        <button class="duelsia-retry-btn" onclick="location.reload()">Réessayer</button>
      </div>
    `;
    
    const display = document.getElementById('duelsia-content-display');
    if (display) {
      display.innerHTML = content;
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