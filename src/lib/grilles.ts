// Les grilles des prix des cabinets, lues dans la collection « tarifs » (src/donnees/tarifs/,
// docs/grille-des-prix.md). Le calcul et le format des montants sont dans src/lib/prix.ts.

import { getCollection } from 'astro:content';
import { valeursDe, type Grille, type Valeur } from './prix.ts';

export interface GrilleDuCabinet {
  /** L'identifiant du cabinet, celui de sa fiche. */
  cabinet: string;
  grille: Grille;
  /** Le montant de chaque clé, calculs résolus. */
  valeurs: Map<string, Valeur>;
}

/** Les grilles de tous les cabinets qui en ont une. */
export async function lesGrilles(): Promise<GrilleDuCabinet[]> {
  return (await getCollection('tarifs')).map((entree) => {
    const grille = entree.data as Grille;
    return { cabinet: entree.id, grille, valeurs: valeursDe(grille) };
  });
}

/** La grille d'un cabinet, ou rien s'il n'en a pas encore. */
export async function laGrille(cabinet: string): Promise<GrilleDuCabinet | undefined> {
  return (await lesGrilles()).find((g) => g.cabinet === cabinet);
}
