# Prompt Footprint

A browser extension that tracks how many prompts you send to AI chatbots per day and calculates the carbon footprint of your AI usage.

## Features

- Tracks prompts sent to popular AI chatbots (ChatGPT, Claude, Bing AI, Bard, Perplexity)
- Counts daily prompt usage
- Estimates carbon footprint based on prompt length and AI model
- Provides visual dashboard of your AI usage
- Shows trends over time

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Carbon Calculation Methodology

This extension uses the following methodology to estimate carbon footprint:
- GPT-4: ~0.5 g CO2e per query
- Claude: ~0.3 g CO2e per query
- Other AI models: ~0.2 g CO2e per query

*Note: These are rough estimates based on available research. Actual carbon footprint may vary based on model size, query length, and datacenter efficiency.*