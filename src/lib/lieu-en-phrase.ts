// Le lieu d'une clinique dans une phrase fabriquée par le site : « Radiographie à Payerne »,
// « Accueil du cabinet de Payerne ». Un nom qui porte son article se dit autrement
// (« au Lac-de-Joux », « du Lac-de-Joux ») : la fiche le donne dans `lieu_en_phrase`.

import type { Langue } from '../config.ts';
import { textes } from '../i18n/index.ts';
import type { Clinique } from './cliniques.ts';

export interface LieuEnPhrase {
  /** « à Payerne », « au Lac-de-Joux » ; en allemand « in Payerne », « am Lac-de-Joux ». */
  a: string;
  /** « de Payerne », « du Lac-de-Joux » ; en allemand le lieu seul. */
  de: string;
}

/** Le lieu d'une clinique dans une phrase : la tournure de sa fiche, sinon la tournure courante de la langue. */
export function lieuEnPhrase(clinique: Clinique, langue: Langue): LieuEnPhrase {
  const t = textes(langue).site;
  const fiche = clinique.lieu_en_phrase?.[langue];
  return { a: fiche?.a ?? t.aLieu(clinique.lieu), de: fiche?.de ?? t.deLieu(clinique.lieu) };
}
