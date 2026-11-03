// Les extensions Markdown du site, pour le processeur Sätteri d'Astro (astro.config.mjs) :
// - un retour à la ligne dans un paragraphe est gardé : une adresse s'écrit sur trois lignes ;
// - un nombre ne se sépare pas de son unité : « 30 minutes », « 57 francs », « 8 h 30 » ;
// - un lien seul dans son paragraphe devient un bouton ; un lien externe reçoit rel="noopener" ;
// - une liste dont chaque point commence par un lien devient une liste de cartes ;
// - un tableau est enveloppé dans une région qui défile sur un petit écran ;
// - un mot composé court ne se coupe pas au trait d'union (« e-mail », « rendez-vous »).

import type { HastPluginDefinition, MdastPluginDefinition } from 'satteri';

/** La langue d'une page Markdown, d'après l'adresse de son en-tête. */
function langueDuFichier(ctx: { data: { astro?: { frontmatter?: Record<string, unknown> } } }): 'fr' | 'de' {
  const url = ctx.data.astro?.frontmatter?.url;
  return typeof url === 'string' && url.startsWith('/de/') ? 'de' : 'fr';
}

/** Un retour à la ligne dans un paragraphe devient un <br>. */
function retoursALaLigne(): MdastPluginDefinition {
  return {
    name: 'vetmint-retours-a-la-ligne',
    text(texte, ctx) {
      if (!texte.value.includes('\n') || ctx.parent(texte)?.type !== 'paragraph') return;
      const lignes = texte.value.split('\n');
      ctx.replaceNode(
        texte,
        lignes.flatMap((ligne, i) => (i === 0 ? [{ type: 'text' as const, value: ligne }] : [{ type: 'break' as const }, { type: 'text' as const, value: ligne }])),
      );
    },
  };
}

const ESPACE_INSECABLE = ' ';
const UNITES = 'h|min|minutes?|heures?|francs?|CHF|Fr\\.|Franken|km|kg|g|ans?|mois|jours?|semaines?|Minuten|Stunden|Jahre|Monate|Tage|Wochen|Uhr|%';
const NOMBRE_ET_UNITE = new RegExp(`(\\d) (${UNITES})(?=[\\s.,;:!?)»]|$)`, 'gu');
const HEURE_ET_MINUTES = /(\d h) (\d{2})\b/gu;

/** Un nombre et son unité sur la même ligne. */
export function lierLesUnites(texte: string): string {
  return texte.replace(NOMBRE_ET_UNITE, `$1${ESPACE_INSECABLE}$2`).replace(HEURE_ET_MINUTES, `$1${ESPACE_INSECABLE}$2`);
}

function typographie(): MdastPluginDefinition {
  return {
    name: 'vetmint-typographie',
    text(texte, ctx) {
      const valeur = lierLesUnites(texte.value);
      if (valeur !== texte.value) ctx.replaceNode(texte, { type: 'text', value: valeur });
    },
  };
}

type NoeudHast = { type: string; tagName?: string; value?: unknown; children?: NoeudHast[] };

/** Les éléments enfants qui portent une des balises. */
function enfants(noeud: NoeudHast, ...balises: string[]): NoeudHast[] {
  return (noeud.children ?? []).filter((n) => n.type === 'element' && balises.includes(n.tagName ?? ''));
}

/** Les enfants qui ne sont pas des espaces. */
function pleins(noeud: NoeudHast): NoeudHast[] {
  return (noeud.children ?? []).filter((n) => !(n.type === 'text' && typeof n.value === 'string' && n.value.trim() === ''));
}

