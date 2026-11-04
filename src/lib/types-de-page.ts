// Les types de page et la convention des pages de clinique (docs/plan-des-pages.md).
// Le type, dans l'en-tête d'une page Markdown, choisit son gabarit (src/gabarits/).

/** Les types des pages communes : leur fichier est hors des dossiers des cliniques. */
const TYPES_DE_PAGE_COMMUNE = ['accueil-groupe', 'cliniques', 'service-index', 'service', 'urgences-groupe', 'conseil-index', 'conseil-categorie', 'conseil', 'simple'] as const;

/**
 * Les types des pages d'une clinique : leur fichier est dans <langue>/<clinique>/ et leur en-tête
 * porte le champ `clinique`.
 */
export const TYPES_DE_PAGE_DE_CLINIQUE = [
  'accueil-clinique',
  'services-clinique',
  'equipe',
  'contact',
  'tarifs',
  'rendez-vous',
  'questions-frequentes',
  'abonnements',
  'urgences',
  'service-clinique',
] as const;

export const TYPES_DE_PAGE = [...TYPES_DE_PAGE_COMMUNE, ...TYPES_DE_PAGE_DE_CLINIQUE] as const;

export type TypeDePage = (typeof TYPES_DE_PAGE)[number];

/**
 * Les pages que chaque clinique en ligne doit avoir, dans chaque langue : le chemin du fichier
 * sous src/content/pages/<langue>/<clinique>/. La page des services liste les soins de la fiche.
 * La page urgences s'ajoute si la fiche dit que la clinique reçoit les urgences, et une page
 * par service de la fiche dans services/.
 */
export const PAGES_DE_CLINIQUE = ['index', 'services/index', 'equipe', 'contact', 'tarifs', 'rendez-vous', 'questions-frequentes', 'abonnements'] as const;

/** Les pages obligatoires d'une clinique, d'après sa fiche. */
export function pagesObligatoires(fiche: { id: string; urgences: boolean; services: string[] }): string[] {
  return [
    ...PAGES_DE_CLINIQUE.map((page) => `${fiche.id}/${page}`),
    ...(fiche.urgences ? [`${fiche.id}/urgences`] : []),
    ...fiche.services.map((service) => `${fiche.id}/services/${service}`),
  ];
}
