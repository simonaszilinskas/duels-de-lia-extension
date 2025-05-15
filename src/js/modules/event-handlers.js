/**
 * event-handlers.js - Event handlers for interactive UI elements
 * Separates event handling logic from UI component creation
 */

/**
 * Attaches toggle behavior to persona/prompt elements
 * @param {HTMLElement} personaElement - The clickable persona header element
 * @param {HTMLElement} promptElement - The toggleable prompt content element
 */
export function attachPersonaToggle(personaElement, promptElement) {
  personaElement.addEventListener('click', () => {
    personaElement.classList.toggle('open');
    promptElement.classList.toggle('visible');
  });
}

/**
 * Attaches copy functionality to a button
 * @param {HTMLElement} button - The button element
 * @param {string} textToCopy - The text to copy to clipboard
 * @param {HTMLElement} feedbackElement - Element to show feedback on (optional)
 * @param {Function} onSuccess - Callback when copy succeeds (optional)
 */
export function attachCopyHandler(button, textToCopy, feedbackElement = null, onSuccess = null) {
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // Visual feedback
        if (feedbackElement) {
          feedbackElement.classList.add('copied');
        }
        
        const originalText = button.textContent;
        button.textContent = 'Copié!';
        
        setTimeout(() => {
          if (feedbackElement) {
            feedbackElement.classList.remove('copied');
          }
          button.textContent = originalText;
        }, 1000);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(textToCopy);
        }
      })
      .catch(err => {
        console.error('Copy failed:', err);
        button.textContent = 'Erreur!';
        setTimeout(() => {
          button.textContent = 'Copier';
        }, 1000);
      });
  });
}

/**
 * Attaches toggle behavior to an accordion header
 * @param {HTMLElement} headerElement - The accordion header element
 * @param {HTMLElement} accordionElement - The accordion container element
 */
export function attachAccordionToggle(headerElement, accordionElement) {
  headerElement.addEventListener('click', () => {
    accordionElement.classList.toggle('active');
  });
}

/**
 * Attaches random question generation to a dice button
 * @param {HTMLElement} diceButton - The dice button element
 * @param {HTMLElement} displayElement - The element to display the question
 * @param {Array<string>} questions - Array of questions to cycle through
 */
export function attachQuestionGenerator(diceButton, displayElement, questions) {
  if (!questions || !questions.length) return;
  
  let currentIndex = 0;
  
  function generateQuestion() {
    // Reset to beginning if we reached the end
    if (currentIndex >= questions.length) {
      currentIndex = 0;
    }
    
    // Set the question text
    displayElement.textContent = questions[currentIndex];
    
    // Increment for next time
    currentIndex++;
    
    // Animation
    diceButton.classList.add('rolling');
    setTimeout(() => {
      diceButton.classList.remove('rolling');
    }, 500);
  }
  
  // Add click handler
  diceButton.addEventListener('click', generateQuestion);
  
  // Generate first question after a short delay
  setTimeout(generateQuestion, 500);
}

/**
 * Attaches color-coded question generation to a dice button for discussion cards
 * @param {HTMLElement} diceButton - The dice button element
 * @param {HTMLElement} displayElement - The element to display the question
 * @param {Array<Object>} cards - Array of cards objects {question, color}
 */
export function attachDiscussionCardGenerator(diceButton, displayElement, cards) {
  if (!cards || !cards.length) return;
  
  let currentIndex = 0;
  
  function generateCard() {
    // Reset to beginning if we reached the end
    if (currentIndex >= cards.length) {
      currentIndex = 0;
    }
    
    // Get current card
    const card = cards[currentIndex];
    
    // Update display
    displayElement.textContent = card.question;
    
    // Set color
    displayElement.style.borderLeft = `4px solid ${card.color || '#6a6af4'}`;
    
    // Increment for next time
    currentIndex++;
    
    // Animation
    diceButton.classList.add('rolling');
    setTimeout(() => {
      diceButton.classList.remove('rolling');
    }, 500);
  }
  
  // Add click handler
  diceButton.addEventListener('click', generateCard);
  
  // Generate first card after a short delay
  setTimeout(generateCard, 500);
}

/**
 * Attaches conditional field display to yes/no radio buttons
 * @param {HTMLElement} yesInput - The "Yes" radio input
 * @param {HTMLElement} noInput - The "No" radio input
 * @param {HTMLElement} conditionalFields - The fields to show/hide
 */
export function attachConditionalFieldToggle(yesInput, noInput, conditionalFields) {
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
}

/**
 * Attaches URL change detection to handle navigation
 * @param {string} initialUrl - The initial URL
 * @param {Function} onChange - Callback when URL changes
 * @returns {MutationObserver} - The observer instance
 */
export function setupURLChangeDetection(initialUrl, onChange) {
  let lastUrl = initialUrl;
  
  // Create a MutationObserver to watch for DOM changes
  const observer = new MutationObserver(() => {
    // Check for URL changes
    if (lastUrl !== window.location.href) {
      const oldUrl = lastUrl;
      lastUrl = window.location.href;
      
      // Call the change handler
      onChange(lastUrl, oldUrl);
    }
  });
  
  // Start observing
  observer.observe(document, { subtree: true, childList: true });
  
  return observer;
}

/**
 * Attaches style observer for dynamic styling
 * @param {Function} onStyleChange - Callback when styles need updating
 * @returns {MutationObserver} - The observer instance
 */
export function setupStyleObserver(onStyleChange) {
  // Observer for dynamic styling
  const styleObserver = new MutationObserver(async () => {
    // Small delay to ensure DOM is updated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Call the change handler
    onStyleChange();
  });
  
  // Observe DOM for changes
  styleObserver.observe(document.body, { 
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
  
  return styleObserver;
}