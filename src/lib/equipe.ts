// Les portraits de la page Équipe d'un cabinet. Dans le Markdown, chaque personne a son titre
// ### « Nom, fonction » suivi de son portrait (docs/structure-des-pages.md, « Équipe »). Sur la
// page, le portrait quitte le fil du texte : il s'ouvre depuis la carte de la personne.

/** Le texte d'un titre HTML, sans balises ni entités courantes, pour le comparer à un nom. */
function texteDe(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;|&rsquo;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;| /g, ' ');
}

function normaliser(texte: string): string {
  return texte.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Un titre ### et tout ce qui le suit jusqu'au prochain titre ## ou ###. */
const SECTION_H3 = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h[23][\s>]|$)/g;

/**
 * Sépare les portraits du reste du texte : chaque section ### dont le titre commence par le nom
 * d'une personne de la fiche devient son portrait, sans le titre. Le texte rendu n'a plus ces
 * sections ; les autres ### (« Voir le même vétérinaire… », « À l'accueil ») restent en place.
 */
export function portraitsDeLEquipe(html: string, noms: string[]): { html: string; portraits: Map<string, string> } {
  const portraits = new Map<string, string>();
  const reste = html.replace(SECTION_H3, (section, titre: string, corps: string) => {
    // « Dr Pascal Wicki, vétérinaire », « Dr. med. vet. … » : le titre devant le nom ne compte pas.
    const texte = normaliser(texteDe(titre)).replace(/^((dr|dre|prof|med|vet)\.?\s+)+/, '');
    const nom = noms.find((n) => texte === normaliser(n) || texte.startsWith(`${normaliser(n)},`));
    if (!nom || portraits.has(nom)) return section;
    portraits.set(nom, corps.trim());
    return '';
  });
  return { html: reste, portraits };
}

/** L'identifiant d'une personne dans l'adresse de la page : /payerne/equipe/#claire-lise-tinguely. */
export function ancreDe(nom: string): string {
  return normaliser(nom).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
