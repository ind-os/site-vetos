// Les photos du site. src/assets/images/catalogue.json décrit chaque fichier : son sujet, son
// texte alternatif dans les deux langues et le point à garder visible quand elle est recadrée.
// Les gabarits demandent une photo par sujet :
//   « accueil », « groupe », « espece:chien », « service:radiographie », « conseil:le-lapin »,
//   « clinique:payerne », et pour une clinique « payerne:accueil », « payerne:locaux »,
//   « payerne:equipe:Claire-Lise Tinguely », « payerne:espece:chat ».

import type { ImageMetadata } from 'astro';
import type { Langue } from '../config.ts';
import catalogue from '../assets/images/catalogue.json';

interface EntreeDuCatalogue {
  fichier: string;
  sujet: string;
  alt: Record<Langue, string>;
  /** Le point à garder visible, de 0 à 1 depuis le coin haut gauche. */
  point_focal?: { x: number; y: number };
  source?: string;
}

export interface Photo {
  src: ImageMetadata;
  alt: string;
  /** Le point focal en object-position : « 50% 40% ». */
  cadrage: string;
}

const fichiers = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpg,jpeg,png,webp}', { eager: true });
const parNom = new Map(Object.entries(fichiers).map(([chemin, module]) => [chemin.split('/').pop()!, module.default]));

/** Un nom sans accents ni majuscules, pour relier « equipe:Léo Munné » à « equipe:Leo Munne ». */
function normaliser(texte: string): string {
  return texte.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function cadrage(point?: { x: number; y: number }): string {
  if (!point) return 'center';
  const pourcent = (v: number) => `${Math.round(Math.min(1, Math.max(0, v)) * 1000) / 10}%`;
  return `${pourcent(point.x)} ${pourcent(point.y)}`;
}

function enPhoto(entree: EntreeDuCatalogue, langue: Langue): Photo {
  const src = parNom.get(entree.fichier);
  if (!src) throw new Error(`catalogue.json cite ${entree.fichier}, absent de src/assets/images/`);
  return { src, alt: entree.alt[langue] || entree.alt.fr, cadrage: cadrage(entree.point_focal) };
}

/** Les photos d'un sujet, dans l'ordre du catalogue. */
export function photos(sujet: string, langue: Langue): Photo[] {
  const cherche = normaliser(sujet);
  return (catalogue as EntreeDuCatalogue[]).filter((e) => normaliser(e.sujet) === cherche).map((e) => enPhoto(e, langue));
}

/** La photo d'un sujet, ou rien ; `rang` choisit parmi plusieurs photos du même sujet. */
export function photo(sujet: string, langue: Langue, rang = 0): Photo | undefined {
  const toutes = photos(sujet, langue);
  return toutes.length ? toutes[rang % toutes.length] : undefined;
}

/** La première photo trouvée parmi plusieurs sujets : photo d'une clinique, sinon du réseau. */
export function premierePhoto(sujets: string[], langue: Langue): Photo | undefined {
  for (const sujet of sujets) {
    const trouvee = photo(sujet, langue);
    if (trouvee) return trouvee;
  }
  return undefined;
}
