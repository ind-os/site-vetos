// La découpe du HTML d'une page Markdown, pour que les gabarits placent ses morceaux :
// sections ##, questions ###.

/** Le texte d'un fragment HTML, sans balises ; la fin d'un élément de bloc laisse une espace. */
export function texteDe(html: string): string {
  return html
    .replace(/<\/(p|li|dt|dd|div|h[1-6]|td|th)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;|\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface Section {
  /** Le titre en texte ; vide pour le texte avant le premier titre. */
  titre: string;
  /** La balise de titre entière. */
  entete: string;
  /** Ce qui suit le titre, jusqu'au titre suivant de même niveau. */
  contenu: string;
}

/**
 * Les sections d'un niveau de titre (2 pour ##, 3 pour ###) : le texte avant le premier titre
 * (`introduction`), le HTML à partir du premier titre tel quel (`suite`), et chaque section.
 */
export function sections(html: string, niveau: 2 | 3): { introduction: string; suite: string; sections: Section[] } {
  const balise = `h${niveau}`;
  const morceaux = html.split(new RegExp(`(?=<${balise}[\\s>])`));
  const introduction = morceaux[0].startsWith(`<${balise}`) ? '' : (morceaux.shift() ?? '').trim();
  return {
    introduction,
    suite: morceaux.join(''),
    sections: morceaux.map((morceau) => {
      const titre = new RegExp(`^<${balise}[^>]*>([\\s\\S]*?)</${balise}>`).exec(morceau);
      return { titre: texteDe(titre?.[1] ?? ''), entete: titre?.[0] ?? '', contenu: morceau.slice(titre?.[0].length ?? 0).trim() };
    }),
  };
}

/** Les questions d'une page de questions fréquentes : chaque ### est une question, la suite sa réponse. */
export function questions(html: string): { question: string; reponse: string }[] {
  return sections(html, 3).sections.map((s) => ({ question: s.titre, reponse: s.contenu }));
}
