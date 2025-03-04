// Simple Prompt Footprint Extension
console.log('[Prompt Footprint] Simple version initializing');

// Detect AI service from URL
function detectAIService(url) {
  if (!url) return 'unknown';
  
  try {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('openai.com') || lowerUrl.includes('chat.openai.com')) {
      return 'chatgpt';
    } else if (lowerUrl.includes('anthropic.com') || lowerUrl.includes('claude.ai')) {
      return 'claude';
    } else if (lowerUrl.includes('bard.google.com') || lowerUrl.includes('gemini.google.com')) {
      return 'bard';
    } else if (lowerUrl.includes('bing.com')) {
      return 'bing';
    } else if (lowerUrl.includes('perplexity.ai')) {
      return 'perplexity';
    }
  } catch (error) {
    console.error('[Prompt Footprint] Error detecting service:', error);
  }
  
  return 'unknown';
}

// Get today's date in YYYY-MM-DD format
function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Initialize current service
const currentService = detectAIService(window.location.href);
console.log(`[Prompt Footprint] Detected service: ${currentService}`);

// Setup global click listener
if (currentService === 'claude') {
  document.addEventListener('click', (event) => {
    // Check if the click is on a button or inside a button
    const target = event.target;
    const button = target.closest('button');
    
    if (button) {
      // Check if this looks like a send button
      const isSendButton = 
        button.getAttribute('aria-label') === 'Send Message' ||
        (button.querySelector('svg') && button.querySelector('svg[width="16"][height="16"]')) ||
        button.classList.contains('bg-accent-main-100');
        
      if (isSendButton) {
        console.log(`[Prompt Footprint] Claude send button detected!`);
        
        // Check if we have content in the editor
        const input = document.querySelector('.ProseMirror, div[contenteditable="true"]');
        if (input && input.textContent?.trim()) {
          console.log(`[Prompt Footprint] Input content detected, logging prompt`);
          incrementCount(currentService);
        }
      }
    }
  });
  
  // Setup Enter key detection
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log(`[Prompt Footprint] Enter key pressed in Claude`);
      
      // Check for content in any editable div
      const inputs = document.querySelectorAll('.ProseMirror, div[contenteditable="true"]');
      
      let hasContent = false;
      inputs.forEach(input => {
        if (input.textContent?.trim()) {
          hasContent = true;
        }
      });
      
      if (hasContent) {
        console.log(`[Prompt Footprint] Claude Enter key with content detected`);
        incrementCount(currentService);
      }
    }
  }, true);
}

// Store a count in localStorage
function incrementCount(service) {
  try {
    const today = getTodayString();
    let data = JSON.parse(localStorage.getItem('promptFootprint') || '{}');
    
    if (!data[today]) {
      data[today] = { total: 0, services: {} };
    }
    
    if (!data[today].services[service]) {
      data[today].services[service] = 0;
    }
    
    data[today].services[service]++;
    data[today].total++;
    
    localStorage.setItem('promptFootprint', JSON.stringify(data));
    console.log(`[Prompt Footprint] Count incremented for ${service}. New total: ${data[today].total}`);
  } catch (error) {
    console.error('[Prompt Footprint] Error incrementing count:', error);
  }
}

// Reset the counter
function resetCounter() {
  try {
    localStorage.removeItem('promptFootprint');
    console.log('[Prompt Footprint] Counter reset');
    return 'Counter reset successfully';
  } catch (error) {
    console.error('[Prompt Footprint] Error resetting counter:', error);
    return 'Error resetting counter: ' + error;
  }
}

// Show current count
function showCounter() {
  try {
    const data = JSON.parse(localStorage.getItem('promptFootprint') || '{}');
    console.log('[Prompt Footprint] Current data:', data);
    return data;
  } catch (error) {
    console.error('[Prompt Footprint] Error showing counter:', error);
    return 'Error showing counter: ' + error;
  }
}

// Manually increment counter
function addCount(service = currentService) {
  incrementCount(service);
  return `Counter incremented for ${service}`;
}

// Add functions to window
window.resetPromptCounter = resetCounter;
window.showPromptCounter = showCounter;
window.incrementPromptCounter = addCount;

// Show instructions
console.log('[Prompt Footprint] Simple version loaded. Available commands:');
console.log('- resetPromptCounter() - Reset the counter');
console.log('- showPromptCounter() - Show current count data');
console.log('- incrementPromptCounter() - Manually increment the counter');