// guides.js - Guide implementations for different pages

import { renderCallout, createGuideBase, createResourcesPanel } from './components.js';

// Function to create a guide for the main page
export function createMainPageGuide(activePath, stepsLibrary, currentSettings, showingResources, commonResources, toggleGuideCallback, toggleResourcesCallback) {
  const guide = createGuideBase(activePath, toggleResourcesCallback, toggleGuideCallback);
  
  // Create steps container
  const stepsContainer = document.createElement('div');
  stepsContainer.className = 'duels-content-container';
  stepsContainer.id = 'duels-steps-container';
  
  // Get all steps for the main page
  const mainPageSteps = activePath.steps
    .map(stepId => stepsLibrary[stepId])
    .filter(step => step && step.pages.includes('main'))
    .sort((a, b) => a.order - b.order);
  
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
  const resourcesPanel = createResourcesPanel(commonResources, activePath, stepsLibrary, toggleResourcesCallback);
  guide.appendChild(resourcesPanel);
  
  // Set initial visibility
  if (showingResources) {
    stepsContainer.style.display = 'none';
    resourcesPanel.style.display = 'block';
  } else {
    stepsContainer.style.display = 'block';
    resourcesPanel.style.display = 'none';
  }
  
  return guide;
}

// Function to create a simplified guide for the model selection page (Step 2)
export function createModelSelectionGuide(activePath, stepsLibrary, currentSettings, showingResources, commonResources, toggleGuideCallback, toggleResourcesCallback) {
  const guide = createGuideBase(activePath, toggleResourcesCallback, toggleGuideCallback);
  
  // Create steps container
  const stepsContainer = document.createElement('div');
  stepsContainer.className = 'duels-content-container';
  stepsContainer.id = 'duels-steps-container';
  
  // Get steps for model selection page
  const modelSelectionSteps = activePath.steps
    .map(stepId => stepsLibrary[stepId])
    .filter(step => step && step.pages.includes('model_selection'))
    .sort((a, b) => a.order - b.order);
  
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
  const resourcesPanel = createResourcesPanel(commonResources, activePath, stepsLibrary, toggleResourcesCallback);
  guide.appendChild(resourcesPanel);
  
  // Set initial visibility
  if (showingResources) {
    stepsContainer.style.display = 'none';
    resourcesPanel.style.display = 'block';
  } else {
    stepsContainer.style.display = 'block';
    resourcesPanel.style.display = 'none';
  }
  
  return guide;
}

// Function to create guide for the duel page (steps 2-7)
export function createDuelGuide(activePath, stepsLibrary, currentSettings, showingResources, commonResources, toggleGuideCallback, toggleResourcesCallback) {
  const guide = createGuideBase(activePath, toggleResourcesCallback, toggleGuideCallback);
  
  // Create steps container
  const stepsContainer = document.createElement('div');
  stepsContainer.className = 'duels-content-container';
  stepsContainer.id = 'duels-steps-container';
  
  // Get steps for duel page
  const duelSteps = activePath.steps
    .map(stepId => stepsLibrary[stepId])
    .filter(step => step && step.pages.includes('duel'))
    .sort((a, b) => a.order - b.order);
  
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
  const resourcesPanel = createResourcesPanel(commonResources, activePath, stepsLibrary, toggleResourcesCallback);
  guide.appendChild(resourcesPanel);
  
  // Set initial visibility
  if (showingResources) {
    stepsContainer.style.display = 'none';
    resourcesPanel.style.display = 'block';
  } else {
    stepsContainer.style.display = 'block';
    resourcesPanel.style.display = 'none';
  }
  
  return guide;
}