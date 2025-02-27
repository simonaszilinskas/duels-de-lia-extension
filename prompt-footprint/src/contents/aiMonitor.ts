import { detectAIService } from "../utils/carbonCalculation";

// Function to detect when a user sends a prompt
function setupPromptDetection() {
  const url = window.location.href;
  const aiService = detectAIService(url);
  
  if (aiService === 'other') return;
  
  // Store for already processed elements to avoid duplicates
  const processedElements = new Set();
  
  // Different selectors for different AI services
  const selectors: Record<string, { button: string, input: string }> = {
    'chatgpt': {
      button: 'button[data-testid="send-button"]',
      input: 'textarea[data-testid="chat-input-textarea"]'
    },
    'claude': {
      button: 'button[aria-label="Send message"]',
      input: 'div[contenteditable="true"]'
    },
    'bard': {
      button: 'button[aria-label="Send"]',
      input: 'div[contenteditable="true"]'
    },
    'bing': {
      button: 'button[aria-label="Submit"]',
      input: 'textarea[placeholder]'
    },
    'perplexity': {
      button: 'button[aria-label="Send message"]',
      input: 'div[contenteditable="true"]'
    }
  };
  
  // Get the relevant selectors for this AI service
  const serviceSelectors = selectors[aiService] || {
    button: 'button[type="submit"]',
    input: 'textarea, div[contenteditable="true"]'
  };
  
  // Function to notify the background script about a detected prompt
  function notifyPromptDetected() {
    chrome.runtime.sendMessage({
      type: "PROMPT_DETECTED",
      aiService: aiService
    });
  }
  
  // Create a mutation observer to watch for button clicks
  const observer = new MutationObserver((mutations) => {
    // Look for send buttons that have been added or changed
    const buttons = document.querySelectorAll(serviceSelectors.button);
    
    buttons.forEach(button => {
      if (!processedElements.has(button)) {
        processedElements.add(button);
        
        // Add click listener
        button.addEventListener('click', () => {
          const input = document.querySelector(serviceSelectors.input);
          if (input && (input.textContent?.trim() || (input as HTMLInputElement).value?.trim())) {
            notifyPromptDetected();
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also track keyboard shortcuts (Enter key)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const input = document.querySelector(serviceSelectors.input);
      if (document.activeElement === input && 
          (input.textContent?.trim() || (input as HTMLInputElement).value?.trim())) {
        notifyPromptDetected();
      }
    }
  });
  
  console.log(`[Prompt Footprint] Monitoring prompts for ${aiService}`);
}

// Run the setup when the script loads
setupPromptDetection();