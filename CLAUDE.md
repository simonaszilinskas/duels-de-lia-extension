# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Duels de l'IA" is a Chrome extension (Manifest V3) for an educational workshop about AI. It injects a floating panel into `comparia.beta.gouv.fr/arene` where facilitators can access prompts, debate cards, resources (PDF slides), and FAQ content organized around the environmental impact of AI models.

## Development

This is a **no-build, vanilla JS/CSS** Chrome extension. There is no bundler, transpiler, or package manager.

**To test:** Load as an unpacked extension in `chrome://extensions/` (enable Developer Mode), then navigate to `https://comparia.beta.gouv.fr/arene`.

**To reload after changes:** Click the refresh icon on the extension card in `chrome://extensions/`, then refresh the target page.

## Architecture

- **`manifest.json`** — Manifest V3 config. Content script auto-injects on `comparia.beta.gouv.fr/*`.
- **`js/content-redesign.js`** — Main content script (single IIFE). Creates the FAB button, draggable panel, and all views (main grid, prompts/personas, debate cards, FAQ, resources, feedback, debate final). All DOM is built programmatically.
- **`js/content-loader.js`** — Standalone content loader module (currently unused by the main script, which loads JSON directly via `fetch`).
- **`css/new-styles.css`** — All extension styles, prefixed with `duelsia-` to avoid conflicts with the host page.
- **`data/content-data.json`** — All workshop content (steps, personas/prompts, debate cards, FAQ Q&A, resource links). This is the primary file to edit when updating content.
- **`data/slides/`** — Local PDF files referenced by resources in `content-data.json` (type `local-pdf`).

## Key Conventions

- All DOM element IDs and CSS classes are prefixed with `duelsia-` to namespace them from the host page.
- Content is data-driven: edit `data/content-data.json` to change prompts, debate cards, FAQ entries, or resource links. The JS renders from this JSON.
- Resources support two types: `local-pdf` (bundled in `data/slides/`) and `google-drive` (embedded via iframe preview URL).
- The extension has no background script, no popup, and no permissions — it's purely a content script.
- The project language is French (UI text, content, comments).