function estExterne(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Les liens : bouton quand le lien est seul dans son paragraphe, rel="noopener" à l'extérieur. */
function liens(): HastPluginDefinition {
  return {
    name: 'vetmint-liens',
    element: {
      filter: ['a'],
      visit(lien, ctx) {
        const href = lien.properties?.href;
        if (typeof href !== 'string') return;
        if (estExterne(href)) ctx.setProperty(lien, 'rel', ['noopener']);
        const parent = ctx.parent(lien) as NoeudHast | undefined;
        if (parent?.type === 'element' && parent.tagName === 'p') {
          const contenu = pleins(parent);
          if (contenu.length === 1 && contenu[0].type === 'element' && contenu[0].tagName === 'a') {
            ctx.setProperty(lien, 'className', ['bouton', 'bouton--principal']);
            ctx.setProperty(parent as never, 'className', ['appel']);
          }
        }
      },
    },
  };
}

/** Une liste dont chaque point commence par un lien devient une liste de cartes (.liste-de-liens). */
function listesDeLiens(): HastPluginDefinition {
  return {
    name: 'vetmint-listes-de-liens',
    element: {
      filter: ['ul'],
      visit(liste, ctx) {
        const points = enfants(liste as unknown as NoeudHast, 'li');
        if (points.length < 2) return;
        const commenceParUnLien = (point: NoeudHast) => {
          const premier = pleins(point)[0];
          // Un point peut envelopper son texte dans un paragraphe
          const cible = premier?.tagName === 'p' ? pleins(premier)[0] : premier;
          return cible?.type === 'element' && cible.tagName === 'a';
        };
        if (!points.every(commenceParUnLien)) return;
        ctx.setProperty(liste, 'className', ['liste-de-liens']);
        // Le lien passe sur sa propre ligne : les deux-points qui le suivaient tombent.
        for (const point of points) {
          const premier = pleins(point)[0];
          const conteneur = premier?.tagName === 'p' ? premier : point;
          const enfantsDuPoint = conteneur.children ?? [];
          const apres = enfantsDuPoint[enfantsDuPoint.findIndex((n) => n.type === 'element' && n.tagName === 'a') + 1];
          if (apres?.type === 'text' && typeof apres.value === 'string' && /^\s*:\s*/.test(apres.value)) {
            const reste = apres.value.replace(/^\s*:\s*/, '');
            ctx.replaceNode(apres as never, { type: 'text', value: ` ${reste.charAt(0).toUpperCase()}${reste.slice(1)}` });
          }
        }
      },
    },
  };
}

/**
 * Les tableaux, enveloppés dans une région qui défile sur un petit écran et se parcourt au
 * clavier. Un tableau de trois colonnes ou plus s'empile sur smartphone : chaque cellule porte
 * le nom de sa colonne (data-colonne), que la feuille de style affiche.
 */
function tableaux(): HastPluginDefinition {
  return {
    name: 'vetmint-tableaux',
    element: {
      filter: ['table'],
      visit(tableau, ctx) {
        const de = langueDuFichier(ctx as never) === 'de';
        const entete = enfants(tableau as unknown as NoeudHast, 'thead')[0];
        const noms = entete
          ? enfants(entete, 'tr').flatMap((tr) => enfants(tr, 'th', 'td')).map((c) => ctx.textContent(c as never).trim())
          : [];
        const empile = noms.length >= 3;
        if (empile) {
          for (const corps of enfants(tableau as unknown as NoeudHast, 'tbody')) {
            for (const ligne of enfants(corps, 'tr')) {
              enfants(ligne, 'th', 'td').forEach((cellule, i) => {
                if (noms[i]) ctx.setProperty(cellule as never, 'dataColonne', noms[i]);
              });
            }
          }
        }
        ctx.wrapNode(tableau, {
          type: 'element',
          tagName: 'div',
          properties: {
            className: empile ? ['tableau', 'tableau--empile'] : ['tableau'],
            role: 'region',
            tabIndex: 0,
            ariaLabel: `${de ? 'Tabelle' : 'Tableau'}${noms.length ? ` : ${noms.join(', ')}` : ''}`,
          },
          children: [],
        });
      },
    },
  };
}

const MOT_COMPOSE = /\p{L}-\p{L}/u;
const MOT_COMPOSE_COURT = /^[^\s]{0,16}$/u;

/** Un mot composé ne se coupe pas au trait d'union : tous dans un titre, les courts dans le texte. */
function motsComposes(): HastPluginDefinition {
  const TITRES = ['h2', 'h3', 'h4'];
  return {
    name: 'vetmint-mots-composes',
    element: {
      filter: [...TITRES, 'p', 'li', 'td', 'th', 'strong', 'em'],
      visit(element, ctx) {
        const dansUnTitre = TITRES.includes(element.tagName);
        const aProteger = (m: string) => MOT_COMPOSE.test(m) && (dansUnTitre || MOT_COMPOSE_COURT.test(m));
        for (const enfant of element.children) {
          if (enfant.type !== 'text' || !MOT_COMPOSE.test(enfant.value)) continue;
          const morceaux = enfant.value.split(/([^\s]*\p{L}-\p{L}[^\s]*)/u).filter(Boolean);
          if (!morceaux.some(aProteger)) continue;
          ctx.replaceNode(
            enfant,
            morceaux.map((m) =>
              aProteger(m)
                ? { type: 'element' as const, tagName: 'span', properties: { className: ['insecable'] }, children: [{ type: 'text' as const, value: m }] }
                : { type: 'text' as const, value: m },
            ),
          );
        }
      },
    },
  };
}

/** Les extensions, à passer à satteri({ mdastPlugins, hastPlugins }). */
export const extensionsMarkdown = {
  mdastPlugins: [retoursALaLigne(), typographie()],
  hastPlugins: [liens(), listesDeLiens(), tableaux(), motsComposes()],
};
