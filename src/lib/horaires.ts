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

/**
 * Un jour ouvert en alternance avec une autre clinique, environ une semaine sur deux :
 * « Samedi : 8 h 30 à 15 h, environ un samedi sur deux… ». Les plages ne comptent pas dans le
 * statut d'ouverture, qui dit ce jour-là d'appeler avant de venir.
 */
export interface Alternance {
  jour: Jour;
  plages: string[];
  avec: string;
}

export interface Fermeture {
  du: string;
  au: string;
  motif?: { fr: string; de: string };
}

/** Une ligne d'horaires affichée : « Mercredi à vendredi », « 8 h à 12 h et 14 h à 18 h ». */
interface LigneDHoraires {
  jours: string;
  plages: string;
  ferme: boolean;
}

/** Les jours qui ont les mêmes plages, regroupés quand ils se suivent. */
export function lignesDHoraires(horaires: Horaires, langue: Langue, alternance?: Alternance): LigneDHoraires[] {
  const t = textes(langue).horaires;
  // Les plages « HH:MM-HH:MM » se trient comme du texte : de la plus tôt à la plus tard. Le jour
  // en alternance forme sa propre ligne.
  const plagesTriees = (jour: Jour) => (alternance?.jour === jour ? ['alternance'] : [...horaires[jour]].sort());
  const groupes: Jour[][] = [];
  for (const jour of JOURS) {
    const dernier = groupes.at(-1);
    if (dernier && plagesTriees(dernier[0]).join() === plagesTriees(jour).join()) dernier.push(jour);
    else groupes.push([jour]);
  }
  // En français, le second jour garde sa minuscule : « Mercredi à vendredi ».
  const ensuite = (jour: Jour) => (langue === 'de' ? t.jours[jour] : t.jours[jour].toLowerCase());
  return groupes.map((jours) => {
    const premier = t.jours[jours[0]];
    if (alternance && jours[0] === alternance.jour) {
      const plages = [...alternance.plages].sort().map((p) => formaterPlage(p, langue)).join(` ${t.et} `);
      return { jours: premier, plages: t.alternance(plages, ensuite(alternance.jour), alternance.avec), ferme: false };
    }
    const dernier = ensuite(jours.at(-1)!);
    const lien = jours.length === 2 ? t.et : t.a;
    const plages = plagesTriees(jours[0]);
    return {
      jours: jours.length === 1 ? premier : `${premier} ${lien} ${dernier}`,
      plages: plages.length ? plages.map((p) => formaterPlage(p, langue)).join(` ${t.et} `) : t.ferme,
      ferme: plages.length === 0,
    };
  });
}

interface Instant {
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
function jourDeLaSemaine(date: string): Jour {
  const [a, m, j] = date.split('-').map(Number);
  // getUTCDay : dimanche vaut 0
  return JOURS[(new Date(Date.UTC(a, m - 1, j)).getUTCDay() + 6) % 7];
}

function ajouterJours(date: string, nombre: number): string {
  const [a, m, j] = date.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, j + nombre)).toISOString().slice(0, 10);
}

/** Les minutes depuis minuit d'une heure « 08:30 ». */
export function enMinutes(heure: string): number {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

function enHeure(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

/** Les plages d'un jour en minutes depuis minuit, de la plus tôt à la plus tard. */
function plagesDuJour(horaires: Horaires, jour: Jour): [number, number][] {
  return (horaires[jour] ?? [])
    .map((plage): [number, number] => {
      const [debut, fin] = plage.split('-');
      return [enMinutes(debut), enMinutes(fin)];
    })
    .sort((a, b) => a[0] - b[0]);
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

interface Statut {
  ouvert: boolean;
  texte: string;
}

/** « Ouvert maintenant, jusqu'à 12 h », « Fermé, ouvre à 13 h 45 », « Fermé, ouvre lundi à 8 h ». */
export function statutOuverture(horaires: Horaires, fermetures: Fermeture[], langue: Langue, instant: Instant = instantAZurich(), alternance?: Alternance): Statut {
  const t = textes(langue).horaires;
  const heure = (minutes: number) => formaterHeure(enHeure(minutes), langue);
  if (alternance?.jour === instant.jour && !estFermeLe(instant.date, fermetures)) return { ouvert: false, texte: t.appelerAvant };
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
