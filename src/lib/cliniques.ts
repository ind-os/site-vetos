// Les fiches des cliniques, lues dans la collection « cliniques » (src/donnees/cliniques/).
// Une fiche porte les faits stables d'une clinique et ses données qui changent souvent
// (horaires, fermetures, bandeau) : docs/fiche-clinique.md.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Langue } from '../config.ts';
import { adresse, laPage, titreDe } from './pages.ts';

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

/**
 * Le lien vers une page d'une clinique : sa page sur ce site si elle est en ligne, sinon
 * le champ `adresse_hors_ligne` de sa fiche. `page` est la clé dans le dossier de la clinique : « index », « contact »,
 * « services/radiographie ».
 */
export async function lienDeLaClinique(clinique: Clinique, langue: Langue, page = 'index'): Promise<string> {
  if (!clinique.en_ligne) return clinique.adresse_hors_ligne;
  return adresse(langue, `${clinique.id}/${page}`);
}

/** L'adresse postale sur une ligne : « Route du Châtelard 13, 1530 Payerne ». */
export function adressePostale(clinique: Clinique): string {
  return `${clinique.adresse.rue}, ${clinique.adresse.npa} ${clinique.adresse.localite}`;
}

/** Les liens d'itinéraire, sans carte intégrée : Google Maps par le nom et l'adresse, OpenStreetMap par les coordonnées. */
export function liensDItineraire(clinique: Clinique): { google: string; osm: string } {
  const requete = encodeURIComponent(`${clinique.nom}, ${adressePostale(clinique)}`);
  const { lat, lng } = clinique.coordonnees;
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${requete}`,
    osm: `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}#map=16/${lat}/${lng}`,
  };
}

/** Un service de la clinique : son libellé, son résumé et l'adresse de sa page dans la clinique. */
export interface ServiceDeLaClinique {
  /** Le nom du fichier de la page commune : « radiographie ». */
  service: string;
  libelle: string;
  resume?: string;
  href: string;
}

/**
 * Les services de la fiche d'une clinique, dans son ordre. Le libellé est le nom court de la
 * page commune (« Radiographie »), sinon le titre de la page. Chaque service a sa page dans la
 * clinique ; s'il en manque une, la construction s'arrête. En prévisualisation, le lien mène à la
 * page commune et le terminal le signale, pour que la page en cours d'écriture reste visible.
 */
export async function servicesDeLaClinique(clinique: Clinique, langue: Langue): Promise<ServiceDeLaClinique[]> {
  const services = await Promise.all(
    clinique.services.map(async (service) => {
      const commune = await laPage(langue, `services/${service}`);
      const ici = await laPage(langue, `${clinique.id}/services/${service}`);
      if (!ici) {
        const message = `La clinique ${clinique.id} cite le service « ${service} » : src/content/pages/${langue}/${clinique.id}/services/${service}.md manque.`;
        if (!import.meta.env.DEV) throw new Error(message);
        console.warn(`${message} Le lien mène à la page commune.`);
      }
      const page = ici ?? commune;
      if (!page) return undefined;
      return { service, libelle: commune?.data.nom ?? titreDe(page), resume: ici?.data.resume ?? commune?.data.resume, href: page.data.url };
    }),
  );
  return services.filter((s) => s !== undefined);
}

/**
 * Les liens d'un texte vers une clinique qui n'est pas encore en ligne mènent à l'adresse
 * `adresse_hors_ligne` de sa fiche.
 * Le texte garde l'adresse définitive (/bussigny/rendez-vous/) : le lien se rétablit seul le jour
 * où la clinique passe en ligne.
 */
export function pointerVersLesSitesActuels(html: string, cliniques: Clinique[]): string {
  return html.replace(/href="\/(?:de\/)?([a-z]+)\/[^"]*"/g, (lien, id: string) => {
    const clinique = cliniques.find((c) => c.id === id);
    return clinique && !clinique.en_ligne ? `href="${clinique.adresse_hors_ligne}"` : lien;
  });
}
