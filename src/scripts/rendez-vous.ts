// Le bouton « Prendre rendez-vous » ouvre le module de réservation de la clinique (Calendly) dans
// une fenêtre par-dessus la page. Le module n'est chargé qu'au premier clic : la page reste
// légère. Sans JavaScript, ou si Calendly ne répond pas, le lien ouvre l'agenda dans un onglet.

export {};

declare global {
  interface Window {
    Calendly?: { initPopupWidget(options: { url: string }): void };
  }
}

const SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
const STYLE = 'https://assets.calendly.com/assets/external/widget.css';

let chargement: Promise<void> | undefined;

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
    script.onerror = () => rejeter(new Error('Calendly ne répond pas'));
    document.head.append(script);
  });
  return chargement;
}

document.addEventListener('click', async (evenement) => {
  if (evenement.defaultPrevented || evenement.button !== 0 || evenement.metaKey || evenement.ctrlKey || evenement.shiftKey) return;
  const lien = (evenement.target as HTMLElement).closest<HTMLAnchorElement>('a[data-rendez-vous="calendly"]');
  if (!lien) return;
  evenement.preventDefault();
  lien.setAttribute('aria-busy', 'true');
  try {
    await chargerCalendly();
    window.Calendly!.initPopupWidget({ url: lien.href });
  } catch {
    window.open(lien.href, '_blank', 'noopener');
  } finally {
    lien.removeAttribute('aria-busy');
  }
});
