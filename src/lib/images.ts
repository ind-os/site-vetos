// Les photos du site. src/assets/images/catalogue.json décrit chaque fichier : son sujet, son
// texte alternatif dans les deux langues et le point à garder visible quand elle est recadrée.
// Les gabarits demandent une photo par sujet :
//   - pour tout le réseau : « accueil », « service:radiographie », « conseil:le-lapin », et
//     « espece:chien », la photo d'un conseil qui n'a pas la sienne ;
//   - pour une clinique : « payerne:accueil », « payerne:locaux »,
//     « payerne:equipe:Claire-Lise Tinguely », « payerne:service:radiographie ».
// La construction vérifie qu'un sujet de clinique nomme une clinique et une personne qui existent.

import type { ImageMetadata } from 'astro';
import type { Langue } from '../config.ts';
import catalogue from '../assets/images/catalogue.json';
import type { Clinique } from './cliniques.ts';

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

/** Les sujets de tout le réseau ; un autre sujet commence par l'identifiant d'une clinique. */
const SUJETS_DU_RESEAU = ['accueil', 'espece', 'service', 'conseil'];

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

/** Les sujets du catalogue qui nomment une clinique ou une personne absente des fiches. */
export function problemesDuCatalogue(cliniques: Clinique[]): string[] {
  return (catalogue as EntreeDuCatalogue[]).flatMap(({ sujet }) => {
    const [premier, quoi, nom = ''] = sujet.split(':');
    if (SUJETS_DU_RESEAU.includes(premier)) return [];
    const clinique = cliniques.find((c) => c.id === premier);
    if (!clinique) {
      return [`src/assets/images/catalogue.json : le sujet « ${sujet} » commence par « ${premier} », qui n'est ni une clinique (src/donnees/cliniques/) ni un sujet du réseau (${SUJETS_DU_RESEAU.join(', ')}).`];
    }
    if (quoi === 'equipe' && !clinique.equipe.some((m) => normaliser(m.nom) === normaliser(nom))) {
      return [`src/assets/images/catalogue.json : le sujet « ${sujet} » nomme « ${nom} », absent de l'équipe de src/donnees/cliniques/${clinique.id}.json.`];
    }
    return [];
  });
}
