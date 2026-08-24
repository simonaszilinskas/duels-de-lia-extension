# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Duels de l'IA" is a Chrome extension (Manifest V3) for an educational workshop about AI. It injects a floating panel into `comparia.beta.gouv.fr` where facilitators can access prompts, debate cards, slide decks, and FAQ content organized around the environmental impact of AI models.

## Development

This is a **no-build, vanilla JS/CSS** Chrome extension. There is no bundler, transpiler, or package manager.

**To test:** Load as an unpacked extension in `chrome://extensions/` (enable Developer Mode), then navigate to `https://comparia.beta.gouv.fr`. The arena is at the site root; the model catalogue is at `/models`. The content script also injects on `localhost`, so it can be tested against a local compar:IA build.

**To reload after changes:** Click the refresh icon on the extension card in `chrome://extensions/`, then refresh the target page.

## Architecture

- **`manifest.json`**: Manifest V3 config. Content script auto-injects on `comparia.beta.gouv.fr/*`.
- **`js/content-redesign.js`**: main content script (single IIFE). Creates the FAB button, draggable panel, and all views (main grid, prompts/personas, debate cards, FAQ, resources, feedback, debate final). All DOM is built programmatically.
- **`css/new-styles.css`**: all extension styles, prefixed with `duelsia-` to avoid conflicts with the host page.
- **`data/content-data.json`**: all workshop content (steps, personas/prompts, debate cards, FAQ Q&A, resource links). This is the primary file to edit when updating content.
- **`data/slides/`**: slide decks, one HTML file per deck, referenced by resources in `content-data.json` (type `slides`). `slides.css` holds the shared styles and the class vocabulary (`.stage`, `.slide`, `.cartes`, `.nuance`, `.source`…); `slides.js` handles navigation. A deck is pure markup: no `<style>`, no `<script>`, no inline handlers. The MV3 CSP (`script-src 'self'`) rejects them and the slide renders blank.
- **`fonts/`**: Marianne, self-hosted. The systeme-de-design.gouv.fr URL the CSS used to import returns 404, and `privacy.md` promises no third-party requests.

## Key Conventions

- All DOM element IDs and CSS classes are prefixed with `duelsia-` to namespace them from the host page.
- Content is data-driven: edit `data/content-data.json` to change prompts, debate cards, FAQ entries, or resource links. The JS renders from this JSON.
- Resources support two types: `slides` (an HTML deck bundled in `data/slides/`) and `google-drive` (embedded via iframe preview URL). `local-pdf` is still accepted for backwards compatibility.
- The extension has no background script, no popup, and no permissions. It's purely a content script.
- The project language is French (UI text, content, comments).

## Slide decks

Each deck is a standalone HTML file under `data/slides/`, opened in an iframe by the
content script. Structure:

```html
<main class="stage">
  <section class="slide titre">…</section>
  <section class="slide">…</section>
</main>
```

Rules that matter:

- Every figure carries a visible source, in a `<p class="source">`.
- Content must stay aligned with what compar:IA actually shows. The product presents
  energy in mWh, an A–F energy class, XS–XL size classes, required hardware, cost, and
  three usage scenarios. It shows **no CO2** and no ADEME-style equivalences. Do not
  reintroduce them.
- Decks are plain text on purpose: the previous PDFs made it impossible to review or
  correct a figure.

Run `node tools/check.mjs` after editing a deck. It catches the failures that are silent
otherwise: an inline script (blank slide), a missing image, a deck renamed but not updated
in `content-data.json` (invisible in the panel), and a leftover review marker.
