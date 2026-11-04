// Un conseil santé présenté en carte (src/composants/CarteConseil.astro), sur l'index des
// conseils, les pages par espèce et sous « À lire aussi » d'un conseil.

import type { Langue } from '../config.ts';
import { textes } from '../i18n/index.ts';
import { premierePhoto, type Photo } from './images.ts';
import { minutesDeLecture, slugDe, titreDe, type Page } from './pages.ts';

export interface CarteDeConseil {
  titre: string;
  href: string;
  /** Les espèces du conseil : « Chien · Chat ». */
  surtitre: string;
  resume?: string;
  /** « 4 min de lecture ». */
  duree: string;
  photo?: Photo;
}

/** Ce que la carte d'un conseil affiche. Sans photo à son nom, le conseil prend celle de sa première espèce. */
export function carteDuConseil(page: Page, langue: Langue): CarteDeConseil {
  const t = textes(langue);
  const especes = page.data.especes ?? [];
  return {
    titre: titreDe(page),
    href: page.data.url,
    surtitre: especes.map((e) => t.especes[e]).join(' · '),
    resume: page.data.resume,
    duree: t.conseils.minutes(minutesDeLecture(page)),
    photo: premierePhoto([`conseil:${slugDe(page)}`, `espece:${especes[0] ?? 'chien'}`], langue),
  };
}
