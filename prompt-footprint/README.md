# Prompt Footprint

A browser extension that tracks how many prompts you send to AI chatbots and calculates the carbon footprint of your AI usage.

## Features

- Tracks prompts sent to popular AI services:
  - ChatGPT (OpenAI)
  - Claude (Anthropic)
  - Bard/Gemini (Google)
  - Bing AI (Microsoft)
  - Perplexity AI
- Counts daily prompt usage
- Estimates carbon footprint based on prompt usage
- Provides visual dashboard of your AI usage
- Shows trends over time

## Installation

### From Source Code

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/prompt-footprint.git
   cd prompt-footprint
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` directory

## Usage

1. After installation, visit any supported AI chatbot website
2. The extension will automatically track when you send prompts
3. Click on the Prompt Footprint icon in your browser toolbar to see your stats

### Console Debugging Commands

While on a supported website, you can use these commands in the browser console (F12):

- `resetPromptCounter()` - Reset the counter
- `showPromptCounter()` - Show current counter data
- `incrementPromptCounter()` - Manually increment the counter

## Carbon Calculation Methodology

This extension uses the following methodology to estimate carbon footprint:
- ChatGPT (GPT-4): ~0.5 g CO2e per query
- Claude: ~0.3 g CO2e per query
- Other AI models: ~0.2 g CO2e per query

*Note: These are rough estimates based on available research. Actual carbon footprint may vary based on model size, query length, and datacenter efficiency.*

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.