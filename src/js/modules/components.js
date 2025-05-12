// components.js - UI components for the extension

// Function to create floating action button
export function createFAB(toggleGuideCallback) {
  const fab = document.createElement('div');
  fab.className = 'duels-fab';
  fab.innerHTML = '⚔️'; // Swords emoji
  fab.title = 'Guide d\'Atelier';
  
  fab.addEventListener('click', toggleGuideCallback);
  
  document.body.appendChild(fab);
  return fab;
}

// Function to create a guide with standardized header and navigation
export function createGuideBase(activePath, toggleResourcesCallback, toggleGuideCallback) {
  const guide = document.createElement('div');
  guide.className = 'duels-guide';
  guide.id = 'duels-guide';
  
  // Create header with navigation
  const header = document.createElement('div');
  header.className = 'duels-header';
  
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
  resourcesButton.addEventListener('click', toggleResourcesCallback);
  navbar.appendChild(resourcesButton);
  
  // Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'duels-close-button';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', toggleGuideCallback);
  navbar.appendChild(closeButton);
  
  header.appendChild(navbar);
  guide.appendChild(header);
  
  return guide;
}

// Function to create paths dropdown menu
export function createPathsDropdown(workshopPaths, currentSettings, changePathCallback, togglePathsDropdownCallback) {
  const dropdown = document.createElement('div');
  dropdown.className = 'duels-paths-dropdown';
  dropdown.id = 'duels-paths-dropdown';
  
  const title = document.createElement('div');
  title.className = 'duels-dropdown-title';
  title.textContent = 'Sélectionner un parcours';
  dropdown.appendChild(title);
  
  const pathsList = document.createElement('div');
  pathsList.className = 'duels-paths-list';
  
  // Add each available path
  Object.values(workshopPaths).forEach(path => {
    const pathItem = document.createElement('div');
    pathItem.className = 'duels-path-item';
    if (path.id === currentSettings.activePath) {
      pathItem.classList.add('active');
    }
    
    const pathIcon = document.createElement('i');
    pathIcon.className = path.icon;
    pathItem.appendChild(pathIcon);
    
    const pathInfo = document.createElement('div');
    pathInfo.className = 'duels-path-info';
    
    const pathName = document.createElement('div');
    pathName.className = 'duels-path-name';
    pathName.textContent = path.name;
    pathInfo.appendChild(pathName);
    
    const pathDesc = document.createElement('div');
    pathDesc.className = 'duels-path-description';
    pathDesc.textContent = path.description;
    pathInfo.appendChild(pathDesc);
    
    pathItem.appendChild(pathInfo);
    
    // Add click handler to change path
    pathItem.addEventListener('click', () => {
      changePathCallback(path.id);
      togglePathsDropdownCallback(); // Close dropdown after selection
    });
    
    pathsList.appendChild(pathItem);
  });
  
  dropdown.appendChild(pathsList);
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'duels-dropdown-close';
  closeBtn.innerHTML = 'Fermer';
  closeBtn.addEventListener('click', togglePathsDropdownCallback);
  dropdown.appendChild(closeBtn);
  
  // Add to document
  document.body.appendChild(dropdown);
  
  return dropdown;
}

// Fonction pour créer et afficher un callout dans une étape
export function renderCallout(step, container) {
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
export function createResourcesPanel(commonResources, activePath, stepsLibrary, toggleResourcesCallback) {
  const resourcesPanel = document.createElement('div');
  resourcesPanel.className = 'duels-content-container';
  resourcesPanel.id = 'duels-resources-panel';
  resourcesPanel.style.display = 'none';
  
  // Add back to steps button (icon only)
  const backButton = document.createElement('button');
  backButton.className = 'duels-back-to-steps';
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
  backButton.title = 'Retour aux étapes';
  backButton.addEventListener('click', toggleResourcesCallback);
  resourcesPanel.appendChild(backButton);
  
  // Get current path and relevant steps
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
  
  // Other resources section
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
  
  // Notes de facilitation section
  if (commonResources.facilitatorGuide) {
    const notesSection = document.createElement('div');
    notesSection.className = 'duels-resources-section';
    
    const notesTitle = document.createElement('h3');
    notesTitle.className = 'duels-resources-section-title';
    notesTitle.textContent = 'Notes de facilitation';
    notesSection.appendChild(notesTitle);
    
    const facilitatorLink = document.createElement('a');
    facilitatorLink.className = 'duels-resource-button';
    facilitatorLink.href = commonResources.facilitatorGuide.url;
    facilitatorLink.target = '_blank';
    facilitatorLink.textContent = commonResources.facilitatorGuide.title;
    notesSection.appendChild(facilitatorLink);
    
    resourcesPanel.appendChild(notesSection);
  }
  
  return resourcesPanel;
}