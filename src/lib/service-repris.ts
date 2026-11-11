// Le texte d'un service repris de la page commune sur la page d'une clinique
// (pagesDeServiceReprises, src/lib/pages.ts), adapté à la clinique :
// - les liens vers la liste des cabinets mènent au rendez-vous de la clinique ;
// - les liens vers un service que la clinique pratique mènent à sa page dans la clinique ;
// - la section qui liste les cabinets du réseau (« Les cabinets qui radiographient ») tombe.
// Le reste du texte est celui de la page commune, mot pour mot.

import type { Langue } from '../config.ts';
import { lesCliniques, servicesDeLaClinique, type Clinique } from './cliniques.ts';
import { adresse, laPage } from './pages.ts';

const SECTION = /(?=<h2[\s>])/;

export async function texteRepris(html: string, clinique: Clinique, langue: Langue): Promise<string> {
  const cabinets = await adresse(langue, 'cliniques');
  const rendezVous = await adresse(langue, `${clinique.id}/rendez-vous`);
  const versLaClinique = new Map<string, string>();
  for (const s of await servicesDeLaClinique(clinique, langue)) {
    const commune = await laPage(langue, `services/${s.service}`);
    if (commune) versLaClinique.set(commune.data.url, s.href);
  }
  // Les adresses des cliniques, « /payerne/ », « /de/payerne/ » ou leur site actuel tant qu'elles ne
  // sont pas en ligne : une section qui mène à deux cliniques ou plus est la liste des cabinets du réseau.
  const cliniques = await lesCliniques();
  const cliniqueDe = (href: string) =>
    cliniques.find((c) => new RegExp(`^(?:/[a-z]{2})?/${c.id}/`).test(href) || href.startsWith(c.adresse_hors_ligne))?.id;
  const cliniquesCitees = (section: string) =>
    new Set([...section.matchAll(/href="([^"]*)"/g)].map((m) => cliniqueDe(m[1])).filter(Boolean)).size;

  return html
    .split(SECTION)
    .filter((section) => !section.startsWith('<h2') || cliniquesCitees(section) < 2)
    .join('')
    .replace(/href="([^"#]*)(#[^"]*)?"/g, (lien, chemin: string, ancre = '') => {
      if (chemin === cabinets) return `href="${rendezVous}"`;
      const ici = versLaClinique.get(chemin);
      return ici ? `href="${ici}${ancre}"` : lien;
    });
}
