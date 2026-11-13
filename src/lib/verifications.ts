// Les règles que le site vérifie à chaque construction (docs/verifications.md) :
// - chaque page publiable existe dans les deux langues ;
// - chaque adresse est unique, les adresses allemandes commencent par /de/ ;
// - une page d'un type de clinique porte le champ clinique, celui de son dossier ; une page
//   commune ne le porte pas ;
// - une page de catégorie de conseils nomme son espèce ;
// - chaque clinique en ligne a ses pages obligatoires ;
// - chaque service d'une fiche a sa page commune, avec les champs en_phrase et presentation_dans_le_cabinet ;
// - chaque grille des prix appartient à un cabinet, et ses services existent ;
// - chaque jeton {prix:<cle>} est sur une page de cabinet et existe dans sa grille ;
// - les textes d'interface ont les mêmes clés en français et en allemand ;
// - chaque photo du catalogue nomme une clinique et une personne qui existent.
// En construction, un problème arrête tout ; en prévisualisation, il s'affiche dans le terminal.

import { LANGUES, LANGUE_PAR_DEFAUT } from '../config.ts';
import { problemesDesTextes } from '../i18n/index.ts';
import { lesCliniques } from './cliniques.ts';
import { lesGrilles } from './grilles.ts';
import { clesDesJetons } from './prix.ts';
import { problemesDuCatalogue } from './images.ts';
import { cleDe, estFabriquee, langueDe, pagesPubliables, toutesLesPages } from './pages.ts';
import { pagesObligatoires, TYPES_DE_PAGE_DE_CLINIQUE } from './types-de-page.ts';

/** Le chemin du fichier d'une page, depuis la racine du dépôt. */
function fichierDe(langue: string, cle: string): string {
  return `src/content/pages/${langue}/${cle}.md`;
}

export async function problemesDuSite(): Promise<string[]> {
  const pages = await toutesLesPages();
  const publiables = await pagesPubliables();
  const cliniques = await lesCliniques();
  const problemes: string[] = [];
  const existe = (langue: string, cle: string) => pages.some((p) => langueDe(p) === langue && cleDe(p) === cle);
  const typesDeClinique: readonly string[] = TYPES_DE_PAGE_DE_CLINIQUE;

  for (const page of publiables) {
    const langue = langueDe(page);
    const cle = cleDe(page);
    for (const autre of LANGUES) {
      if (autre !== langue && !existe(autre, cle)) problemes.push(`${fichierDe(langue, cle)} n'a pas de traduction : ${fichierDe(autre, cle)} manque.`);
    }
  }

  for (const page of pages) {
    const langue = langueDe(page);
    const cle = cleDe(page);
    const fichier = fichierDe(langue, cle);
    const { type, clinique, url, especes } = page.data;
    const prefixe = langue === LANGUE_PAR_DEFAUT ? '' : `/${langue}`;
    if (prefixe && !url.startsWith(`${prefixe}/`)) problemes.push(`${fichier} : l'adresse ${url} doit commencer par ${prefixe}/.`);
    if (!prefixe && LANGUES.some((l) => url.startsWith(`/${l}/`))) problemes.push(`${fichier} : l'adresse ${url} ne doit pas commencer par un préfixe de langue.`);
    const dossier = cle.split('/')[0];
    if (clinique && clinique !== dossier) problemes.push(`${fichier} : le champ clinique (${clinique}) ne correspond pas au dossier ${dossier}/.`);
    if (typesDeClinique.includes(type) && !clinique) problemes.push(`${fichier} : le champ clinique manque, une page de type ${type} appartient à un cabinet.`);
    if (!typesDeClinique.includes(type) && clinique) problemes.push(`${fichier} : le champ clinique est de trop, une page de type ${type} est une page commune.`);
    if (type === 'conseil-categorie' && !especes?.length) problemes.push(`${fichier} : le champ especes manque, une page de type conseil-categorie nomme son espèce (chien, chat ou nac).`);
  }

  const parAdresse = new Map<string, string[]>();
  for (const page of pages) parAdresse.set(page.data.url, [...(parAdresse.get(page.data.url) ?? []), `src/content/pages/${page.id}.md`]);
  for (const [url, fichiers] of parAdresse) if (fichiers.length > 1) problemes.push(`L'adresse ${url} est utilisée par plusieurs pages : ${fichiers.join(', ')}.`);

  for (const clinique of cliniques) {
    for (const service of clinique.services) {
      if (!existe(LANGUE_PAR_DEFAUT, `services/${service}`)) {
        problemes.push(`src/donnees/cliniques/${clinique.id}.json cite le service « ${service} », qui n'a pas de page commune : ${fichierDe(LANGUE_PAR_DEFAUT, `services/${service}`)} manque.`);
      }
      for (const langue of LANGUES) {
        const commune = pages.find((p) => langueDe(p) === langue && cleDe(p) === `services/${service}`);
        if (commune && !commune.data.en_phrase) problemes.push(`${fichierDe(langue, `services/${service}`)} : le champ en_phrase manque, le nom du soin dans une phrase (« la radiographie », « das Röntgen »). La page du service dans chaque cabinet l'utilise.`);
        if (commune && !commune.data.presentation_dans_le_cabinet?.includes('{cabinet}')) problemes.push(`${fichierDe(langue, `services/${service}`)} : le champ presentation_dans_le_cabinet manque ou ne contient pas {cabinet} (« Le cabinet {cabinet} propose des soins dentaires… »). Le chapeau de la page du service dans chaque cabinet l'utilise.`);
      }
    }
    if (!clinique.en_ligne) continue;
    for (const langue of LANGUES) {
      for (const cle of pagesObligatoires(clinique)) {
        if (!existe(langue, cle)) problemes.push(`Le cabinet ${clinique.id} est en ligne mais sa page ${fichierDe(langue, cle)} manque : crée ce fichier.`);
      }
    }
  }

  const grilles = await lesGrilles();
  for (const { cabinet, grille } of grilles) {
    if (!cliniques.some((c) => c.id === cabinet)) problemes.push(`src/donnees/tarifs/${cabinet}.json : aucun cabinet ne s'appelle « ${cabinet} » ; le nom du fichier est l'identifiant du cabinet.`);
    for (const prix of grille.prix) {
      if (prix.service && !existe(LANGUE_PAR_DEFAUT, `services/${prix.service}`)) problemes.push(`src/donnees/tarifs/${cabinet}.json : le prix « ${prix.cle} » cite le service « ${prix.service} », qui n'a pas de page commune.`);
    }
  }
  for (const page of pages.filter((p) => !estFabriquee(p))) {
    const fichier = fichierDe(langueDe(page), cleDe(page));
    const cles = clesDesJetons([page.body ?? '', page.data.description, page.data.resume ?? ''].join('\n'));
    if (cles.length === 0) continue;
    const grille = grilles.find((g) => g.cabinet === page.data.clinique);
    if (!page.data.clinique) problemes.push(`${fichier} : un prix ({prix:${cles[0]}}) ne s'écrit que sur une page de cabinet (docs/grille-des-prix.md).`);
    else if (!grille) problemes.push(`${fichier} : la page écrit {prix:${cles[0]}}, mais le cabinet ${page.data.clinique} n'a pas de grille : src/donnees/tarifs/${page.data.clinique}.json manque.`);
    else for (const cle of cles.filter((c) => !grille.valeurs.has(c))) problemes.push(`${fichier} : {prix:${cle}} n'existe pas dans src/donnees/tarifs/${page.data.clinique}.json.`);
  }

  return [...problemes, ...problemesDesTextes(), ...problemesDuCatalogue(cliniques)];
}
