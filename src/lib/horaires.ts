// Les horaires d'une clinique, dans le fuseau Europe/Zurich : lignes lisibles regroupées par
// jours, statut « ouvert maintenant ». Fonctions pures, utilisées à la construction et dans le
// navigateur (src/scripts/statut-ouverture.ts).

import { FUSEAU, type Langue } from '../config.ts';
import { textes } from '../i18n/index.ts';
import { formaterDate, formaterHeure, formaterPlage } from './format.ts';

export const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
export type Jour = (typeof JOURS)[number];

/** Les plages d'ouverture de chaque jour, « 08:00-12:00 » ; un jour vide est fermé. */
export type Horaires = Record<Jour, string[]>;

export interface Fermeture {
  du: string;
  au: string;
  motif?: { fr: string; de: string };
}

/** Une ligne d'horaires affichée : « Mercredi à vendredi », « 8 h à 12 h et 14 h à 18 h ». */
export interface LigneDHoraires {
  jours: string;
  plages: string;
  ferme: boolean;
}

/** Les jours qui ont les mêmes plages, regroupés quand ils se suivent. */
export function lignesDHoraires(horaires: Horaires, langue: Langue): LigneDHoraires[] {
  const t = textes(langue).horaires;
  const groupes: Jour[][] = [];
  for (const jour of JOURS) {
    const dernier = groupes.at(-1);
    if (dernier && horaires[dernier[0]].join() === horaires[jour].join()) dernier.push(jour);
    else groupes.push([jour]);
  }
  // En français, le second jour garde sa minuscule : « Mercredi à vendredi ».
  const ensuite = (jour: Jour) => (langue === 'de' ? t.jours[jour] : t.jours[jour].toLowerCase());
  return groupes.map((jours) => {
    const premier = t.jours[jours[0]];
    const dernier = ensuite(jours.at(-1)!);
    const lien = jours.length === 2 ? t.et : t.a;
    const plages = horaires[jours[0]];
    return {
      jours: jours.length === 1 ? premier : `${premier} ${lien} ${dernier}`,
      plages: plages.length ? plages.map((p) => formaterPlage(p, langue)).join(` ${t.et} `) : t.ferme,
      ferme: plages.length === 0,
    };
  });
}

export interface Instant {
  /** Date du jour à Zurich, AAAA-MM-JJ. */
  date: string;
  jour: Jour;
  /** Minutes écoulées depuis minuit, heure de Zurich. */
  minutes: number;
}

/** L'instant présent (ou la date donnée) vu depuis Zurich. */
export function instantAZurich(maintenant: Date = new Date()): Instant {
  const parties = new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSEAU,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(maintenant);
  const valeur = (type: string) => parties.find((p) => p.type === type)?.value ?? '0';
  const date = `${valeur('year')}-${valeur('month')}-${valeur('day')}`;
  return { date, jour: jourDeLaSemaine(date), minutes: Number(valeur('hour')) * 60 + Number(valeur('minute')) };
}

/** Le jour de la semaine d'une date AAAA-MM-JJ. */
export function jourDeLaSemaine(date: string): Jour {
  const [a, m, j] = date.split('-').map(Number);
  // getUTCDay : dimanche vaut 0
  return JOURS[(new Date(Date.UTC(a, m - 1, j)).getUTCDay() + 6) % 7];
}

function ajouterJours(date: string, nombre: number): string {
  const [a, m, j] = date.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, j + nombre)).toISOString().slice(0, 10);
}

function enMinutes(heure: string): number {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

function enHeure(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function plagesDuJour(horaires: Horaires, jour: Jour): [number, number][] {
  return (horaires[jour] ?? []).map((plage) => {
    const [debut, fin] = plage.split('-');
    return [enMinutes(debut), enMinutes(fin)];
  });
}

function estFermeLe(date: string, fermetures: Fermeture[]): boolean {
  return fermetures.some((f) => f.du <= date && date <= f.au);
}

/** Les fermetures qui ne sont pas encore passées. */
export function fermeturesAVenir(fermetures: Fermeture[], aujourdhui = instantAZurich().date): Fermeture[] {
  return fermetures.filter((f) => f.au >= aujourdhui);
}

/** Une fermeture en une ligne : « Fermé du 24 au 26 décembre 2026, fêtes de fin d'année ». */
export function texteDeFermeture(fermeture: Fermeture, langue: Langue): string {
  const t = textes(langue).horaires;
  const periode =
    fermeture.du === fermeture.au
      ? t.fermeLe(formaterDate(fermeture.du, langue))
      : t.fermeDuAu(formaterDate(fermeture.du, langue, false), formaterDate(fermeture.au, langue));
  return fermeture.motif ? `${periode}, ${fermeture.motif[langue]}` : periode;
}

export interface Statut {
  ouvert: boolean;
  texte: string;
}

/** « Ouvert maintenant, jusqu'à 12 h », « Fermé, ouvre à 13 h 45 », « Fermé, ouvre lundi à 8 h ». */
export function statutOuverture(horaires: Horaires, fermetures: Fermeture[], langue: Langue, instant: Instant = instantAZurich()): Statut {
  const t = textes(langue).horaires;
  const heure = (minutes: number) => formaterHeure(enHeure(minutes), langue);
  if (!estFermeLe(instant.date, fermetures)) {
    for (const [debut, fin] of plagesDuJour(horaires, instant.jour)) {
      if (instant.minutes >= debut && instant.minutes < fin) return { ouvert: true, texte: t.ouvertJusqua(heure(fin)) };
    }
    const plusTard = plagesDuJour(horaires, instant.jour).find(([debut]) => debut > instant.minutes);
    if (plusTard) return { ouvert: false, texte: t.fermeOuvreA(heure(plusTard[0])) };
  }
  for (let ecart = 1; ecart <= 30; ecart += 1) {
    const date = ajouterJours(instant.date, ecart);
    if (estFermeLe(date, fermetures)) continue;
    const jour = jourDeLaSemaine(date);
    const premiere = plagesDuJour(horaires, jour)[0];
    if (!premiere) continue;
    if (ecart === 1) return { ouvert: false, texte: t.fermeOuvreDemain(heure(premiere[0])) };
    const nomDuJour = langue === 'de' ? t.jours[jour] : t.jours[jour].toLowerCase();
    if (ecart < 7) return { ouvert: false, texte: t.fermeOuvreLe(nomDuJour, heure(premiere[0])) };
    return { ouvert: false, texte: t.fermeOuvreLeDate(formaterDate(date, langue, false), heure(premiere[0])) };
  }
  return { ouvert: false, texte: t.fermeTout };
}
