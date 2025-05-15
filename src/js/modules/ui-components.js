// ui-components.js - A modern component system for UI elements

/**
 * Base Component class
 * All UI components should extend this class
 */
class Component {
  /**
   * Create a component
   * @param {Object} props - Properties for the component
   */
  constructor(props = {}) {
    this.props = props;
    this.element = null;
  }
  
  /**
   * Create the DOM element for this component
   * Must be implemented by subclasses
   * @returns {HTMLElement}
   */
  render() {
    throw new Error('Component subclasses must implement render()');
  }
  
  /**
   * Mount the component to a parent element
   * @param {HTMLElement} parent - The parent element
   * @returns {HTMLElement} - The mounted component element
   */
  mount(parent) {
    if (!this.element) {
      this.element = this.render();
    }
    
    if (parent) {
      parent.appendChild(this.element);
    }
    
    return this.element;
  }
  
  /**
   * Update the component with new props
   * @param {Object} newProps - New properties to merge
   * @returns {HTMLElement} - The updated component element
   */
  update(newProps = {}) {
    this.props = { ...this.props, ...newProps };
    
    // If element already exists, remove it and re-render
    if (this.element && this.element.parentNode) {
      const parent = this.element.parentNode;
      this.element.remove();
      this.element = this.render();
      parent.appendChild(this.element);
    } else {
      this.element = this.render();
    }
    
    return this.element;
  }
  
  /**
   * Remove the component from the DOM
   */
  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
  }
}

/**
 * Button component
 */
export class Button extends Component {
  render() {
    const {
      text = '',
      className = '',
      onClick = null,
      icon = null,
      title = '',
      type = 'button'
    } = this.props;
    
    const button = document.createElement(type === 'link' ? 'a' : 'button');
    button.className = className;
    
    if (type === 'link' && this.props.href) {
      button.href = this.props.href;
      button.target = this.props.target || '_blank';
    }
    
    if (icon) {
      // Check if it's a FontAwesome icon class or an emoji
      if (typeof icon === 'string' && (icon.startsWith('fas ') || icon.startsWith('far ') || icon.startsWith('fab '))) {
        const iconElement = document.createElement('i');
        iconElement.className = icon;
        button.appendChild(iconElement);
        
        if (text) {
          button.innerHTML += ' ' + text;
        }
      } else {
        // Emoji icon
        button.innerHTML = icon + (text ? ` ${text}` : '');
      }
    } else {
      button.textContent = text;
    }
    
    if (title) {
      button.title = title;
    }
    
    if (onClick) {
      button.addEventListener('click', onClick);
    }
    
    this.element = button;
    return button;
  }
}

/**
 * Container component for grouping elements
 */
export class Container extends Component {
  render() {
    const {
      className = '',
      id = '',
      children = [],
      tag = 'div',
      style = null
    } = this.props;
    
    const container = document.createElement(tag);
    
    if (className) container.className = className;
    if (id) container.id = id;
    
    // Apply inline styles if provided
    if (style) {
      Object.keys(style).forEach(key => {
        container.style[key] = style[key];
      });
    }
    
    // Mount children
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Component) {
          child.mount(container);
        } else if (child instanceof HTMLElement) {
          container.appendChild(child);
        } else if (typeof child === 'string') {
          container.appendChild(document.createTextNode(child));
        }
      });
    }
    
    this.element = container;
    return container;
  }
}

/**
 * Text component
 */
export class Text extends Component {
  render() {
    const {
      text = '',
      tag = 'p',
      className = ''
    } = this.props;
    
    const element = document.createElement(tag);
    
    if (className) {
      element.className = className;
    }
    
    element.innerHTML = text;
    
    this.element = element;
    return element;
  }
}

/**
 * Icon component
 */
export class Icon extends Component {
  render() {
    const {
      icon = '',
      className = ''
    } = this.props;
    
    let element;
    
    // Font Awesome icon
    if (icon.startsWith('fas ') || icon.startsWith('far ') || icon.startsWith('fab ')) {
      element = document.createElement('i');
      element.className = `${icon} ${className}`.trim();
    } 
    // Emoji icon
    else {
      element = document.createElement('span');
      element.className = className;
      element.textContent = icon;
    }
    
    this.element = element;
    return element;
  }
}

/**
 * FloatingActionButton component
 */
export class FloatingActionButton extends Component {
  render() {
    const {
      icon = '⚔️',
      onClick = null,
      title = 'Guide d\'Atelier',
      className = 'duels-fab'
    } = this.props;
    
    const fab = document.createElement('div');
    fab.className = className;
    fab.innerHTML = icon;
    fab.title = title;
    
    if (onClick) {
      fab.addEventListener('click', onClick);
    }
    
    this.element = fab;
    return fab;
  }
}

/**
 * Header component
 */
export class Header extends Component {
  render() {
    const {
      title = '',
      icon = '',
      onClose = null,
      className = 'duels-header'
    } = this.props;
    
    const header = document.createElement('div');
    header.className = className;
    
    // Create title
    const titleElement = document.createElement('h2');
    if (icon) {
      titleElement.innerHTML = `<i class="${icon}"></i> ${title}`;
    } else {
      titleElement.textContent = title;
    }
    header.appendChild(titleElement);
    
    // Create navbar
    const navbar = document.createElement('div');
    navbar.className = 'duels-navbar';
    
    // Add resources button if provided
    if (this.props.onToggleResources) {
      const resourcesButton = new Button({
        className: 'duels-resources-btn',
        icon: 'fas fa-book',
        title: 'Ressources',
        onClick: this.props.onToggleResources
      }).render();
      
      navbar.appendChild(resourcesButton);
    }
    
    // Add close button if onClose provided
    if (onClose) {
      const closeButton = new Button({
        className: 'duels-close-button',
        text: '×',
        onClick: onClose
      }).render();
      
      navbar.appendChild(closeButton);
    }
    
    header.appendChild(navbar);
    
    this.element = header;
    return header;
  }
}

