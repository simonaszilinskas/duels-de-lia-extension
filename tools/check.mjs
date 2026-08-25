// Vérifie ce qui casse en silence : un script en ligne laisse la diapositive
// blanche sans rien dire, et un support renommé disparaît du panneau.
// Usage : node tools/check.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const dossier = join(racine, 'data/slides');
const erreurs = [];
const fail = (f, m) => erreurs.push(`${f} : ${m}`);

const attribut = (texte, nom) => {
  const trouve = texte.match(new RegExp(`\\b${nom}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return trouve && (trouve[1] ?? trouve[2] ?? trouve[3]);
};

// Seuls les attributs qui chargent effectivement une ressource sont contrôlés.
// Une URL citée dans le texte d'une source ne provoque aucune requête réseau.
function ressourcesExternes(html) {
  const resultats = [];
  const balises = /<(img|script|iframe|audio|video|source|track|embed|object|link)\b([^>]*)>/gi;
  for (const trouve of html.matchAll(balises)) {
    const [, nom, attrs] = trouve;
    const nomAttribut = nom.toLowerCase() === 'object'
      ? 'data'
      : nom.toLowerCase() === 'link' ? 'href' : 'src';
    const valeur = attribut(attrs, nomAttribut);
    if (/^https?:\/\//i.test(valeur || '')) resultats.push(valeur);
  }
  if (/url\(\s*['"]?https?:\/\//i.test(html)) resultats.push('CSS url()');
  return resultats;
}

const entitesNommees = new Map([
  ['amp', '&'], ['apos', "'"], ['gt', '>'], ['lt', '<'], ['quot', '"'],
  ['nbsp', ' '], ['ensp', ' '], ['emsp', ' '], ['thinsp', ' '],
  ['rsquo', '’'], ['lsquo', '‘'], ['ndash', '–'], ['mdash', '—'],
]);

function decodeEntites(texte) {
  return texte.replace(/&(#(?:x[\da-f]+|\d+)|[a-z][\da-z]+);/gi, (entite, code) => {
    if (code[0] !== '#') return entitesNommees.get(code.toLowerCase()) ?? '￼';
    const hexadecimal = code[1].toLowerCase() === 'x';
    const point = Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
    try {
      return String.fromCodePoint(point);
    } catch {
      return '￼';
    }
  });
}

const decks = readdirSync(dossier).filter((f) => f.endsWith('.html'));

for (const nom of decks) {
  const s = readFileSync(join(dossier, nom), 'utf8');
  // La CSP des extensions MV3 refuse tout ça, et la diapositive reste blanche.
  for (const script of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const src = attribut(script[1], 'src');
    if (!src || script[2].trim()) fail(nom, 'script en ligne : interdit par la CSP');
    if (src && src !== 'slides.js') fail(nom, `script inattendu : ${src}`);
  }
  if (/\son[a-z]+\s*=/i.test(s)) fail(nom, 'gestionnaire inline (onclick…) : interdit par la CSP');
  if (/<style/i.test(s)) fail(nom, 'balise <style> : mettre le style dans slides.css');
  if (ressourcesExternes(s).length)
    fail(nom, 'ressource externe : privacy.md promet le contraire');

  if ((s.match(/<main class="stage">/g) || []).length !== 1) fail(nom, 'il faut exactement un <main class="stage">');
  if (!s.includes('slides.css') || !s.includes('slides.js')) fail(nom, 'feuille de style ou script commun absent');
  if (!s.startsWith('<!doctype html>')) fail(nom, 'le fichier ne commence pas par <!doctype html>');
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

  // Les logos d'éditeurs arrivent sur plaque noire et ne portent aucune idée.
  if (/alt="Logo/i.test(s)) fail(nom, "logo d'éditeur : garder le nom, pas l'image");

  // La salle découvre le produit tel qu'il est : on ne raconte pas son historique.
  const avantApres = [
    /compar:IA.{0,80}(publiait|affichait|montrait|comptait|proposait|calculait|utilisait)\b/i,
    /(publiait|affichait|montrait|comptait|proposait|calculait|utilisait)\b.{0,80}compar:IA/i,
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
    const corps = decodeEntites(d
      .replace(/<p class="source">[\s\S]*?<\/p>/g, '')
      // Les libellés d'un graphique ne sont pas du texte à lire : un axe et
      // trois étiquettes feraient sauter le plafond sans rien tasser.
      .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
      .replace(/<[^>]+>/g, ' '));
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
