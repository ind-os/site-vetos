// Ce qu'un gabarit sait d'une page : sa langue, ses textes d'interface, son HTML avec les données
// de la clinique, sa clinique, ses adresses dans les deux langues et son fil d'Ariane.

import type { Langue } from '../config.ts';
import { LANGUES } from '../config.ts';
import { textes, type Catalogue } from '../i18n/index.ts';
import { laClinique, lesCliniques, pointerVersLesSitesActuels, type Clinique } from './cliniques.ts';
import { remplirLesDonnees } from './donnees-de-la-clinique.ts';
import { cleDe, langueDe, laPage, titreDe, type Page } from './pages.ts';

export interface Contexte {
  page: Page;
  langue: Langue;
  t: Catalogue;
  /** Le HTML du texte, avec les blocs de données remplis. */
  html: string;
  clinique?: Clinique;
  /** L'adresse de la page dans chaque langue où elle existe. */
  adresses: Partial<Record<Langue, string>>;
  /** Le fil d'Ariane, de l'accueil à la page. */
  fil: { libelle: string; href: string }[];
  titre: string;
}

/** Le nom court d'une page, pour le fil d'Ariane. */
async function nomCourt(page: Page, t: Catalogue): Promise<string> {
  const n = t.navigation;
  switch (page.data.type) {
    case 'accueil-groupe':
      return n.accueil;
    case 'accueil-clinique':
      return page.data.clinique ? (await laClinique(page.data.clinique)).lieu : titreDe(page);
    case 'services-clinique':
      return n.services;
    case 'cliniques':
      return n.cliniques;
    case 'service-index':
      return n.services;
    case 'conseil-index':
      return n.conseils;
    case 'conseil-categorie':
      return t.especes[page.data.especes?.[0] ?? 'chien'];
    case 'urgences-groupe':
    case 'urgences':
      return n.urgences;
    case 'equipe':
      return n.equipe;
    case 'contact':
      return n.contact;
    case 'tarifs':
      return n.tarifs;
    case 'abonnements':
      return n.abonnements;
    case 'questions-frequentes':
      return n.questions;
    case 'rendez-vous':
      return n.rendezVous;
    default:
      return page.data.nom ?? titreDe(page);
  }
}

/**
 * Le fil d'Ariane : l'accueil, puis chaque page parente qui existe. Les parents de
 * « payerne/services/radiographie » sont « payerne/index » et « services/index » n'en est pas
 * un : seules les clés qui prolongent celle de la page comptent.
 */
async function filDAriane(page: Page, langue: Langue, t: Catalogue): Promise<Contexte['fil']> {
  const cle = cleDe(page);
  const morceaux = cle.split('/').filter((m) => m !== 'index');
  const etapes: Contexte['fil'] = [];
  const accueil = await laPage(langue, 'index');
  if (accueil && cle !== 'index') etapes.push({ libelle: await nomCourt(accueil, t), href: accueil.data.url });
  for (let i = 1; i < morceaux.length; i += 1) {
    const parent = (await laPage(langue, `${morceaux.slice(0, i).join('/')}/index`)) ?? (await laPage(langue, morceaux.slice(0, i).join('/')));
    if (parent) etapes.push({ libelle: await nomCourt(parent, t), href: parent.data.url });
  }
  etapes.push({ libelle: await nomCourt(page, t), href: page.data.url });
  return etapes;
}

/** Le contexte d'une page, pour son gabarit. */
export async function contexteDe(page: Page): Promise<Contexte> {
  const langue = langueDe(page);
  const t = textes(langue);
  const clinique = page.data.clinique ? await laClinique(page.data.clinique) : undefined;
  const cliniques = await lesCliniques();
  const html = pointerVersLesSitesActuels(remplirLesDonnees(page.rendered?.html ?? '', cliniques, langue, clinique?.id), cliniques);
  const adresses: Contexte['adresses'] = {};
  for (const l of LANGUES) {
    const traduction = await laPage(l, cleDe(page));
    if (traduction) adresses[l] = traduction.data.url;
  }
  return { page, langue, t, html, clinique, adresses, fil: await filDAriane(page, langue, t), titre: titreDe(page) };
}
