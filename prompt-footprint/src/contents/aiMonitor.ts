import { detectAIService } from "../utils/carbonCalculation";

// Function to detect when a user sends a prompt
function setupPromptDetection() {
  const url = window.location.href;
  const aiService = detectAIService(url);
  
  console.log(`[Prompt Footprint] Starting on ${url}, detected service: ${aiService}`);
  
  if (aiService === 'other') return;
  
  // Store for already processed elements to avoid duplicates
  const processedElements = new Set();
  
  // Different selectors for different AI services
  const selectors: Record<string, { button: string, input: string }> = {
    'chatgpt': {
      button: 'button[data-testid="send-button"], button.absolute, button[aria-label="Submit"]',
      input: 'textarea[data-testid="chat-input-textarea"], textarea[placeholder], textarea.w-full'
    },
    'claude': {
      button: 'button[aria-label="Send message"], button[type="submit"], button.submit-button',
      input: 'div[contenteditable="true"], textarea'
    },
    'bard': {
      button: 'button[aria-label="Send"], button.send-button, button[type="submit"]',
      input: 'div[contenteditable="true"], textarea.input-area'
    },
    'bing': {
      button: 'button[aria-label="Submit"], button.submit-button, button[type="submit"]',
      input: 'textarea[placeholder], textarea.input-area'
    },
    'perplexity': {
      button: 'button[aria-label="Send message"], button[type="submit"], button.send-button',
      input: 'div[contenteditable="true"], textarea'
    }
  };
  
  // Get the relevant selectors for this AI service
  const serviceSelectors = selectors[aiService] || {
    button: 'button[type="submit"]',
    input: 'textarea, div[contenteditable="true"]'
  };
  
  // Function to notify the background script about a detected prompt
  function notifyPromptDetected() {
    console.log(`[Prompt Footprint] Detected prompt for ${aiService}`);
    chrome.runtime.sendMessage({
      type: "PROMPT_DETECTED",
      aiService: aiService
    }, (response) => {
      if (response) {
        console.log(`[Prompt Footprint] Background response:`, response);
      } else {
        console.error(`[Prompt Footprint] No response from background script`);
      }
    });
  }
  
  // Add direct event listener for send buttons
  function addButtonListeners() {
    console.log(`[Prompt Footprint] Looking for buttons with selector: ${serviceSelectors.button}`);
    const buttons = document.querySelectorAll(serviceSelectors.button);
    console.log(`[Prompt Footprint] Found ${buttons.length} buttons`);
    
    buttons.forEach(button => {
      if (!processedElements.has(button)) {
        processedElements.add(button);
        console.log(`[Prompt Footprint] Adding listener to button:`, button);
        
        // Add click listener
        button.addEventListener('click', () => {
          console.log(`[Prompt Footprint] Button clicked`);
          const input = document.querySelector(serviceSelectors.input);
          if (input && (input.textContent?.trim() || (input as HTMLInputElement).value?.trim())) {
            notifyPromptDetected();
          }
        });
      }
    });
  }
  
  // Call immediately to set up initial listeners
  addButtonListeners();
  
  // Create a mutation observer to watch for button clicks
  const observer = new MutationObserver((mutations) => {
    // Look for send buttons that have been added or changed
    addButtonListeners();
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
      if (input && document.activeElement === input && 
          (input.textContent?.trim() || (input as HTMLInputElement).value?.trim())) {
        notifyPromptDetected();
      }
    }
  });
  
  console.log(`[Prompt Footprint] Monitoring prompts for ${aiService}`);
}

// Run the setup when the script loads
setupPromptDetection();

// Add a test function to the window object for debugging
(window as any).testPromptFootprint = function() {
  console.log('[Prompt Footprint] Running test function');
  const url = window.location.href;
  const service = detectAIService(url);
  chrome.runtime.sendMessage({
    type: "PROMPT_DETECTED",
    aiService: service
  }, (response) => {
    console.log('[Prompt Footprint] Test message response:', response);
  });
  return `Test message sent for service: ${service}`;
};