import { defineManifest } from "@plasmohq/plasma";
import packageJson from "../package.json";

/**
 * This file is used by the Plasmo framework to generate the extension manifest
 */
export default defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName,
  version: packageJson.version,
  description: packageJson.description,
  icons: {
    "16": "assets/icon16.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  },
  action: {
    default_popup: "popup/index.html",
    default_icon: {
      "16": "assets/icon16.png",
      "48": "assets/icon48.png",
      "128": "assets/icon128.png"
    }
  },
  permissions: ["storage", "scripting", "tabs"],
  host_permissions: [
    "https://*.openai.com/*",
    "https://*.anthropic.com/*",
    "https://*.claude.ai/*",
    "https://*.bing.com/*",
    "https://*.google.com/*",
    "https://*.perplexity.ai/*"
  ],
  background: {
    service_worker: "background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: [
        "https://*.openai.com/*",
        "https://*.anthropic.com/*",
        "https://*.claude.ai/*",
        "https://*.bing.com/*",
        "https://*.google.com/*",
        "https://*.perplexity.ai/*"
      ],
      js: ["contents/aiMonitor.ts"]
    }
  ]
}));