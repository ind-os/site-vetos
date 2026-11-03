// Les règles que le site vérifie à chaque construction (docs/plan-des-pages.md) :
// - chaque page existe dans les deux langues ;
// - chaque adresse est unique, les adresses allemandes commencent par /de/ ;
// - chaque clinique en ligne a ses pages obligatoires ;
// - chaque service d'une fiche a sa page commune.
// En construction, un problème arrête tout ; en prévisualisation, il s'affiche dans le terminal.

import { LANGUES, LANGUE_PAR_DEFAUT } from '../config.ts';
import { lesCliniques } from './cliniques.ts';
import { cleDe, langueDe, toutesLesPages } from './pages.ts';
import { pagesObligatoires } from './types-de-page.ts';

export async function problemesDuSite(): Promise<string[]> {
  const pages = await toutesLesPages();
  const problemes: string[] = [];
  const existe = (langue: string, cle: string) => pages.some((p) => langueDe(p) === langue && cleDe(p) === cle);

  for (const page of pages) {
    const langue = langueDe(page);
    const cle = cleDe(page);
    for (const autre of LANGUES) {
      if (autre !== langue && !existe(autre, cle)) problemes.push(`La page ${langue}/${cle}.md n'a pas de traduction : src/content/pages/${autre}/${cle}.md manque.`);
    }
    const prefixe = langue === LANGUE_PAR_DEFAUT ? '' : `/${langue}`;
    if (prefixe && !page.data.url.startsWith(`${prefixe}/`)) problemes.push(`${page.id}.md : l'adresse ${page.data.url} doit commencer par ${prefixe}/.`);
    if (!prefixe && LANGUES.some((l) => page.data.url.startsWith(`/${l}/`))) problemes.push(`${page.id}.md : l'adresse ${page.data.url} ne doit pas commencer par un préfixe de langue.`);
    const dossier = cle.split('/')[0];
    if (page.data.clinique && page.data.clinique !== dossier) problemes.push(`${page.id}.md : le champ clinique (${page.data.clinique}) ne correspond pas au dossier ${dossier}/.`);
  }

  const parAdresse = new Map<string, string[]>();
  for (const page of pages) parAdresse.set(page.data.url, [...(parAdresse.get(page.data.url) ?? []), page.id]);
  for (const [url, ids] of parAdresse) if (ids.length > 1) problemes.push(`L'adresse ${url} est utilisée par plusieurs pages : ${ids.join(', ')}.`);

  for (const clinique of await lesCliniques()) {
    for (const service of clinique.services) {
      if (!existe(LANGUE_PAR_DEFAUT, `services/${service}`)) problemes.push(`La fiche ${clinique.id}.json cite le service « ${service} », qui n'a pas de page dans services/.`);
    }
    if (!clinique.en_ligne) continue;
    for (const langue of LANGUES) {
      for (const cle of pagesObligatoires(clinique)) {
        if (!existe(langue, cle)) problemes.push(`La clinique ${clinique.id} est en ligne mais src/content/pages/${langue}/${cle}.md manque.`);
      }
    }
  }
  return problemes;
}
