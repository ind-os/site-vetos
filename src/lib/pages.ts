// Les pages du site, lues dans la collection « pages » (src/content/pages/).
//
// Le chemin d'un fichier donne sa langue et sa clé : src/content/pages/de/payerne/equipe.md a la
// langue « de » et la clé « payerne/equipe ». La même clé dans les deux langues relie une page à sa
// traduction. L'adresse publique est le champ `url` de l'en-tête : /payerne/equipe/ et
// /de/payerne/team/.

import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGUES, type Langue } from '../config.ts';
import type { TypeDePage } from './types-de-page.ts';

export type Page = CollectionEntry<'pages'>;

/** La langue d'une page, d'après le dossier de son fichier. */
export function langueDe(page: Page): Langue {
  const langue = page.id.split('/')[0];
  if (!LANGUES.includes(langue as Langue)) throw new Error(`${page.id} : le fichier doit être dans un dossier de langue (fr/ ou de/).`);
  return langue as Langue;
}

/** La clé d'une page : son chemin sans la langue, « payerne/equipe » ou « index ». */
export function cleDe(page: Page): string {
  return page.id.split('/').slice(1).join('/');
}

/** Le dernier morceau de la clé : « services/radiographie » donne « radiographie ». */
export function slugDe(page: Page): string {
  return cleDe(page).split('/').at(-1) ?? '';
}

/** Toutes les pages écrites, dans les deux langues, publiées ou non. */
export async function toutesLesPages(): Promise<Page[]> {
  return getCollection('pages');
}

/**
 * Les pages que le site construit. En prévisualisation, toutes. À la construction, les pages
 * communes et celles des cliniques en ligne : les pages d'une clinique dont la fiche dit
 * `"en_ligne": false` ne sont ni construites, ni dans le plan du site.
 */
export async function pagesPubliables(): Promise<Page[]> {
  const pages = await toutesLesPages();
  if (!import.meta.env.PROD) return pages;
  const enLigne = new Set((await getCollection('cliniques')).filter((c) => c.data.en_ligne).map((c) => c.data.id));
  return pages.filter((p) => !p.data.clinique || enLigne.has(p.data.clinique));
}

/** Les pages publiables d'une langue, éventuellement d'un type, dans l'ordre du champ `ordre` puis du titre. */
export async function lesPages(langue: Langue, type?: TypeDePage): Promise<Page[]> {
  return (await pagesPubliables())
    .filter((p) => langueDe(p) === langue && (!type || p.data.type === type))
    .sort((a, b) => (a.data.ordre ?? 99) - (b.data.ordre ?? 99) || (a.data.h1 ?? a.data.title).localeCompare(b.data.h1 ?? b.data.title, langue));
}

/** La page publiable d'une clé dans une langue, ou rien. */
export async function laPage(langue: Langue, cle: string): Promise<Page | undefined> {
  return (await pagesPubliables()).find((p) => langueDe(p) === langue && cleDe(p) === cle);
}

/**
 * L'adresse d'une page d'après sa clé : adresse(« de », « payerne/equipe ») donne « /de/payerne/team/ ».
 * Une page absente arrête la construction ; en prévisualisation, le lien mène à « # » et le
 * terminal le signale, pour que la page en cours d'écriture reste visible.
 */
export async function adresse(langue: Langue, cle: string): Promise<string> {
  const page = await laPage(langue, cle);
  if (page) return page.data.url;
  const message = `Aucune page « ${cle} » en ${langue} : le fichier src/content/pages/${langue}/${cle}.md manque.`;
  if (import.meta.env.DEV) {
    console.warn(message);
    return '#';
  }
  throw new Error(message);
}

/** Le titre d'une page tel qu'il s'affiche : le H1, sinon le title. */
export function titreDe(page: Page): string {
  return page.data.h1 ?? page.data.title;
}

/** Le temps de lecture d'une page, à 200 mots par minute. */
export function minutesDeLecture(page: Page): number {
  const mots = (page.body ?? '').replace(/<!--[\s\S]*?-->/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 200));
}
