// content-wrapper.js - Non-module version that includes all functionality

// Configuration objects (initialized later)
let workshopPaths = {};
let stepsLibrary = {};
let commonResources = {};
let currentSettings = {
  activePath: "duels",
  showCompletedSteps: true,
  currentStep: 1
};

// Load CSS resources
function loadStyles() {
  // DSFR CSS (Marianne font)
  const dfsrCSS = document.createElement('link');
  dfsrCSS.rel = 'stylesheet';
  dfsrCSS.href = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/dsfr.min.css';
  document.head.appendChild(dfsrCSS);
  
  // Extension CSS files
  const stylesheets = [
    'guide-ui.css',
    'steps-components.css',
    'resources-components.css',
    'suggestions-components.css',
    'icon-styles.css'
  ];
  
  stylesheets.forEach(stylesheet => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL(`css/${stylesheet}`);
    document.head.appendChild(link);
  });
}

// =============================================
// CONFIGURATION LOADING
// =============================================
// Load configuration from JSON files

/**
 * Load a configuration file
 * @param {string} configName - Name of the config file without extension
 * @returns {Promise<Object>} - The loaded configuration object
 */
async function loadConfig(configName) {
  try {
    const url = chrome.runtime.getURL(`config/${configName}.json`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load config: ${configName}.json`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error loading config ${configName}:`, error);
    return {};
  }
}

/**
 * Load all required configuration files
 * @returns {Promise<boolean>} - Success status
 */
async function loadAllConfigs() {
  try {
    const [loadedWorkshopPaths, loadedStepsLibrary, loadedCommonResources, loadedDefaultSettings] = await Promise.all([
      loadConfig('workshop-paths'),
      loadConfig('steps-library'),
      loadConfig('common-resources'),
      loadConfig('default-settings')
    ]);
    
    // Update global configuration objects
    workshopPaths = loadedWorkshopPaths;
    stepsLibrary = loadedStepsLibrary;
    commonResources = loadedCommonResources;
    
    // Merge default settings with current settings
    currentSettings = { ...loadedDefaultSettings, ...currentSettings };
    
    return true;
  } catch (error) {
    console.error('Error loading configurations:', error);
    return false;
  }
}

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
  
  return guide;
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
  
  return guide;
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
  
  return guide;
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
}

// Initialize Extension
async function initialize() {
  // Check if we're on the ComparIA site
  const isComparIASite = window.location.hostname === "comparia.beta.gouv.fr";
  
  // Notify the background script about our current domain
  chrome.runtime.sendMessage({ 
    action: "checkDomain", 
    isComparIASite: isComparIASite 
  });
  
  // Load CSS resources
  loadStyles();
  
  // Load configurations
  const configLoaded = await loadAllConfigs();
  
  // Log configuration status and data for testing
  console.log('Configuration loading status:', configLoaded);
  console.log('Workshop paths:', workshopPaths);
  console.log('Steps library:', stepsLibrary);
  console.log('Common resources:', commonResources);
  console.log('Current settings:', currentSettings);
  
  // Initialize the guide if we're on the ComparIA site
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
    
    // Observer for resource button styling
    const styleObserver = new MutationObserver(() => {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        applyResourceButtonStyles();
        adaptContentSize(); // Add dynamic content adaptation
      }, 50);
    });
    
    // Observe DOM for changes
    styleObserver.observe(document.body, { 
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
}

// Start the extension
initialize();