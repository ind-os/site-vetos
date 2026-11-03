// Les textes de l'interface dans la langue de la page.
//
//   const t = textes(langue);
//   t.rendezVous.bouton                 // « Prendre rendez-vous » ou « Termin vereinbaren »
//   t.horaires.ouvertJusqua('12 h')     // un texte avec une valeur

import type { Langue } from '../config.ts';
import { fr } from './fr.ts';
import { de } from './de.ts';

/** La forme du catalogue : les mêmes clés que fr.ts, chaque texte ou fonction de texte à traduire. */
type Forme<T> = {
  [Cle in keyof T]: T[Cle] extends string
    ? string
    : T[Cle] extends (...valeurs: infer Valeurs) => string
      ? (...valeurs: Valeurs) => string
      : Forme<T[Cle]>;
};

export type Catalogue = Forme<typeof fr>;

const CATALOGUES: Record<Langue, Catalogue> = { fr, de };

/** Les textes de l'interface dans une langue. */
export function textes(langue: Langue): Catalogue {
  return CATALOGUES[langue];
}