/**
 * Callout component
 */
export class Callout extends Component {
  render() {
    const {
      type = 'info',
      icon = null,
      title = null,
      content = ''
    } = this.props;
    
    const calloutElement = document.createElement('div');
    calloutElement.className = `duels-callout duels-callout-${type}`;
    
    // Add icon if provided
    if (icon) {
      const iconComponent = new Icon({ icon }).render();
      iconComponent.className += ' duels-callout-icon';
      calloutElement.appendChild(iconComponent);
    }
    
    // Add callout content
    const calloutContent = document.createElement('div');
    calloutContent.className = 'duels-callout-content';
    
    // Add title if provided
    if (title) {
      const calloutTitle = document.createElement('div');
      calloutTitle.className = 'duels-callout-title';
      calloutTitle.innerHTML = `<strong>${title}</strong>`;
      calloutContent.appendChild(calloutTitle);
    }
    
    // Add content
    const calloutText = document.createElement('div');
    calloutText.className = 'duels-callout-text';
    calloutText.textContent = content;
    calloutContent.appendChild(calloutText);
    
    calloutElement.appendChild(calloutContent);
    
    this.element = calloutElement;
    return calloutElement;
  }
}

/**
 * ResourceButton component
 */
export class ResourceButton extends Component {
  render() {
    const {
      title = '',
      url = '#',
      className = 'duels-resource-button'
    } = this.props;
    
    const button = document.createElement('a');
    button.className = className;
    button.href = url;
    button.target = '_blank';
    button.textContent = title;
    
    this.element = button;
    return button;
  }
}

/**
 * Persona component with expandable prompt
 */
export class Persona extends Component {
  render() {
    const {
      persona = '',
      prompt = '',
      onCopy = null
    } = this.props;
    
    const container = document.createElement('div');
    container.className = 'duels-persona-container';
    
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
      
      // Recreate full suggestion format
      const fullPrompt = `${persona}: ${prompt}`;
      
      navigator.clipboard.writeText(fullPrompt)
        .then(() => {
          // Visual feedback
          promptElement.classList.add('copied');
          copyButton.textContent = 'Copié!';
          setTimeout(() => {
            promptElement.classList.remove('copied');
            copyButton.textContent = 'Copier';
          }, 1000);
          
          // Call custom onCopy handler if provided
          if (onCopy) {
            onCopy(fullPrompt);
          }
        });
    });
    
    promptElement.appendChild(copyButton);
    
    // Add toggle functionality
    personaElement.addEventListener('click', () => {
      personaElement.classList.toggle('open');
      promptElement.classList.toggle('visible');
    });
    
    container.appendChild(personaElement);
    container.appendChild(promptElement);
    
    this.element = container;
    return container;
  }
}

/**
 * ResourcePanel component
 */
export class ResourcePanel extends Component {
  render() {
    const {
      commonResources,
      activePath,
      stepsLibrary,
      onBack
    } = this.props;
    
    const resourcesPanel = document.createElement('div');
    resourcesPanel.className = 'duels-content-container';
    resourcesPanel.id = 'duels-resources-panel';
    resourcesPanel.style.display = 'none';
    
    // Add back button
    const backButton = new Button({
      className: 'duels-back-to-steps',
      icon: 'fas fa-arrow-left',
      title: 'Retour aux étapes',
      onClick: onBack
    }).render();
    
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
        
        // Create persona component
        const personaComponent = new Persona({
          persona,
          prompt,
          onCopy: (text) => console.log('Copied:', text)
        }).render();
        
        promptsList.appendChild(personaComponent);
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
        const resourceButton = new ResourceButton({
          title: resource.title,
          url: resource.url
        }).render();
        
        educationalSection.appendChild(resourceButton);
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
        const resourceButton = new ResourceButton({
          title: resource.title,
          url: resource.url
        }).render();
        
        frugaleSection.appendChild(resourceButton);
      });
      
      resourcesPanel.appendChild(frugaleSection);
    }
    
    this.element = resourcesPanel;
    return resourcesPanel;
  }
}

/**
 * Guide component
 */
export class Guide extends Component {
  render() {
    const {
      activePath,
      onToggleResources,
      onClose
    } = this.props;
    
    const guide = document.createElement('div');
    guide.className = 'duels-guide';
    guide.id = 'duels-guide';
    
    // Create header
    const header = new Header({
      title: activePath.name,
      icon: activePath.icon,
      onClose,
      onToggleResources
    }).render();
    
    guide.appendChild(header);
    
    this.element = guide;
    return guide;
  }
}

/**
 * Create a standardized guide with all components
 * @param {Object} props - Guide properties
 * @returns {Guide} - The complete guide component
 */
export function createGuideComponent(props) {
  const {
    activePath,
    onToggleResources,
    onClose,
    stepsContainer,
    resourcesPanel
  } = props;
  
  // Create guide component
  const guide = new Guide({
    activePath,
    onToggleResources,
    onClose
  });
  
  // Render guide to get element
  const guideElement = guide.render();
  
  // Add step container if provided
  if (stepsContainer) {
    guideElement.appendChild(stepsContainer);
  }
  
  // Add resources panel if provided
  if (resourcesPanel) {
    guideElement.appendChild(resourcesPanel);
  }
  
  return guide;
}