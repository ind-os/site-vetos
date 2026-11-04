// Relie la carte et les cliniques d'un [data-reseau] : la clinique sous le pointeur,
// ou celle du lien focus, porte data-survol. La carte et la clinique s'allument ensemble.
// Sans souris précise, le toucher n'allume rien : un doigt laisserait la clinique allumée.

const souris = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function identifiant(cible: EventTarget | null): string {
  if (!(cible instanceof Element)) return '';
  return cible.closest('[data-clinique]')?.getAttribute('data-clinique') ?? '';
}

document.querySelectorAll<HTMLElement>('[data-reseau]').forEach((reseau) => {
  let pointe = '';
  let clavier = '';
  let courant = '';

  function appliquer(): void {
    const id = pointe || clavier;
    if (id === courant) return;
    courant = id;
    reseau.querySelectorAll('[data-clinique]').forEach((el) => {
      el.toggleAttribute('data-survol', id !== '' && el.getAttribute('data-clinique') === id);
    });
  }

  if (souris) {
    reseau.addEventListener('pointerover', (e) => {
      pointe = identifiant(e.target);
      appliquer();
    });
    reseau.addEventListener('pointerout', (e) => {
      const reste = e.relatedTarget instanceof Node && reseau.contains(e.relatedTarget);
      pointe = reste ? identifiant(e.relatedTarget) : '';
      appliquer();
    });
  }

  reseau.addEventListener('focusin', (e) => {
    clavier = identifiant(e.target);
    appliquer();
  });
  reseau.addEventListener('focusout', (e) => {
    const reste = e.relatedTarget instanceof Node && reseau.contains(e.relatedTarget);
    clavier = reste ? identifiant(e.relatedTarget) : '';
    appliquer();
  });
});
