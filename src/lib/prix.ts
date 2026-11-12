// Les prix d'un cabinet, lus dans sa grille (src/donnees/tarifs/<cabinet>.json,
// docs/grille-des-prix.md). Un texte écrit le jeton {prix:<cle>} ; le site affiche le montant au
// format de la langue, dans une phrase ou dans un tableau.
// Fonctions pures, sans Astro : la construction du site et outils/verifier-les-pages.mjs les
// partagent.

import type { Langue } from '../config.ts';

/** Un montant tel que la grille l'écrit : un nombre, une fourchette ou un calcul sur d'autres clés. */
export type Montant = number | { min: number; max: number } | string;

export interface Prix {
  cle: string;
  /** Le nom de la page commune du service : le prix s'affiche sur la page de ce service dans le cabinet. */
  service?: string;
  libelle: { fr: string; de: string };
  montant: Montant;
}

export interface Grille {
  valable_des: string;
  prix: Prix[];
}

/** Un montant calculé : un nombre ou une fourchette. */
export type Valeur = number | { min: number; max: number };

/** Le jeton d'un prix dans un texte : {prix:consultation}. */
export const MOTIF_DU_JETON = /\{prix:([a-z0-9-]+)\}/g;

/** Les clés des jetons d'un texte, dans l'ordre. */
export function clesDesJetons(texte: string): string[] {
  return [...texte.matchAll(MOTIF_DU_JETON)].map((m) => m[1]);
}

/**
 * Le montant de chaque clé de la grille, calculs résolus. Un calcul s'écrit avec des clés, des
 * nombres et les opérateurs + - * /, séparés par des espaces : « consultation + supplement ».
 * Une clé en double, une clé inconnue, une boucle ou une fourchette dans un calcul arrêtent tout.
 */
export function valeursDe(grille: Grille): Map<string, Valeur> {
  const parCle = new Map<string, Prix>();
  for (const prix of grille.prix) {
    if (parCle.has(prix.cle)) throw new Error(`la clé « ${prix.cle} » figure deux fois`);
    parCle.set(prix.cle, prix);
  }
  const valeurs = new Map<string, Valeur>();
  const enCours = new Set<string>();

  function valeur(cle: string): Valeur {
    const deja = valeurs.get(cle);
    if (deja !== undefined) return deja;
    const prix = parCle.get(cle);
    if (!prix) throw new Error(`la clé « ${cle} » n'existe pas`);
    if (enCours.has(cle)) throw new Error(`le calcul de « ${cle} » tourne en boucle`);
    enCours.add(cle);
    const resultat = typeof prix.montant === 'string' ? calculer(prix.montant, cle, nombreDe) : prix.montant;
    enCours.delete(cle);
    valeurs.set(cle, resultat);
    return resultat;
  }

  function nombreDe(cle: string, dans: string): number {
    const v = valeur(cle);
    if (typeof v !== 'number') throw new Error(`le calcul de « ${dans} » utilise « ${cle} », une fourchette`);
    return v;
  }

  for (const prix of grille.prix) valeur(prix.cle);
  return valeurs;
}

/** Le résultat d'un calcul, arrondi au centime : la multiplication et la division d'abord. */
function calculer(calcul: string, cle: string, nombreDe: (cle: string, dans: string) => number): number {
  const morceaux = calcul.trim().split(/\s+/);
  if (morceaux.length % 2 === 0) throw new Error(`le calcul de « ${cle} » est incomplet : « ${calcul} »`);
  const operande = (morceau: string) => (/^\d+(\.\d+)?$/.test(morceau) ? Number(morceau) : nombreDe(morceau, cle));
  const termes = [operande(morceaux[0])];
  const signes: string[] = [];
  for (let i = 1; i < morceaux.length; i += 2) {
    const [operateur, suivant] = [morceaux[i], operande(morceaux[i + 1])];
    if (operateur === '*') termes[termes.length - 1] *= suivant;
    else if (operateur === '/') termes[termes.length - 1] /= suivant;
    else if (operateur === '+' || operateur === '-') {
      signes.push(operateur);
      termes.push(suivant);
    } else throw new Error(`le calcul de « ${cle} » contient « ${operateur} » : les opérateurs sont + - * /, entourés d'espaces`);
  }
  const total = termes.reduce((somme, terme, i) => (i === 0 ? terme : signes[i - 1] === '+' ? somme + terme : somme - terme));
  return Math.round(total * 100) / 100;
}

/** Un nombre écrit à la façon de la langue : « 1 240 », « 128,75 » ; « 1’240 », « 128.75 ». */
function chiffres(nombre: number, langue: Langue): string {
  const [entier, centimes] = (Number.isInteger(nombre) ? String(nombre) : nombre.toFixed(2)).split('.');
  const groupes = entier.replace(/\B(?=(\d{3})+(?!\d))/g, langue === 'de' ? '’' : ' ');
  return centimes ? `${groupes}${langue === 'de' ? '.' : ','}${centimes}` : groupes;
}

/**
 * Un montant tel qu'il s'affiche : en français « 57 francs » dans une phrase, « 57 CHF » dans un
 * tableau ; en allemand « 57 Franken » dans une phrase, « CHF 57.– » dans un tableau.
 */
export function formaterMontant(valeur: Valeur, langue: Langue, forme: 'phrase' | 'tableau'): string {
  const nombre = (n: number) => chiffres(n, langue);
  if (langue === 'de') {
    if (forme === 'tableau') {
      if (typeof valeur !== 'number') return `CHF ${nombre(valeur.min)}–${nombre(valeur.max)}`;
      return Number.isInteger(valeur) ? `CHF ${nombre(valeur)}.–` : `CHF ${nombre(valeur)}`;
    }
    return typeof valeur === 'number' ? `${nombre(valeur)} Franken` : `${nombre(valeur.min)} bis ${nombre(valeur.max)} Franken`;
  }
  const unite = forme === 'tableau' ? 'CHF' : 'francs';
  return typeof valeur === 'number' ? `${nombre(valeur)} ${unite}` : `${nombre(valeur.min)} à ${nombre(valeur.max)} ${unite}`;
}

/** Remplace les jetons d'un texte par leur montant ; un jeton inconnu reste tel quel. */
function remplacerDansLeTexte(texte: string, valeurs: Map<string, Valeur>, langue: Langue, forme: 'phrase' | 'tableau'): string {
  return texte.replace(MOTIF_DU_JETON, (jeton, cle: string) => {
    const valeur = valeurs.get(cle);
    return valeur === undefined ? jeton : formaterMontant(valeur, langue, forme);
  });
}

/** Remplace les jetons d'un texte simple (une description, un résumé) : la forme d'une phrase. */
export function remplacerLesPrix(texte: string, valeurs: Map<string, Valeur>, langue: Langue): string {
  return remplacerDansLeTexte(texte, valeurs, langue, 'phrase');
}

/** Remplace les jetons d'un HTML : la forme d'un tableau dans une cellule, celle d'une phrase ailleurs. */
export function remplacerLesPrixDuHtml(html: string, valeurs: Map<string, Valeur>, langue: Langue): string {
  const cellules = html.replace(/<(t[dh])(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (_cellule, balise: string, attributs = '', contenu: string) =>
    `<${balise}${attributs}>${remplacerDansLeTexte(contenu, valeurs, langue, 'tableau')}</${balise}>`,
  );
  return remplacerDansLeTexte(cellules, valeurs, langue, 'phrase');
}
