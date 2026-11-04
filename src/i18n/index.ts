// Les textes de l'interface dans la langue de la page.
//
//   const t = textes(langue);
//   t.rendezVous.bouton                 // « Prendre rendez-vous » ou « Termin vereinbaren »
//   t.horaires.ouvertJusqua('12 h')     // un texte avec une valeur

import { LANGUES, type Langue } from '../config.ts';
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

/** Les clés d'un catalogue, en profondeur : « horaires.jours.lundi ». */
function clesDe(catalogue: object, prefixe = ''): string[] {
  return Object.entries(catalogue).flatMap(([cle, valeur]) =>
    typeof valeur === 'object' && valeur !== null ? clesDe(valeur, `${prefixe}${cle}.`) : [`${prefixe}${cle}`],
  );
}

/** Les clés présentes dans le catalogue d'une langue et absentes de celui d'une autre. */
export function problemesDesTextes(): string[] {
  const cles = new Map(LANGUES.map((langue) => [langue, new Set(clesDe(CATALOGUES[langue]))]));
  return LANGUES.flatMap((langue) =>
    LANGUES.filter((autre) => autre !== langue).flatMap((autre) =>
      [...cles.get(langue)!]
        .filter((cle) => !cles.get(autre)!.has(cle))
        .map((cle) => `src/i18n/${autre}.ts : la clé ${cle} manque, elle est dans src/i18n/${langue}.ts.`),
    ),
  );
}
