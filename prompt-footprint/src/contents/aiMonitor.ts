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
    
    try {
      chrome.runtime.sendMessage({
        type: "PROMPT_DETECTED",
        aiService: aiService
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(`[Prompt Footprint] Error sending message:`, chrome.runtime.lastError);
          return;
        }
        
        if (response) {
          console.log(`[Prompt Footprint] Background response:`, response);
        } else {
          console.error(`[Prompt Footprint] No response from background script`);
        }
      });
    } catch (error) {
      console.error(`[Prompt Footprint] Exception sending message:`, error);
    }
  }
  
  // Add a global click listener for Claude
  function setupGlobalClickListener() {
    console.log(`[Prompt Footprint] Setting up global click listener for ${aiService}`);
    
    // For Claude, we'll use a more aggressive approach with a document-wide click listener
    if (aiService === 'claude') {
      document.addEventListener('click', (event) => {
        // Check if the click is on a button or inside a button
        const target = event.target as HTMLElement;
        const button = target.closest('button');
        
        if (button) {
          console.log(`[Prompt Footprint] Button click detected:`, button);
          
          // Check if this looks like a send button
          const isSendButton = 
            button.getAttribute('aria-label') === 'Send Message' ||
            (button.querySelector('svg') && button.querySelector('svg[width="16"][height="16"]')) ||
            button.classList.contains('bg-accent-main-100');
            
          if (isSendButton) {
            console.log(`[Prompt Footprint] Send button detected!`);
            
            // Check if we have content in the editor
            const input = document.querySelector('.ProseMirror, div[contenteditable="true"]');
            if (input && input.textContent?.trim()) {
              console.log(`[Prompt Footprint] Input content detected, logging prompt`);
              notifyPromptDetected();
            }
          }
        }
      });
      
      return; // Skip the standard button listeners for Claude
    }
    
    // Regular button handling for other services
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
  setupGlobalClickListener();
  
  // Create a mutation observer to watch for button clicks
  const observer = new MutationObserver((mutations) => {
    // No need to re-add global listeners for Claude
    if (aiService !== 'claude') {
      setupGlobalClickListener();
    }
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // For Claude, we need a more direct approach for the Enter key
  if (aiService === 'claude') {
    console.log(`[Prompt Footprint] Setting up Claude-specific Enter key handler`);
    
    // Direct keydown listener on the document
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        console.log(`[Prompt Footprint] Enter key pressed in Claude (key event):`, e);
        
        // Check if we have content in any editable div
        const inputs = document.querySelectorAll('.ProseMirror, div[contenteditable="true"]');
        console.log(`[Prompt Footprint] Found ${inputs.length} possible input areas`);
        
        let hasContent = false;
        inputs.forEach(input => {
          if (input.textContent?.trim()) {
            console.log(`[Prompt Footprint] Found input with content:`, input);
            hasContent = true;
          }
        });
        
        if (hasContent) {
          console.log(`[Prompt Footprint] Claude Enter key with content detected`);
          notifyPromptDetected();
        }
      }
    }, true); // Using capture phase to ensure this runs before other handlers
  } else {
    // Regular Enter key handling for other services
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        console.log(`[Prompt Footprint] Enter key pressed (key event):`, e);
        const input = document.querySelector(serviceSelectors.input);
        if (input && document.activeElement === input && 
            (input.textContent?.trim() || (input as HTMLInputElement).value?.trim())) {
          console.log(`[Prompt Footprint] Enter key detected with content`);
          notifyPromptDetected();
        }
      }
    });
  }
  
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
  const claudeButtons = document.querySelectorAll('button[aria-label="Send Message"]');
  console.log(`[Prompt Footprint] Found ${claudeButtons.length} buttons with aria-label="Send Message"`, claudeButtons);
  
  // Look for SVG buttons
  const svgButtons = document.querySelectorAll('button svg[width="16"][height="16"]');
  console.log(`[Prompt Footprint] Found ${svgButtons.length} buttons with SVG icons:`, svgButtons);
  
  // Look for accent colored buttons
  const accentButtons = document.querySelectorAll('button.bg-accent-main-100');
  console.log(`[Prompt Footprint] Found ${accentButtons.length} accent-colored buttons:`, accentButtons);
  
  // Look for the ProseMirror editor
  const editors = document.querySelectorAll('.ProseMirror, div[contenteditable="true"]');
  console.log(`[Prompt Footprint] Found ${editors.length} potential Claude editors:`, editors);
  
  // Test actually adding a prompt
  try {
    chrome.runtime.sendMessage({
      type: "PROMPT_DETECTED",
      aiService: "claude"
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Prompt Footprint] Error sending test message:', chrome.runtime.lastError);
        return;
      }
      console.log('[Prompt Footprint] Test message response:', response);
    });
    
    console.log('[Prompt Footprint] Successfully sent test message');
    
    // Also verify storage directly
    setTimeout(() => {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      chrome.storage.local.get([dateString], (result) => {
        console.log(`[Prompt Footprint] Current storage for today (${dateString}):`, result);
      });
    }, 500);
  } catch (error) {
    console.error('[Prompt Footprint] Exception sending test message:', error);
  }
  
  return {
    ariaButtonCount: claudeButtons.length,
    svgButtonCount: svgButtons.length,
    accentButtonCount: accentButtons.length,
    editorCount: editors.length,
    ariaButtons: claudeButtons,
    svgButtons: svgButtons,
    accentButtons: accentButtons,
    editors: editors,
    message: "Test prompt has been sent to the background script"
  };
};

// Add a simple counter reset function
(window as any).resetPromptCounter = function() {
  try {
    chrome.storage.local.clear(() => {
      if (chrome.runtime.lastError) {
        console.error('[Prompt Footprint] Error clearing storage:', chrome.runtime.lastError);
        return;
      }
      console.log('[Prompt Footprint] Storage has been cleared');
    });
    return "Storage cleared, counter reset";
  } catch (error) {
    console.error('[Prompt Footprint] Exception clearing storage:', error);
    return "Error clearing storage: " + error;
  }
};