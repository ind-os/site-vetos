// Les types de page et la convention des pages de clinique (docs/plan-des-pages.md).
// Le type, dans l'en-tête d'une page Markdown, choisit son gabarit (src/gabarits/).

export const TYPES_DE_PAGE = [
  // Pages communes
  'accueil-groupe',
  'cliniques',
  'service-index',
  'service',
  'urgences-groupe',
  'conseil-index',
  'conseil-categorie',
  'conseil',
  'simple',
  // Pages d'une clinique
  'accueil-clinique',
  'equipe',
  'contact',
  'tarifs',
  'rendez-vous',
  'questions-frequentes',
  'abonnements',
  'urgences',
  'service-clinique',
] as const;

export type TypeDePage = (typeof TYPES_DE_PAGE)[number];

/**
 * Les pages que chaque clinique en ligne doit avoir, dans chaque langue : le chemin du fichier
 * sous src/content/pages/<langue>/<clinique>/. La page urgences s'ajoute si la fiche dit que la
 * clinique reçoit les urgences, et une page par service de la fiche dans services/.
 */
export const PAGES_DE_CLINIQUE = ['index', 'equipe', 'contact', 'tarifs', 'rendez-vous', 'questions-frequentes', 'abonnements'] as const;

/** Les pages obligatoires d'une clinique, d'après sa fiche. */
export function pagesObligatoires(fiche: { id: string; urgences: boolean; services: string[] }): string[] {
  return [
    ...PAGES_DE_CLINIQUE.map((page) => `${fiche.id}/${page}`),
    ...(fiche.urgences ? [`${fiche.id}/urgences`] : []),
    ...fiche.services.map((service) => `${fiche.id}/services/${service}`),
  ];
}
