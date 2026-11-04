// Le bouton « Prendre rendez-vous » ouvre l'agenda Calendly dans un panneau pleine hauteur,
// à droite. Le code de Calendly n'est pas dans le premier affichage : il se charge quand le
// navigateur est libre, ou dès qu'on approche le bouton. Sans JavaScript, ou si Calendly ne
// répond pas, le lien ouvre l'agenda dans un onglet. VetLink n'est pas concerné.

export {};

declare global {
  interface Window {
    Calendly?: { initInlineWidget(options: { url: string; parentElement: HTMLElement }): void };
  }
}

const SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
const STYLE = 'https://assets.calendly.com/assets/external/widget.css';

let chargement: Promise<void> | undefined;
let tiroir: HTMLElement | undefined;
let lienOuvert: HTMLAnchorElement | undefined;

/** Charge le script et la feuille de style de Calendly, une seule fois. */
function chargerCalendly(): Promise<void> {
  chargement ??= new Promise<void>((resoudre, rejeter) => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = STYLE;
    document.head.append(style);
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => (window.Calendly ? resoudre() : rejeter(new Error('Calendly absent')));
    script.onerror = () => {
      chargement = undefined;
      rejeter(new Error('Calendly ne répond pas'));
    };
    document.head.append(script);
  });
  return chargement;
}

/** Après l'affichage de la page, quand le navigateur n'a plus rien d'urgent. */
function quandLeNavigateurEstLibre(action: () => void) {
  const lancer = () => {
    // requestIdleCallback manque sur de vieux navigateurs : on le traite comme facultatif.
    const idle = (window as Window & { requestIdleCallback?: Window['requestIdleCallback'] }).requestIdleCallback;
    if (idle) idle(() => action(), { timeout: 2500 });
    else window.setTimeout(action, 1200);
  };
  if (document.readyState === 'complete') lancer();
  else window.addEventListener('load', lancer, { once: true });
}

function preparer() {
  void chargerCalendly().catch(() => undefined);
}

function leTiroir(): HTMLElement {
  if (tiroir) return tiroir;
  tiroir = document.createElement('div');
  tiroir.className = 'tiroir';
  tiroir.inert = true;
  tiroir.setAttribute('aria-hidden', 'true');
  tiroir.innerHTML = `
    <button class="tiroir__fond" type="button" data-tiroir-fermer tabindex="-1" aria-hidden="true"></button>
    <div class="tiroir__panneau" role="dialog" aria-modal="true">
      <div class="tiroir__barre">
        <p class="tiroir__titre"></p>
        <button class="tiroir__fermer" type="button" data-tiroir-fermer>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path></svg>
        </button>
      </div>
      <div class="tiroir__cadre">
        <p class="tiroir__etat" hidden></p>
        <div class="tiroir__widget"></div>
      </div>
    </div>`;
  tiroir.addEventListener('click', (evenement) => {
    if ((evenement.target as HTMLElement).closest('[data-tiroir-fermer]')) fermer();
  });
  document.body.append(tiroir);
  return tiroir;
}

function ouvert(): boolean {
  return Boolean(tiroir?.hasAttribute('data-ouvert'));
}

function fermer() {
  if (!tiroir || !ouvert()) return;
  tiroir.removeAttribute('data-ouvert');
  tiroir.inert = true;
  tiroir.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  lienOuvert?.focus();
  lienOuvert = undefined;
}

function elementsFocusables(): HTMLElement[] {
  if (!tiroir) return [];
  return [...tiroir.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe')].filter((element) => element.tabIndex >= 0 && !element.closest('[hidden]'));
}

function ouvrir(lien: HTMLAnchorElement) {
  const panneau = leTiroir();
  const titre = panneau.querySelector('.tiroir__titre')!;
  const fermerBouton = panneau.querySelector<HTMLButtonElement>('.tiroir__fermer')!;
  const etat = panneau.querySelector<HTMLElement>('.tiroir__etat')!;
  const widget = panneau.querySelector<HTMLElement>('.tiroir__widget')!;
  titre.textContent = lien.dataset.titre ?? '';
  fermerBouton.setAttribute('aria-label', lien.dataset.fermer ?? '');
  panneau.querySelector('.tiroir__panneau')?.setAttribute('aria-label', lien.dataset.titre ?? '');
  etat.hidden = true;
  etat.replaceChildren();
  widget.replaceChildren();
  lienOuvert = lien;
  panneau.inert = false;
  panneau.removeAttribute('aria-hidden');
  document.documentElement.style.overflow = 'hidden';
  panneau.setAttribute('data-ouvert', '');
  fermerBouton.focus();

  void chargerCalendly()
    .then(() => {
      if (lienOuvert !== lien) return;
      window.Calendly!.initInlineWidget({ url: lien.href, parentElement: widget });
    })
    .catch(() => {
      if (lienOuvert !== lien) return;
      const suite = document.createElement('a');
      suite.href = lien.href;
      suite.target = '_blank';
      suite.rel = 'noopener';
      suite.textContent = lien.dataset.echec ?? lien.href;
      etat.replaceChildren(suite);
      etat.hidden = false;
    });
}

quandLeNavigateurEstLibre(preparer);

document.addEventListener('pointerover', (evenement) => {
  if ((evenement.target as HTMLElement).closest?.('a[data-rendez-vous="calendly"]')) preparer();
});

document.addEventListener('focusin', (evenement) => {
  if ((evenement.target as HTMLElement).closest('a[data-rendez-vous="calendly"]')) preparer();
});

document.addEventListener('click', (evenement) => {
  if (evenement.defaultPrevented || evenement.button !== 0 || evenement.metaKey || evenement.ctrlKey || evenement.shiftKey) return;
  const lien = (evenement.target as HTMLElement).closest<HTMLAnchorElement>('a[data-rendez-vous="calendly"]');
  if (!lien) return;
  evenement.preventDefault();
  ouvrir(lien);
});

document.addEventListener('keydown', (evenement) => {
  if (!ouvert()) return;
  if (evenement.key === 'Escape') {
    evenement.preventDefault();
    fermer();
    return;
  }
  if (evenement.key !== 'Tab') return;
  const focusables = elementsFocusables();
  const premier = focusables[0];
  const dernier = focusables.at(-1);
  if (!premier || !dernier) return;
  if (evenement.shiftKey && document.activeElement === premier) {
    evenement.preventDefault();
    dernier.focus();
  } else if (!evenement.shiftKey && document.activeElement === dernier) {
    evenement.preventDefault();
    premier.focus();
  }
});
