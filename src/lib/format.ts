// Les nombres, les heures et les dates tels qu'ils s'écrivent sur le site, dans chaque langue.
// Fonctions pures, utilisées à la construction et dans le navigateur.

import type { Langue } from '../config.ts';

/**
 * Une heure « 08:00 » telle qu'elle s'écrit dans une phrase :
 * en français « 8 h », « 13 h 45 » ; en allemand « 8 », « 13.45 » (suivi de « Uhr »).
 */
export function formaterHeure(heure: string, langue: Langue): string {
  const [h, m] = heure.split(':').map(Number);
  if (langue === 'de') return m === 0 ? String(h) : `${h}.${String(m).padStart(2, '0')}`;
  return m === 0 ? `${h}\u00a0h` : `${h}\u00a0h\u00a0${String(m).padStart(2, '0')}`;
}

/** Une plage « 08:00-12:00 » : « 8 h à 12 h », « 8–12 Uhr ». */
export function formaterPlage(plage: string, langue: Langue): string {
  const [debut, fin] = plage.split('-');
  if (langue === 'de') return `${formaterHeure(debut, langue)}–${formaterHeure(fin, langue)}\u00a0Uhr`;
  return `${formaterHeure(debut, langue)} à ${formaterHeure(fin, langue)}`;
}

const MOIS: Record<Langue, string[]> = {
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
};

/** Une date AAAA-MM-JJ : « 24 décembre 2026 », « 24. Dezember 2026 » ; sans l'année si `annee` est faux. */
export function formaterDate(date: string, langue: Langue, annee = true): string {
  const [a, m, j] = date.split('-').map(Number);
  const jour = langue === 'de' ? `${j}.` : j === 1 ? '1er' : String(j);
  return `${jour}\u00a0${MOIS[langue][m - 1]}${annee ? ` ${a}` : ''}`;
}

/** Le lien d'appel d'un numéro international : « tel:+41266601616 ». */
export function lienTelephone(international: string): string {
  return `tel:${international}`;
}

/** Le lien WhatsApp d'un numéro international : « https://wa.me/41266601616 ». */
export function lienWhatsapp(international: string): string {
  return `https://wa.me/${international.replace(/^\+/, '')}`;
}

/** Échappe un texte pour l'écrire dans du HTML. */
export function echapper(texte: string): string {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Les initiales d'un nom : « Claire-Lise Tinguely » donne « CT ». */
export function initiales(nom: string): string {
  const mots = nom.split(/\s+/).filter(Boolean);
  return `${mots[0]?.[0] ?? ''}${mots.length > 1 ? mots.at(-1)![0] : ''}`.toUpperCase();
}

/** Une liste lisible : « chiens, chats et lapins », « Hunde, Katzen und Kaninchen ». */
export function enumerer(elements: string[], langue: Langue): string {
  if (elements.length < 2) return elements[0] ?? '';
  return `${elements.slice(0, -1).join(', ')} ${langue === 'de' ? 'und' : 'et'} ${elements.at(-1)}`;
}
