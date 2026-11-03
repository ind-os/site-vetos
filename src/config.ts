// Les réglages du site, au même endroit.

/** L'adresse de production : elle sert aux adresses canoniques et au plan du site. */
export const ADRESSE_DU_SITE = 'https://vetmint.ch';

/**
 * Vrai quand le site remplace vetmint.ch et peut être indexé par les moteurs de recherche.
 * Tant qu'il vaut false, chaque page porte « noindex » et robots.txt interdit tout : le site
 * de travail ne concurrence pas le site en ligne.
 */
export const INDEXATION = false;

/** Les langues du site. La première est celle des adresses sans préfixe. */
export const LANGUES = ['fr', 'de'] as const;
export type Langue = (typeof LANGUES)[number];
export const LANGUE_PAR_DEFAUT: Langue = 'fr';

/** Le code de langue des balises html et hreflang. */
export const CODES_DE_LANGUE: Record<Langue, string> = { fr: 'fr-CH', de: 'de-CH' };

/** Le fuseau des horaires des cliniques. */
export const FUSEAU = 'Europe/Zurich';
