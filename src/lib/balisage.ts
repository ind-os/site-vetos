// Le balisage schema.org des pages (JSON-LD) : la clinique, le groupe, le fil d'Ariane, les
// questions fréquentes. Les moteurs de recherche le lisent pour leurs fiches et leurs réponses.

import { ADRESSE_DU_SITE, CODES_DE_LANGUE, type Langue } from '../config.ts';
import type { Clinique } from './cliniques.ts';
import { texteDe } from './html.ts';
import { JOURS } from './horaires.ts';

const JOURS_SCHEMA = { lundi: 'Monday', mardi: 'Tuesday', mercredi: 'Wednesday', jeudi: 'Thursday', vendredi: 'Friday', samedi: 'Saturday', dimanche: 'Sunday' } as const;

/** L'adresse complète d'un chemin du site : « /payerne/ » donne « https://vetmint.ch/payerne/ ». */
export function absolue(chemin: string): string {
  return new URL(chemin, ADRESSE_DU_SITE).href;
}

/** Le groupe Vetmint. */
export function balisageDuGroupe(): Record<string, unknown> {
  return { '@type': 'Organization', '@id': `${ADRESSE_DU_SITE}/#vetmint`, name: 'Vetmint', url: `${ADRESSE_DU_SITE}/` };
}

/** Une clinique, avec son adresse, ses horaires et son appartenance au groupe. */
export function balisageDeLaClinique(clinique: Clinique, url: string): Record<string, unknown> {
  return {
    '@type': 'VeterinaryCare',
    '@id': `${absolue(url)}#clinique`,
    name: clinique.nom,
    url: absolue(url),
    telephone: clinique.telephone.international,
    email: clinique.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinique.adresse.rue,
      postalCode: clinique.adresse.npa,
      addressLocality: clinique.adresse.localite,
      addressRegion: clinique.canton,
      addressCountry: 'CH',
    },
    geo: { '@type': 'GeoCoordinates', latitude: clinique.coordonnees.lat, longitude: clinique.coordonnees.lng },
    openingHoursSpecification: JOURS.flatMap((jour) =>
      clinique.horaires[jour].map((plage) => {
        const [ouvre, ferme] = plage.split('-');
        return { '@type': 'OpeningHoursSpecification', dayOfWeek: JOURS_SCHEMA[jour], opens: ouvre, closes: ferme };
      }),
    ),
    parentOrganization: { '@id': `${ADRESSE_DU_SITE}/#vetmint` },
  };
}

/** Le fil d'Ariane d'une page. */
export function balisageDuFil(etapes: { libelle: string; href: string }[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: etapes.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.libelle, item: absolue(e.href) })),
  };
}

/** Les questions fréquentes d'une page. */
export function balisageDesQuestions(questions: { question: string; reponse: string }[], langue: Langue): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    inLanguage: CODES_DE_LANGUE[langue],
    mainEntity: questions.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: texteDe(q.reponse) } })),
  };
}

/** Le graphe JSON-LD, prêt à poser dans une balise script. */
export function enJsonLd(graphe: Record<string, unknown>[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graphe }).replace(/</g, '\\u003c');
}
