// L'explication d'un soin sur sa page dans un cabinet (gabarit ServiceClinique) : le premier
// paragraphe de la page commune du service, puis le reste de son texte, déplié au clic. Ce reste
// est un fichier à part, /textes-des-soins/<langue>/<service>.html
// (src/pages/textes-des-soins/[langue]/[service].html.ts) : la page du cabinet ne le contient pas,
// elle reste propre au cabinet pour les moteurs de recherche.

import type { Langue } from '../config.ts';
import { pointerVersLesSitesActuels, type Clinique } from './cliniques.ts';
import { sections } from './html.ts';

/** Un paragraphe qui ne contient qu'un bouton : l'appel à l'action du chapeau. */
const PARAGRAPHE_BOUTON = /^<p(?:\s[^>]*)?>\s*<a [^>]*class="[^"]*\bbouton\b[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/p>$/;

/** Les paragraphes et autres blocs de l'introduction d'un texte, avant son premier titre ##. */
function blocsDeLIntroduction(introduction: string): string[] {
  return introduction.split(/(?<=<\/(?:p|ul|ol|div|blockquote)>)\s*/).map((bloc) => bloc.trim()).filter(Boolean);
}

/** Le premier paragraphe d'un texte, sans le bouton qui le suit : le chapeau de la page commune. */
export function premierParagraphe(html: string): string {
  return blocsDeLIntroduction(sections(html, 2).introduction).find((bloc) => bloc.startsWith('<p') && !PARAGRAPHE_BOUTON.test(bloc)) ?? '';
}

/**
 * Le texte d'une page commune de service, sans ce qui vit déjà sur la page du cabinet : le
 * chapeau et son bouton, les sections ## qui commencent par un lien vers la liste des cabinets ou
 * vers plusieurs cabinets (le prix général, les cabinets qui pratiquent le soin, prendre
 * rendez-vous), et les sous-sections ### qui mènent à plusieurs cabinets. Les titres descendent
 * d'un niveau : le texte se range sous « Le soin en bref ».
 */
export function texteComplet(html: string, adresseDesCabinets: string, cliniques: Clinique[]): string {
  const { introduction, sections: parties } = sections(html, 2);
  const chapeau = premierParagraphe(html);
  const debut = blocsDeLIntroduction(introduction).filter((bloc) => bloc !== chapeau && !PARAGRAPHE_BOUTON.test(bloc));
  const cabinetDe = (href: string) => cliniques.find((c) => new RegExp(`^(?:/[a-z]{2})?/${c.id}/`).test(href))?.id;
  const menePlusieursCabinets = (texte: string) => new Set([...texte.matchAll(/href="([^"]*)"/g)].map((m) => cabinetDe(m[1])).filter(Boolean)).size >= 2;
  const meneALaListe = (texte: string) => texte.includes(`href="${adresseDesCabinets}"`) || texte.includes(`href="${adresseDesCabinets}#`);
  const gardees = parties
    .map((partie) => ({ partie, sousSections: sections(partie.contenu, 3) }))
    .filter(({ sousSections }) => !meneALaListe(sousSections.introduction) && !menePlusieursCabinets(sousSections.introduction))
    .map(({ partie, sousSections }) => {
      const sousGardees = sousSections.sections.filter((s) => !menePlusieursCabinets(s.contenu));
      return partie.entete + sousSections.introduction + sousGardees.map((s) => s.entete + s.contenu).join('');
    });
  const texte = [...debut, ...gardees].join('\n');
  const descendu = texte.replace(/<(\/?)h3(\s|>)/g, '<$1h4$2').replace(/<(\/?)h2(\s|>)/g, '<$1h3$2');
  return pointerVersLesSitesActuels(descendu, cliniques);
}

/** L'adresse du texte complet d'un service : /textes-des-soins/fr/radiographie.html. */
export function adresseDuTexteComplet(langue: Langue, service: string): string {
  return `/textes-des-soins/${langue}/${service}.html`;
}
