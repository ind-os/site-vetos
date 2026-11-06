// Le bouton « Prendre rendez-vous » ouvre l'agenda Calendly dans un panneau pleine hauteur,
// à droite. Le code de Calendly, et ses cookies, n'arrivent que quand le visiteur approche le
// bouton (survol, focus clavier, toucher). Sans JavaScript, ou si Calendly ne répond pas, le
// lien ouvre l'agenda dans un onglet. VetLink n'est pas concerné. Pendant le chargement, le panneau
// affiche « Ouverture de l'agenda… », jusqu'à ce que l'agenda de Calendly soit affiché.

export {};

declare global {
  interface Window {
    Calendly?: { initInlineWidget(options: { url: string; parentElement: HTMLElement }): void };
  }
}

const SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
const STYLE = 'https://assets.calendly.com/assets/external/widget.css';
const ORIGINE_CALENDLY = /^https:\/\/([a-z0-9-]+\.)?calendly\.com$/;
/** Au-delà, le message d'attente s'efface, même si l'agenda n'a rien dit. */
const ATTENTE_MAX = 10_000;

let chargement: Promise<void> | undefined;
let tiroir: HTMLElement | undefined;
let lienOuvert: HTMLAnchorElement | undefined;
let minuterieAttente: number | undefined;

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
        <div class="tiroir__attente" role="status" hidden>
          <span class="tiroir__points" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="tiroir__attente-texte"></span>
        </div>
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

/** Retire le message d'attente du panneau. */
function finirAttente() {
  window.clearTimeout(minuterieAttente);
  minuterieAttente = undefined;
  const attente = tiroir?.querySelector<HTMLElement>('.tiroir__attente');
  if (attente) attente.hidden = true;
}

function ouvert(): boolean {
  return Boolean(tiroir?.hasAttribute('data-ouvert'));
}

function fermer() {
  if (!tiroir || !ouvert()) return;
  finirAttente();
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
  const attente = panneau.querySelector<HTMLElement>('.tiroir__attente')!;
  attente.querySelector('.tiroir__attente-texte')!.textContent = lien.dataset.chargement ?? '';
  attente.hidden = false;
  window.clearTimeout(minuterieAttente);
  minuterieAttente = window.setTimeout(finirAttente, ATTENTE_MAX);
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
      finirAttente();
      const suite = document.createElement('a');
      suite.href = lien.href;
      suite.target = '_blank';
      suite.rel = 'noopener';
      suite.textContent = lien.dataset.echec ?? lien.href;
      etat.replaceChildren(suite);
      etat.hidden = false;
    });
}

// L'agenda de Calendly prévient la page quand il affiche un type de rendez-vous ou la page de
// la clinique.
window.addEventListener('message', (evenement) => {
  if (!ORIGINE_CALENDLY.test(evenement.origin)) return;
  const nom = (evenement.data as { event?: unknown } | null)?.event;
  if (nom === 'calendly.event_type_viewed' || nom === 'calendly.profile_page_viewed') finirAttente();
});

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
