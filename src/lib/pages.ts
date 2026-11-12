// Les pages du site, lues dans la collection « pages » (src/content/pages/).
//
// Le chemin d'un fichier donne sa langue et sa clé : src/content/pages/de/payerne/equipe.md a la
// langue « de » et la clé « payerne/equipe ». La même clé dans les deux langues relie une page à sa
// traduction. L'adresse publique est le champ `url` de l'en-tête : /payerne/equipe/ et
// /de/payerne/team/.

import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGUE_PAR_DEFAUT, LANGUES, type Langue } from '../config.ts';
import { textes } from '../i18n/index.ts';
import { lesGrilles } from './grilles.ts';
import { remplacerLesPrix } from './prix.ts';
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

/**
 * Toutes les pages, dans les deux langues, publiées ou non : les pages écrites, puis la page de
 * chaque service d'un cabinet (pagesDeServiceDesCabinets). Les jetons {prix:<cle>} de la
 * description et du résumé d'une page de cabinet sont remplacés par les montants de sa grille ;
 * ceux du corps le sont dans le contexte de la page (src/lib/contexte.ts).
 */
export async function toutesLesPages(): Promise<Page[]> {
  const ecrites = await getCollection('pages');
  const grilles = new Map((await lesGrilles()).map((g) => [g.cabinet, g.valeurs]));
  const avecLesPrix = (page: Page): Page => {
    const valeurs = page.data.clinique ? grilles.get(page.data.clinique) : undefined;
    if (!valeurs) return page;
    const langue = langueDe(page);
    const { description, resume } = page.data;
    return { ...page, data: { ...page.data, description: remplacerLesPrix(description, valeurs, langue), resume: resume && remplacerLesPrix(resume, valeurs, langue) } };
  };
  return [...ecrites.map(avecLesPrix), ...(await pagesDeServiceDesCabinets(ecrites))];
}

/** Le premier title de 60 caractères au plus : le H1 avec « | Vetmint », le H1 seul, puis le nom court du soin. */
function titreDansLeCabinet(h1: string, nomCourt: string): string {
  const essais = [`${h1} | Vetmint`, h1, `${nomCourt} | Vetmint`, nomCourt];
  return essais.find((titre) => [...titre].length <= 60) ?? nomCourt;
}

/**
 * Chaque service de la fiche d'un cabinet a sa page, /payerne/services/radiographie/, sans fichier
 * à écrire. Le site la fabrique avec la fiche du cabinet, sa grille des prix et la page commune du
 * service (gabarit ServiceClinique) : son title, son H1 et sa description reprennent le titre de la
 * page commune du service, avec le lieu, et son adresse canonique est elle-même. Une page écrite
 * dans le dossier du cabinet, pour un soin qu'il est seul à pratiquer, garde son texte.
 */
async function pagesDeServiceDesCabinets(ecrites: Page[]): Promise<Page[]> {
  const existe = (id: string) => ecrites.some((p) => p.id === id);
  const pages: Page[] = [];
  for (const { data: cabinet } of await getCollection('cliniques')) {
    for (const service of cabinet.services) {
      for (const langue of LANGUES) {
        const commune = ecrites.find((p) => p.id === `${langue}/services/${service}`);
        const id = `${langue}/${cabinet.id}/services/${service}`;
        if (!commune || existe(id)) continue;
        const t = textes(langue);
        const prefixe = langue === LANGUE_PAR_DEFAUT ? '' : `/${langue}`;
        const url = `${prefixe}/${cabinet.id}${commune.data.url.slice(prefixe.length)}`;
        const nom = commune.data.nom ?? titreDe(commune);
        // Le titre du soin choisi pour sa page commune, avant les deux-points : « Dentisterie du chien
        // et du chat », « Prévention », « Hospitalisation du chien, du chat et des NAC ».
        const h1 = t.services.h1DansLeCabinet(titreDe(commune).split(/\s*:\s/)[0], cabinet.lieu);
        pages.push({
          ...commune,
          id,
          data: {
            ...commune.data,
            type: 'service-clinique',
            clinique: cabinet.id,
            url,
            title: titreDansLeCabinet(h1, t.services.h1DansLeCabinet(nom, cabinet.lieu)),
            h1,
            description: t.services.descriptionDansLeCabinet(h1, cabinet.lieu, cabinet.telephone.affiche),
            recherche: t.services.rechercheDansLeCabinet(nom, cabinet.lieu),
          },
        });
      }
    }
  }
  return pages;
}

/** Vrai pour la page d'un service de cabinet fabriquée par le site, sans fichier à elle. */
export function estFabriquee(page: Page): boolean {
  return page.data.type === 'service-clinique' && !(page.filePath ?? '').includes(`/${page.data.clinique}/`);
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
