// Les fiches des cliniques, lues dans la collection « cliniques » (src/donnees/cliniques/).
// Une fiche porte les faits stables d'une clinique et, pour l'instant, ses données qui changent
// souvent (horaires, fermetures, bandeau) : docs/fiche-clinique.md.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Langue } from '../config.ts';
import { adresse } from './pages.ts';

export type Clinique = CollectionEntry<'cliniques'>['data'];

/** Les huit cliniques, dans l'ordre alphabétique de leur lieu. */
export async function lesCliniques(): Promise<Clinique[]> {
  return (await getCollection('cliniques')).map((c) => c.data).sort((a, b) => a.lieu.localeCompare(b.lieu, 'fr'));
}

/** La fiche d'une clinique. */
export async function laClinique(id: string): Promise<Clinique> {
  const fiche = (await lesCliniques()).find((c) => c.id === id);
  if (!fiche) throw new Error(`Aucune fiche pour la clinique « ${id} » : le fichier src/donnees/cliniques/${id}.json manque.`);
  return fiche;
}

/** Les cliniques dont les pages sont en ligne sur ce site. */
export async function lesCliniquesEnLigne(): Promise<Clinique[]> {
  return (await lesCliniques()).filter((c) => c.en_ligne);
}

/**
 * Le lien vers une page d'une clinique : sa page sur ce site si elle est en ligne, sinon son
 * site actuel. `page` est la clé dans le dossier de la clinique : « index », « contact »,
 * « services/radiographie ».
 */
export async function lienDeLaClinique(clinique: Clinique, langue: Langue, page = 'index'): Promise<string> {
  if (!clinique.en_ligne) return clinique.site_actuel;
  return adresse(langue, `${clinique.id}/${page}`);
}

/** L'adresse postale sur une ligne : « Route du Châtelard 13, 1530 Payerne ». */
export function adressePostale(clinique: Clinique): string {
  return `${clinique.adresse.rue}, ${clinique.adresse.npa} ${clinique.adresse.localite}`;
}

/** Les liens d'itinéraire, par l'adresse, sans carte intégrée. */
export function liensDItineraire(clinique: Clinique): { google: string; osm: string } {
  const requete = encodeURIComponent(`${clinique.nom}, ${adressePostale(clinique)}`);
  const { lat, lng } = clinique.coordonnees;
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${requete}`,
    osm: `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}#map=16/${lat}/${lng}`,
  };
}

/**
 * Les liens d'un texte vers une clinique qui n'est pas encore en ligne mènent à son site actuel.
 * Le texte garde l'adresse définitive (/bussigny/rendez-vous/) : le lien se rétablit seul le jour
 * où la clinique passe en ligne.
 */
export function pointerVersLesSitesActuels(html: string, cliniques: Clinique[]): string {
  return html.replace(/href="\/(?:de\/)?([a-z]+)\/[^"]*"/g, (lien, id: string) => {
    const clinique = cliniques.find((c) => c.id === id);
    return clinique && !clinique.en_ligne ? `href="${clinique.site_actuel}"` : lien;
  });
}
