// Les liens de l'en-tête et du pied de page (src/gabarits/Base.astro). Une page d'une clinique a
// la navigation de sa clinique ; une page commune, celle du réseau.

import type { Langue } from '../config.ts';
import { textes } from '../i18n/index.ts';
import { lesCliniques, lienDeLaClinique, type Clinique } from './cliniques.ts';
import { adresse } from './pages.ts';

export interface Lien {
  libelle: string;
  href: string;
}

export interface Navigation {
  entete: {
    /** L'accueil de la section : le site, ou la clinique. */
    accueil: string;
    /** Le nom du lieu à côté du logo, sur les pages d'une clinique. */
    lieu?: string;
    liens: Lien[];
    urgence: Lien;
    /** Sur les pages communes : le bouton de rendez-vous mène au choix de la clinique. */
    rendezVous?: string;
  };
  /** Les autres cliniques, vers leur accueil. */
  cliniques: Lien[];
  /** Les pages de la clinique, ou les pages communes. */
  pied: Lien[];
  /** Les pages légales, en bas du pied de page. */
  legal: Lien[];
}

/** La navigation d'une page, de sa clinique s'il y en a une. */
export async function navigationDe(langue: Langue, clinique?: Clinique): Promise<Navigation> {
  const t = textes(langue);
  const n = t.navigation;
  const lien = (cle: string) => adresse(langue, cle);

  const cliniques = await Promise.all(
    (await lesCliniques()).filter((c) => c.id !== clinique?.id).map(async (c) => ({ libelle: c.lieu, href: await lienDeLaClinique(c, langue) })),
  );
  const legal = [
    { libelle: n.confidentialite, href: await lien('confidentialite') },
    { libelle: n.mentionsLegales, href: await lien('mentions-legales') },
  ];

  if (clinique) {
    const page = (cle: string) => lien(`${clinique.id}/${cle}`);
    return {
      entete: {
        accueil: await page('index'),
        lieu: clinique.lieu,
        liens: [
          { libelle: n.services, href: await page('services/index') },
          { libelle: n.tarifs, href: await page('tarifs') },
          { libelle: n.abonnements, href: await page('abonnements') },
          { libelle: n.equipe, href: await page('equipe') },
          { libelle: n.contact, href: await page('contact') },
        ],
        urgence: { libelle: n.urgences, href: clinique.urgences ? await page('urgences') : await lien('urgences') },
      },
      cliniques,
      pied: [
        { libelle: t.rendezVous.bouton, href: await page('rendez-vous') },
        { libelle: n.services, href: await page('services/index') },
        { libelle: n.questions, href: await page('questions-frequentes') },
        { libelle: n.tarifs, href: await page('tarifs') },
        { libelle: n.abonnements, href: await page('abonnements') },
        { libelle: n.conseils, href: await lien('conseils/index') },
        { libelle: n.emploi, href: await lien('emploi') },
        { libelle: t.site.reseau, href: await lien('index') },
      ],
      legal,
    };
  }

  const pageDesCliniques = await lien('cliniques');
  return {
    entete: {
      accueil: await lien('index'),
      liens: [
        { libelle: n.cliniques, href: pageDesCliniques },
        { libelle: n.services, href: await lien('services/index') },
        { libelle: n.conseils, href: await lien('conseils/index') },
        { libelle: n.emploi, href: await lien('emploi') },
      ],
      urgence: { libelle: n.urgences, href: await lien('urgences') },
      rendezVous: `${pageDesCliniques}#rendez-vous`,
    },
    cliniques,
    pied: [
      { libelle: n.services, href: await lien('services/index') },
      { libelle: n.conseils, href: await lien('conseils/index') },
      { libelle: n.urgences, href: await lien('urgences') },
      { libelle: n.emploi, href: await lien('emploi') },
      { libelle: n.aPropos, href: await lien('a-propos') },
      { libelle: n.newsletter, href: await lien('newsletter') },
    ],
    legal,
  };
}
