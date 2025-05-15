// guide-builder.js - Collection of functions for building guide UI elements

import { renderCallout } from './components.js';
import { getStepsForCurrentPage } from './utils.js';

/**
 * Creates a suggestions list component
 * @param {Array} suggestions - The list of suggestions to display
 * @returns {HTMLElement} - The suggestions list container
 */
export function createSuggestionsList(suggestions) {
  if (!suggestions || !suggestions.length) return null;

  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.className = 'duels-suggestions';
  
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
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'duels-copy-button';
    copyButton.textContent = 'Copier';
    
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
    promptElement.appendChild(copyButton);
    
    // Add toggle functionality
    personaElement.addEventListener('click', () => {
      personaElement.classList.toggle('open');
      promptElement.classList.toggle('visible');
    });
    
    suggestionsContainer.appendChild(personaElement);
    suggestionsContainer.appendChild(promptElement);
  });
  
  return suggestionsContainer;
}

/**
 * Creates a resource container
 * @param {Array} resources - The resources to display
 * @returns {HTMLElement} - The resource container
 */
export function createResourceContainer(resources) {
  if (!resources || !resources.length) return null;
  
  const resourceContainer = document.createElement('div');
  resourceContainer.className = 'duels-resource-container';
  
  const resourcesTitle = document.createElement('h4');
  resourcesTitle.className = 'duels-resources-title';
  resourcesTitle.textContent = 'Ressources:';
  resourceContainer.appendChild(resourcesTitle);
  
  resources.forEach(resource => {
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
    
    resourceContainer.appendChild(resourceLink);
  });
  
  return resourceContainer;
}

/**
 * Creates a media container for images/gifs
 * @param {Array} media - The media items to display
 * @returns {HTMLElement} - The media container
 */
export function createMediaContainer(media) {
  if (!media || !media.length) return null;
  
  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'duels-media-container';
  
  media.forEach(mediaItem => {
    if (mediaItem.type === 'image' || mediaItem.type === 'gif') {
      const img = document.createElement('img');
      img.src = mediaItem.url;
      img.alt = mediaItem.alt || '';
      img.className = mediaItem.type === 'image' ? 'duels-media-image' : 'duels-media-gif';
      mediaContainer.appendChild(img);
      
      if (mediaItem.caption) {
        const caption = document.createElement('div');
        caption.className = 'duels-media-caption';
        caption.textContent = mediaItem.caption;
        mediaContainer.appendChild(caption);
      }
    }
  });
  
  return mediaContainer;
}

/**
 * Renders random questions or discussion cards for a step
 * @param {Object} step - The step object
 * @param {HTMLElement} container - The container to add questions to
 */
