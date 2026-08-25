// Navigation commune aux supports. Chargée avec `defer`, donc le DOM est prêt.
// La CSP des extensions MV3 interdit le script en ligne : tout passe par ce fichier.
(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  let index = 0;

  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.innerHTML =
    '<button type="button" data-go="-1" aria-label="Diapositive précédente">‹</button>' +
    '<span aria-live="polite"></span>' +
    '<button type="button" data-go="1" aria-label="Diapositive suivante">›</button>';
  document.body.appendChild(nav);

  const compteur = nav.querySelector('span');
  const [precedent, suivant] = nav.querySelectorAll('button');
  const parentOrigin = location.ancestorOrigins && location.ancestorOrigins[0];

  function afficher(n) {
    index = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => s.classList.toggle('is-current', i === index));
    compteur.textContent = index + 1 + ' / ' + slides.length;
    precedent.disabled = index === 0;
    suivant.disabled = index === slides.length - 1;
    if (location.hash !== '#' + (index + 1)) {
      history.replaceState(null, '', '#' + (index + 1));
    }
  }

  nav.addEventListener('click', (e) => {
    const pas = e.target.dataset.go;
    if (pas) afficher(index + Number(pas));
  });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': afficher(index + 1); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': afficher(index - 1); break;
      case 'Home': afficher(0); break;
      case 'End': afficher(slides.length - 1); break;
      // Dans l'extension, le support est dans une iframe : le parent ferme la vue.
      case 'Escape':
        if (parent !== window && parentOrigin) {
          parent.postMessage({ duelsia: 'fermer' }, parentOrigin);
        }
        return;
      default: return;
    }
    e.preventDefault();
  });

  document.body.classList.add('deck-ready');
  afficher(Number(location.hash.slice(1)) - 1 || 0);
})();
