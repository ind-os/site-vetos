// Les campagnes du réseau (src/donnees/campagnes/, docs/campagnes.md) : une offre limitée dans
// le temps, montrée par l'encart de campagne sur l'accueil du site et sur l'accueil des cabinets.
// Une campagne s'affiche si elle est active et que le jour est entre `du` et `jusqu_au`. Le site
// se reconstruit chaque nuit : l'encart apparaît et disparaît seul.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Langue } from '../config.ts';
import type { Clinique } from './cliniques.ts';
import { instantAZurich } from './horaires.ts';
import { photo, type Photo } from './images.ts';
import { adresse } from './pages.ts';

export type Campagne = CollectionEntry<'campagnes'>['data'];

/** Vrai si la campagne s'affiche ce jour-là, sur l'accueil d'un cabinet ou sur celui du site. */
export function estEnCours(campagne: Campagne, clinique?: Clinique, aujourdhui = instantAZurich().date): boolean {
  if (!campagne.active) return false;
  if (campagne.du && campagne.du > aujourdhui) return false;
  if (campagne.jusqu_au < aujourdhui) return false;
  if (!clinique) return campagne.accueil_du_site;
  return !campagne.cabinets || campagne.cabinets.includes(clinique.id);
}

/** La campagne en cours, celle qui finit le plus tôt s'il y en a plusieurs. */
export async function campagneDuJour(clinique?: Clinique): Promise<Campagne | undefined> {
  const enCours = (await getCollection('campagnes')).map((c) => c.data).filter((c) => estEnCours(c, clinique));
  return enCours.sort((a, b) => a.jusqu_au.localeCompare(b.jusqu_au))[0];
}

/**
 * L'adresse où mène le bouton. « contact » : la page Contact du cabinet, ou la liste des cabinets
 * sur l'accueil du site. « service » : la page du service dans le cabinet s'il le propose, sinon
 * sa page commune.
 */
export async function lienDeLaCampagne(campagne: Campagne, langue: Langue, clinique?: Clinique): Promise<string | undefined> {
  if (campagne.bouton === 'service' && campagne.service) {
    if (clinique?.services.includes(campagne.service)) return adresse(langue, `${clinique.id}/services/${campagne.service}`);
    return adresse(langue, `services/${campagne.service}`);
  }
  return clinique ? adresse(langue, `${clinique.id}/contact`) : adresse(langue, 'cliniques');
}

/** La photo de l'encart : la même sur l'accueil du site et dans chaque cabinet. */
export function photoDeLaCampagne(campagne: Campagne, langue: Langue): Photo | undefined {
  return campagne.photo ? photo(campagne.photo, langue) : undefined;
}