export function renderQuestionsOrDiscussions(step, container) {
  // Handle random questions
  if (step.random_questions && step.random_questions.length > 0) {
    // Create container
    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'duels-random-questions-container';
    
    // Add title
    const sectionTitle = document.createElement('h4');
    sectionTitle.className = 'duels-random-questions-title';
    sectionTitle.textContent = 'À débattre :';
    questionsContainer.appendChild(sectionTitle);
    
    // For evaluate_utility step, show a special form
    if (step.id === 'evaluate_utility') {
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
    } else {
      // For other steps, use the random question generator with dice
      // Conteneur pour la question affichée
      const questionDisplay = document.createElement('div');
      questionDisplay.className = 'duels-random-question-display';
      questionDisplay.textContent = 'Cliquez sur le dé pour générer une question';
      questionsContainer.appendChild(questionDisplay);
      
      // Bouton avec l'icône de dé pour générer une question aléatoire
      const diceButton = document.createElement('button');
      diceButton.className = 'duels-dice-button';
      diceButton.innerHTML = '<i class="fas fa-dice"></i>';
      diceButton.title = 'Générer une question aléatoire';
      questionsContainer.appendChild(diceButton);
      
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
      
      // Générer une question initiale au hasard
      setTimeout(generateRandomQuestion, 500);
    }
    
    container.appendChild(questionsContainer);
  }
  
  // Handle discussion cards (similar but with colored cards)
  if (step.discussion_cards && step.discussion_cards.length > 0) {
    // Create a random questions container similar to the one above
    const randomQuestionsContainer = document.createElement('div');
    randomQuestionsContainer.className = 'duels-random-questions-container';
    
    // Title
    const sectionTitle = document.createElement('h4');
    sectionTitle.className = 'duels-random-questions-title';
    sectionTitle.textContent = 'À débattre :';
    randomQuestionsContainer.appendChild(sectionTitle);
    
    // Container for the displayed question
    const questionDisplay = document.createElement('div');
    questionDisplay.className = 'duels-random-question-display';
    questionDisplay.textContent = 'Cliquez sur le dé pour générer une question';
    randomQuestionsContainer.appendChild(questionDisplay);
    
    // Dice button for random generation
    const diceButton = document.createElement('button');
    diceButton.className = 'duels-dice-button';
    diceButton.innerHTML = '<i class="fas fa-dice"></i>';
    diceButton.title = 'Générer une question aléatoire';
    randomQuestionsContainer.appendChild(diceButton);
    
    // Variables to track current question
    let currentIndex = 0;
    
    // Function to display next question in sequence
    function generateRandomQuestion() {
      // Loop back if we reach the end
      if (currentIndex >= step.discussion_cards.length) {
        currentIndex = 0;
      }
      
      // Get current card data
      const cardData = step.discussion_cards[currentIndex];
      questionDisplay.textContent = cardData.question;
      
      // Add color accent based on the card color
      questionDisplay.style.borderLeft = `4px solid ${cardData.color || '#6a6af4'}`;
      
      // Increment for next time
      currentIndex++;
      
      // Animation for dice
      diceButton.classList.add('rolling');
      setTimeout(() => {
        diceButton.classList.remove('rolling');
      }, 500);
    }
    
    // Attach event handler to button
    diceButton.addEventListener('click', generateRandomQuestion);
    
    // Add to container
    container.appendChild(randomQuestionsContainer);
    
    // Generate initial random question
    setTimeout(generateRandomQuestion, 500);
  }
}

/**
 * Creates a step element
 * @param {Object} step - The step data
 * @param {number} currentStep - The current active step
 * @returns {HTMLElement} - The step element
 */
export function createStepElement(step, currentStep) {
  const stepElement = document.createElement('div');
  stepElement.className = 'duels-step';
  
  // Add class based on step type
  if (step.type === 'resources_section') {
    stepElement.classList.add('resources-section');
  } else {
    stepElement.classList.add('main');
  }
  
  // Mark current step as active
  if (step.order === currentStep) {
    stepElement.classList.add('active');
  }
  
  // Create step title
  const stepTitle = document.createElement('h3');
  if (step.type === 'resources_section') {
    stepTitle.innerHTML = `<i class="fas fa-seedling" style="margin-right: 8px; font-size: 1rem; color: #6a6af4;"></i> ${step.title}`;
  } else {
    stepTitle.innerHTML = `<i class="fas fa-book" style="margin-right: 8px; font-size: 0.9rem; color: #6a6af4;"></i> ${step.title}`;
  }
  stepElement.appendChild(stepTitle);
  
  // Add instructions
  const stepInstructions = document.createElement('p');
  stepInstructions.innerHTML = step.instruction;
  stepElement.appendChild(stepInstructions);
  
  // Add callout if available
  renderCallout(step, stepElement);
  
  // Add random questions or discussion cards if available
  renderQuestionsOrDiscussions(step, stepElement);
  
  // Add media content if available
  const mediaContainer = createMediaContainer(step.media);
  if (mediaContainer) {
    stepElement.appendChild(mediaContainer);
  }
  
  // Add suggestions if available
  if (step.suggestions && step.suggestions.length > 0) {
    const suggestionsTitle = document.createElement('h4');
    suggestionsTitle.className = 'duels-suggestions-title';
    suggestionsTitle.textContent = 'Suggestions:';
    stepElement.appendChild(suggestionsTitle);
    
    const suggestionsList = createSuggestionsList(step.suggestions);
    if (suggestionsList) {
      stepElement.appendChild(suggestionsList);
    }
  }
  
  // Add resources (always last)
  const resourceContainer = createResourceContainer(step.resources);
  if (resourceContainer) {
    stepElement.appendChild(resourceContainer);
  }
  
  return stepElement;
}

