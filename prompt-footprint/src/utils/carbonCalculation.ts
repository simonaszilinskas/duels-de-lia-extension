// Carbon footprint estimates in grams of CO2 per query
// These are simplified estimates for demonstration purposes
export interface ModelFootprint {
  name: string;
  co2PerQuery: number; // grams of CO2 per query
  color: string;
}

export const AI_MODELS: Record<string, ModelFootprint> = {
  'chatgpt': {
    name: 'ChatGPT',
    co2PerQuery: 0.5,
    color: '#74AA9C'
  },
  'claude': {
    name: 'Claude',
    co2PerQuery: 0.3,
    color: '#A78BFA'
  },
  'bard': {
    name: 'Bard',
    co2PerQuery: 0.2,
    color: '#4285F4'
  },
  'bing': {
    name: 'Bing AI',
    co2PerQuery: 0.2,
    color: '#00809D'
  },
  'perplexity': {
    name: 'Perplexity',
    co2PerQuery: 0.25,
    color: '#3B82F6'
  },
  'other': {
    name: 'Other AI',
    co2PerQuery: 0.2,
    color: '#6B7280'
  }
};

// Determine AI service from URL
export function detectAIService(url: string): string {
  if (url.includes('openai.com') || url.includes('chat.openai.com')) {
    return 'chatgpt';
  } else if (url.includes('anthropic.com') || url.includes('claude.ai')) {
    return 'claude';
  } else if (url.includes('bard.google.com') || url.includes('gemini.google.com')) {
    return 'bard';
  } else if (url.includes('bing.com')) {
    return 'bing';
  } else if (url.includes('perplexity.ai')) {
    return 'perplexity';
  }
  return 'other';
}

// Calculate carbon footprint for a number of queries for a specific model
export function calculateFootprint(
  modelKey: string,
  queryCount: number
): number {
  const model = AI_MODELS[modelKey] || AI_MODELS['other'];
  return model.co2PerQuery * queryCount;
}

// Calculate total carbon across all models
export function calculateTotalCarbon(
  data: Record<string, number>
): number {
  return Object.entries(data).reduce((total, [modelKey, queryCount]) => {
    return total + calculateFootprint(modelKey, queryCount);
  }, 0);
}

// Convert carbon to everyday equivalents
export function carbonToEquivalent(carbonGrams: number): string {
  if (carbonGrams < 10) {
    return `${carbonGrams.toFixed(2)} grams CO₂e`;
  } else if (carbonGrams < 1000) {
    // Equivalent to smartphone charging
    const charges = (carbonGrams / 5).toFixed(1);
    return `${carbonGrams.toFixed(0)} grams CO₂e (≈ ${charges} smartphone charges)`;
  } else {
    // Convert to kg
    const kgCarbon = (carbonGrams / 1000).toFixed(2);
    // Driving distance in km (rough estimate: 120g CO2 per km)
    const drivingKm = (carbonGrams / 120).toFixed(1);
    return `${kgCarbon} kg CO₂e (≈ ${drivingKm} km of driving)`;
  }
}