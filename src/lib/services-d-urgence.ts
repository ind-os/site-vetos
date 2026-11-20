// Les services d'urgence de Vetmint, à un seul endroit : la page Urgences du réseau, le pied de page
// et le styleguide les lisent ici. Les numéros viennent des fiches : le numéro de garde de Fribourg,
// et le second service de garde (« garde.autre ») de Saint-Blaise.
import type { Langue } from '../config.ts';
import { laClinique } from './cliniques.ts';
import { photo, type Photo } from './images.ts';

export interface ServiceDUrgence {
  nom: string;
  telephone: { affiche: string; international: string };
  site: string;
  logo?: Photo;
}

export async function nosServicesDUrgence(langue: Langue): Promise<ServiceDUrgence[]> {
  const fribourg = await laClinique('fribourg');
  const saintblaise = await laClinique('saintblaise');
  return [
    { nom: "Vet'Urgences Fribourg", telephone: fribourg.garde.telephone, site: 'https://vet-urgence-fribourg.ch/', logo: photo('fribourg:vet-urgence-logo', langue) },
    ...(saintblaise.garde.autre
      ? [{ nom: saintblaise.garde.autre.nom, telephone: saintblaise.garde.autre.telephone, site: 'https://vet-urgence-neuchatel.ch/', logo: photo('saintblaise:vet-urgence-logo', langue) }]
      : []),
  ];
}
