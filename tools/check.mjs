// Vérifie ce qui casse en silence : un script en ligne laisse la diapositive
// blanche sans rien dire, et un support renommé disparaît du panneau.
// Usage : node tools/check.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const racine = join(dirname(new URL(import.meta.url).pathname), '..');
const dossier = join(racine, 'data/slides');
const erreurs = [];
const fail = (f, m) => erreurs.push(`${f} : ${m}`);

const decks = readdirSync(dossier).filter((f) => f.endsWith('.html'));

for (const nom of decks) {
  const s = readFileSync(join(dossier, nom), 'utf8');
  // La CSP des extensions MV3 refuse tout ça, et la diapositive reste blanche.
  if (/<script(?![^>]*\ssrc=)/i.test(s)) fail(nom, 'script en ligne : interdit par la CSP');
  if (/\son[a-z]+\s*=/i.test(s)) fail(nom, 'gestionnaire inline (onclick…) : interdit par la CSP');
  if (/<style/i.test(s)) fail(nom, 'balise <style> : mettre le style dans slides.css');
  if (/https?:\/\/(?!127\.0\.0\.1)/i.test(s.replace(/<p class="source">[\s\S]*?<\/p>/g, '')))
    fail(nom, 'appel externe hors ligne de source : privacy.md promet le contraire');

  if ((s.match(/<main class="stage">/g) || []).length !== 1) fail(nom, 'il faut exactement un <main class="stage">');
  if (!s.includes('slides.css') || !s.includes('slides.js')) fail(nom, 'feuille de style ou script commun absent');
  if (!s.includes('<html lang="fr">')) fail(nom, 'attribut lang absent');
  if (!/<section class="slide/.test(s)) fail(nom, 'aucune diapositive');
  if (/CONFIRMER|À AJOUTER|TODO/.test(s)) fail(nom, 'marqueur de relecture encore présent');
  if (s.includes('\u2014')) fail(nom, 'tiret cadratin : préférer la virgule, le deux-points ou le point');

  // Une diapositive s'adresse à la salle, pas à l'animateur.
  const notes = [
    /support d['’]origine/i,
    /\bl['’]animateur\b/i,
    /à dire à voix haute/i,
    /annoncez\b/i,
    /erratum/i,
  ];
  for (const re of notes) {
    if (re.test(s)) fail(nom, `note d'animateur ou erratum sur la diapositive : ${re}`);
  }

  // La salle découvre le produit tel qu'il est : on ne raconte pas son historique.
  const avantApres = [
    /(publiait|affichait|montrait|comptait|proposait|calculait|utilisait)\b/i,
    /plus aucun CO/i,
    /n['’]affiche plus/i,
    /ne montre plus/i,
    /\bavant la refonte\b/i,
    /\bnouvelle version du site\b/i,
  ];
  // Sur le texte sans balises : un <em> au milieu suffirait sinon à passer au travers.
  const texte = s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  for (const re of avantApres) {
    if (re.test(texte)) fail(nom, `comparaison avant/après sur compar:IA : ${re}`);
  }

  // Le produit n'affiche plus de CO2 : ne pas réintroduire l'ancien discours.
  for (const mot of ['tonnes de CO', 'baguette', 'Paris - NYC', 'Paris-NYC', 'mangue', 'piscine']) {
    if (s.includes(mot)) fail(nom, `vocabulaire de l'ancien écran CO2 : « ${mot} »`);
  }

  // Une diapositive tassée est ratée : on plafonne le texte.
  const diapos = s.split(/<section class="slide/).slice(1);
  diapos.forEach((d, i) => {
    const corps = d
      .replace(/<p class="source">[\s\S]*?<\/p>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ');
    const mots = corps.split(/\s+/).filter(Boolean).length;
    if (mots > 90) fail(nom, `diapositive ${i + 1} : ${mots} mots, à scinder`);
  });

  for (const balise of s.match(/<img[^>]*>/g) || []) {
    if (!/\salt=/.test(balise)) fail(nom, 'image sans attribut alt');
    const src = (balise.match(/src="([^"]+)"/) || [])[1];
    if (src && !existsSync(join(dossier, src))) fail(nom, `image absente : ${src}`);
  }
}

// Le panneau lit cette liste : un support renommé et non répercuté disparaît.
const data = JSON.parse(readFileSync(join(racine, 'data/content-data.json'), 'utf8'));
const items = data.duels['comment-se-deroule'].blocks.ressources.items;
const cites = new Set();
for (const item of items) {
  if (item.type !== 'slides') continue;
  cites.add(item.url.replace('data/slides/', ''));
  if (!existsSync(join(racine, item.url))) fail('content-data.json', `support introuvable : ${item.url}`);
}
for (const nom of decks) {
  if (!cites.has(nom)) fail('content-data.json', `support jamais cité, donc invisible : ${nom}`);
}
if (readFileSync(join(racine, 'data/content-data.json'), 'utf8').includes('\u2014')) {
  fail('content-data.json', 'tiret cadratin : préférer la virgule, le deux-points ou le point');
}

if (erreurs.length) {
  console.error(erreurs.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${decks.length} supports, ${items.length} entrées dans le panneau`);
