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
      button: 'button[aria-label="Send Message"], button[aria-label="Send message"], button[type="button"] svg[width="16"][height="16"]',
      input: '.ProseMirror, div[contenteditable="true"]'
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
    
    // For Claude specifically, we also need to look for the parent button 
    // of SVG elements since Claude's UI nests them
    if (aiService === 'claude') {
      const svgParents = document.querySelectorAll('button[type="button"] svg[width="16"][height="16"]');
      console.log(`[Prompt Footprint] Found ${svgParents.length} SVG buttons in Claude`);
      
      svgParents.forEach(svg => {
        const parentButton = svg.closest('button');
        if (parentButton && !processedElements.has(parentButton)) {
          processedElements.add(parentButton);
          console.log(`[Prompt Footprint] Adding listener to Claude SVG parent button:`, parentButton);
          
          parentButton.addEventListener('click', () => {
            console.log(`[Prompt Footprint] Claude button clicked`);
            const input = document.querySelector(serviceSelectors.input);
            if (input && input.textContent?.trim()) {
              notifyPromptDetected();
            }
          });
        }
      });
    }
    
    // Standard button handling
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
      // Special handling for Claude with the ProseMirror editor
      if (aiService === 'claude') {
        const input = document.querySelector('.ProseMirror');
        if (input && document.activeElement === input && input.textContent?.trim()) {
          console.log(`[Prompt Footprint] Claude Enter key detected with content`);
          notifyPromptDetected();
        }
      } else {
        const input = document.querySelector(serviceSelectors.input);
        if (input && document.activeElement === input && 
            (input.textContent?.trim() || (input as HTMLInputElement).value?.trim())) {
          console.log(`[Prompt Footprint] Enter key detected with content`);
          notifyPromptDetected();
        }
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

// Add a Claude-specific test function
(window as any).testClaudeDetection = function() {
  console.log('[Prompt Footprint] Testing Claude detection');
  // Find all possible send buttons
  const claudeButtons = document.querySelectorAll('button[aria-label="Send Message"], button[type="button"] svg[width="16"][height="16"]');
  console.log(`[Prompt Footprint] Found ${claudeButtons.length} potential Claude buttons:`, claudeButtons);
  
  // Look for the ProseMirror editor
  const editors = document.querySelectorAll('.ProseMirror, div[contenteditable="true"]');
  console.log(`[Prompt Footprint] Found ${editors.length} potential Claude editors:`, editors);
  
  return {
    buttonCount: claudeButtons.length,
    editorCount: editors.length,
    buttons: claudeButtons,
    editors: editors
  };
};