/**
 * Creates an accordion element
 * @param {Object} step - The step data
 * @param {number} currentStep - The current active step
 * @param {Array<String>} forceActiveSteps - IDs of steps that should be active by default
 * @returns {HTMLElement} - The accordion element
 */
export function createAccordionElement(step, currentStep, forceActiveSteps = []) {
  const stepAccordion = document.createElement('div');
  stepAccordion.className = 'duels-accordion';
  
  // Add class based on step type
  if (step.type === 'resources_section') {
    stepAccordion.classList.add('resources-section');
  } else {
    stepAccordion.classList.add('main');
  }
  
  // Mark current step as active
  if (step.order === currentStep) {
    stepAccordion.classList.add('active');
  }
  
  // Mark specific steps as active by default
  if (forceActiveSteps.includes(step.id) || step.type === 'resources_section') {
    stepAccordion.classList.add('active');
  }
  
  // Create header
  const stepHeader = document.createElement('div');
  stepHeader.className = 'duels-accordion-header';
  
  // Format by step type
  if (step.type === 'resources_section') {
    stepHeader.innerHTML = `<i class="fas fa-seedling" style="margin-right: 8px; font-size: 1rem; color: #6a6af4;"></i> ${step.title}`;
  } else {
    stepHeader.innerHTML = `<i class="fas fa-book" style="margin-right: 8px; font-size: 0.9rem; color: #6a6af4;"></i> ${step.title}`;
  }
  
  // Create content area
  const stepContent = document.createElement('div');
  stepContent.className = 'duels-accordion-content';
  
  // Add instructions
  const stepInstructions = document.createElement('p');
  stepInstructions.innerHTML = step.instruction;
  stepContent.appendChild(stepInstructions);
  
  // Add callout if available
  renderCallout(step, stepContent);
  
  // Add random questions or discussion cards if available
  renderQuestionsOrDiscussions(step, stepContent);
  
  // Add media content if available
  const mediaContainer = createMediaContainer(step.media);
  if (mediaContainer) {
    stepContent.appendChild(mediaContainer);
  }
  
  // Add suggestions if available
  const suggestionsList = createSuggestionsList(step.suggestions);
  if (suggestionsList) {
    stepContent.appendChild(suggestionsList);
  }
  
  // Add resources (always last)
  const resourceContainer = createResourceContainer(step.resources);
  if (resourceContainer) {
    stepContent.appendChild(resourceContainer);
  }
  
  // Build accordion
  stepAccordion.appendChild(stepHeader);
  stepAccordion.appendChild(stepContent);
  
  // Add click event to toggle accordion (except for resources section)
  if (step.type !== 'resources_section') {
    stepHeader.addEventListener('click', () => {
      stepAccordion.classList.toggle('active');
    });
  }
  
  return stepAccordion;
}

/**
 * Creates a steps container for the given page
 * @param {string} pageName - The page name ('main', 'model_selection', 'duel')
 * @param {Object} activePath - The active path object
 * @param {Object} stepsLibrary - The steps library
 * @param {Object} currentSettings - The current settings
 * @param {boolean} useAccordion - Whether to use accordion style (true) or step style (false)
 * @param {Array<String>} forceActiveSteps - IDs of steps that should be active by default
 * @returns {HTMLElement} - The steps container
 */
export function createStepsContainer(pageName, activePath, stepsLibrary, currentSettings, useAccordion = false, forceActiveSteps = []) {
  const stepsContainer = document.createElement('div');
  stepsContainer.className = 'duels-content-container';
  stepsContainer.id = 'duels-steps-container';
  
  // Get steps for the specified page
  const pageSteps = getStepsForCurrentPage(activePath, stepsLibrary, pageName);
  
  // Create appropriate step elements
  pageSteps.forEach(step => {
    if (useAccordion) {
      const accordion = createAccordionElement(step, currentSettings.currentStep, forceActiveSteps);
      stepsContainer.appendChild(accordion);
    } else {
      const stepElement = createStepElement(step, currentSettings.currentStep);
      stepsContainer.appendChild(stepElement);
    }
  });
  
  return stepsContainer;
}