// Remplit les éléments [data-statut-ouverture] : « Ouvert maintenant, jusqu'à 12 h » ou
// « Fermé, ouvre à 14 h », calculé dans le navigateur à l'heure de Zurich, puis chaque minute.
// L'élément porte ses horaires en JSON (data-horaires, data-fermetures) et sa langue.

import type { Langue } from '../config.ts';
import { statutOuverture, type Fermeture, type Horaires } from '../lib/horaires.ts';

function lire<T>(texte: string | undefined, defaut: T): T {
  try {
    return texte ? (JSON.parse(texte) as T) : defaut;
  } catch {
    return defaut;
  }
}

function afficher(element: HTMLElement): void {
  const statut = statutOuverture(
    lire<Horaires>(element.dataset.horaires, {} as Horaires),
    lire<Fermeture[]>(element.dataset.fermetures, []),
    (element.dataset.langue as Langue) ?? 'fr',
  );
  const texte = element.querySelector<HTMLElement>('[data-statut-texte]') ?? element;
  texte.textContent = statut.texte;
  element.dataset.ouvert = String(statut.ouvert);
  element.hidden = false;
}

const tous = () => document.querySelectorAll<HTMLElement>('[data-statut-ouverture]');
tous().forEach(afficher);
window.setInterval(() => tous().forEach(afficher), 60_000);
