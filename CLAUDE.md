# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Duels de l'IA" is a Chrome extension (Manifest V3) for an educational workshop about AI. It injects a floating panel into `comparia.beta.gouv.fr` where facilitators can access prompts, debate cards, slide decks, and FAQ content organized around the environmental impact of AI models.

## Development

This is a **no-build, vanilla JS/CSS** Chrome extension. There is no bundler, transpiler, or package manager.

**To test:** Load as an unpacked extension in `chrome://extensions/` (enable Developer Mode), then navigate to `https://comparia.beta.gouv.fr`. The arena is at the site root; the model catalogue is at `/models`.

**To reload after changes:** Click the refresh icon on the extension card in `chrome://extensions/`, then refresh the target page.

## Architecture

- **`manifest.json`**: Manifest V3 config. The content script auto-injects on `comparia.beta.gouv.fr` and its subdomains.
- **`js/content-redesign.js`**: main content script (single IIFE). Creates the FAB button, draggable panel, and all views (main grid, prompts/personas, debate cards, FAQ, resources, feedback, debate final). All DOM is built programmatically.
- **`css/new-styles.css`**: all styles injected into the host page, prefixed with `duelsia-` to avoid conflicts.
- **`data/content-data.json`**: all workshop content (steps, personas/prompts, debate cards, FAQ Q&A, resource links). This is the primary file to edit when updating content.
- **`data/slides/`**: slide decks, one HTML file per deck, referenced by resources in `content-data.json` (type `slides`). `slides.css` holds the shared styles and the class vocabulary (`.stage`, `.slide`, `.cartes`, `.nuance`, `.source`…); the packaged `slides.js` file handles navigation and is loaded with `<script src="slides.js" defer></script>`. A deck contains no inline script, inline event handler, or `<style>` block. MV3's CSP (`script-src 'self'`) permits packaged scripts but rejects inline JavaScript.
- **`fonts/`**: Marianne, self-hosted. The systeme-de-design.gouv.fr URL the CSS used to import returns 404, and `privacy.md` promises no third-party requests.

## Key Conventions

- DOM IDs and CSS classes injected into the compar:IA page are prefixed with `duelsia-`. Slide decks run in their own iframe, so their internal classes (`stage`, `slide`, `source`…) do not need that prefix.
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

Les sept supports suivent un fil : ce qu'est un modèle, ce qui le fait
consommer, comment lire le bilan d'un duel, d'où viennent les chiffres, le poids
physique de l'IA, l'effet rebond, et ce qu'on retient. Une notion se traite dans
un seul support : l'échelle A à F est dans « Lire le bilan », les classes de
taille dans « Ce qui fait consommer ». Ne pas les reprendre ailleurs.

Rules that matter:

- Every quantitative claim and data graphic carries a visible source, in a
  `<p class="source">`. Decorative illustrations and interface screenshots are
  identified by their alternative text instead.
- Content must stay aligned with what compar:IA actually shows. The product presents
  energy in mWh, an A–F energy class, XS–XL size classes, required hardware, cost, and
  three usage scenarios. It shows **no CO2** and no ADEME-style equivalences. Do not
  present those as product output; the broader carbon context may still be taught when
  it is clearly distinguished from the bilan and sourced.
- Decks are plain text on purpose: the previous PDFs made it impossible to review or
  correct a figure.
- Un titre tient sur une ligne. Au-delà d'une quarantaine de signes, le raccourcir.
- Pas de logo d'éditeur : ils arrivent sur plaque noire et n'apprennent rien.
- Un modèle non ouvert se dit « propriétaire », jamais « fermé ».
- EcoLogits rend une énergie ; la classe A à F est une règle de compar:IA.
- Les exemples de modèles se prennent dans le catalogue, parmi ceux en service.
- Un chiffre relayé se cite à sa source d'origine, pas à qui l'a repris.
- Une comparaison entre deux chiffres exige le même périmètre et la même année.

Graphiques : SVG écrit à la main, dans le flux du document. Rien n'est chargé de
l'extérieur, la police est celle de la page, et les libellés se dimensionnent en
`cqw` pour ne pas grossir avec le dessin. Le rapport largeur/hauteur du `viewBox`
se cale sur la boîte mesurée dans la diapositive, sinon le dessin se centre et
laisse deux bandes vides. Les données chiffrées viennent de
`data/legacy/generated-models.json` dans le dépôt compar:IA, pas de valeurs
recopiées à la main.

Une nouvelle classe de liste (`.echelle`, `.barres`, `.cycle`) se déclare
`.slide ul.<nom>` : la règle générale `.slide ul` est plus spécifique et
impose sinon une largeur de 52ch.

Run `node tools/check.mjs` after editing a deck. It catches the failures that are silent
otherwise: an inline script (blank slide), a missing image, a deck renamed but not updated
in `content-data.json` (invisible in the panel), and a leftover review marker.
