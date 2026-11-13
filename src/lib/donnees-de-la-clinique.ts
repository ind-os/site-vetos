// Les données d'une clinique qui changent souvent : horaires, statut d'ouverture, fermetures,
// bandeau d'annonce et numéro de garde. Les composants (Horaires, StatutOuverture,
// BandeauAnnonce, AppelUrgence) et les blocs des pages Markdown passent par ces fonctions pour
// les afficher : une donnée s'affiche partout de la même façon. Un autre fichier lit la fiche
// directement : src/lib/balisage.ts, les horaires pour schema.org.
//
// Dans une page Markdown, un bloc encadré par deux commentaires est remplacé à la construction
// par la valeur de la fiche de la clinique (docs/format-des-pages.md) :
//
//   <!-- donnees: horaires -->
//   - Lundi : 8 h à 12 h et 14 h à 18 h
//   <!-- /donnees -->
//
// Le texte entre les marqueurs est la valeur connue à la rédaction ; la fiche fait foi.

import type { Langue } from '../config.ts';
import { textes } from '../i18n/index.ts';
import type { Clinique } from './cliniques.ts';
import { echapper, lienTelephone } from './format.ts';
import { fermeturesAVenir, instantAZurich, lignesDHoraires, texteDeFermeture } from './horaires.ts';
import { texteDe } from './html.ts';

/**
 * La ligne « Ouvert maintenant, jusqu'à 12 h », vide et cachée dans la page : le navigateur la
 * remplit (src/scripts/statut-ouverture.ts) d'après les horaires et les fermetures qu'elle porte.
 */
export function htmlDuStatut(clinique: Clinique, langue: Langue): string {
  const horaires = echapper(JSON.stringify(clinique.horaires));
  const fermetures = echapper(JSON.stringify(clinique.fermetures));
  const alternance = clinique.alternance ? ` data-alternance="${echapper(JSON.stringify(clinique.alternance))}"` : '';
  return `<p class="statut" data-statut-ouverture data-langue="${langue}" data-horaires="${horaires}" data-fermetures="${fermetures}"${alternance} hidden><span class="statut__point" aria-hidden="true"></span><span data-statut-texte></span></p>`;
}

/** Les horaires en liste de définitions, sous la ligne du statut, avec les fermetures à venir. */
export function htmlDesHoraires(clinique: Clinique, langue: Langue): string {
  const lignes = lignesDHoraires(clinique.horaires, langue, clinique.alternance)
    .map((l) => `<div class="horaires__ligne${l.ferme ? ' horaires__ligne--ferme' : ''}"><dt>${echapper(l.jours)}</dt><dd>${echapper(l.plages)}</dd></div>`)
    .join('');
  return `<div class="horaires">${htmlDuStatut(clinique, langue)}<dl class="horaires__liste">${lignes}</dl>${htmlDesFermetures(clinique, langue)}</div>`;
}

/** Les fermetures annoncées et pas encore passées ; rien s'il n'y en a pas. */
function htmlDesFermetures(clinique: Clinique, langue: Langue): string {
  const aVenir = fermeturesAVenir(clinique.fermetures);
  if (aVenir.length === 0) return '';
  const t = textes(langue).horaires;
  const lignes = aVenir.map((f) => `<li>${echapper(texteDeFermeture(f, langue))}</li>`).join('');
  return `<div class="fermetures"><p class="fermetures__titre">${t.fermetures}</p><ul>${lignes}</ul></div>`;
}

/**
 * Le numéro de garde en une ligne, avec la croix : « En cas d'urgence en dehors des horaires
 * d'ouverture du cabinet, appelez le 026 466 34 35, numéro gratuit, de 8 h à minuit ». En « bloc », plus grand, en tête de la page Urgences.
 */
export function htmlDeLaGarde(clinique: Clinique, langue: Langue, forme: 'ligne' | 'bloc' = 'ligne'): string {
  const t = textes(langue).urgence;
  const { telephone, tarif, autre } = clinique.garde;
  // Une ligne par numéro ; un second service de garde de la région (`garde.autre`) vient sous son nom.
  // En français, une espace insécable précède les deux-points.
  const pointsFr = langue === 'fr' ? ' ' : '';
  // La première ligne est une phrase qui mène au numéro, sans deux-points : « En cas d'urgence…,
  // appelez le 026 466 34 35, numéro gratuit… ». Le second service garde son nom suivi de deux-points.
  const ligne = (debut: string, numero: typeof telephone, prix: string) =>
    `<span class="garde__ligne">${debut} <a href="${lienTelephone(numero.international)}">${echapper(numero.affiche)}</a>, ${echapper(prix)}</span>`;
  const lignes = ligne(t.garde, telephone, tarif[langue]) + (autre ? ligne(`${echapper(autre.nom)}${pointsFr}:`, autre.telephone, autre.tarif[langue]) : '');
  return `<p class="garde${forme === 'bloc' ? ' garde--bloc' : ''}"><span class="croix" aria-hidden="true"></span><span>${lignes}</span></p>`;
}

/** Le bandeau d'annonce de la clinique s'il s'affiche aujourd'hui : il disparaît après sa date `jusqu_au`. */
export function bandeauDuJour(clinique: Clinique): NonNullable<Clinique['bandeau']> | undefined {
  const { bandeau } = clinique;
  if (!bandeau || (bandeau.jusqu_au && bandeau.jusqu_au < instantAZurich().date)) return undefined;
  return bandeau;
}

const BLOC = /<!--\s*donnees\s*:\s*([a-z]+)\s*-->([\s\S]*?)<!--\s*\/donnees\s*-->/g;
const TITRE_2 = /<h2[^>]*>([\s\S]*?)<\/h2>/g;

/**
 * Remplace les blocs de données d'une page par la valeur de la fiche. La clinique d'un bloc est
 * celle de la page ; sur une page qui présente plusieurs cliniques (/cabinets/), c'est celle que
 * nomme le dernier titre ## qui précède le bloc (« ## Vetmint Payerne »). `idDeLaPage` est
 * l'identifiant de la page, « fr/cliniques », nommé dans les messages d'erreur.
 */
export function remplirLesDonnees(html: string, cliniques: Clinique[], langue: Langue, idDeLaPage: string, cliniqueDeLaPage?: string): string {
  const fichier = `src/content/pages/${idDeLaPage}.md`;
  const titres = [...html.matchAll(TITRE_2)].map((m) => ({ position: m.index, texte: texteDe(m[1]).toLowerCase() }));
  return html.replace(BLOC, (_bloc, type: string, _texte: string, position: number) => {
    const titre = titres.filter((t) => t.position < position).at(-1)?.texte;
    const id = cliniqueDeLaPage ?? cliniques.find((c) => c.nom.toLowerCase() === titre)?.id;
    const clinique = cliniques.find((c) => c.id === id);
    if (!clinique) throw new Error(`${fichier} : le bloc « donnees: ${type} » n'a pas de cabinet. La page n'a pas de champ « clinique » et aucun titre ## ne nomme un cabinet avant le bloc.`);
    if (type === 'horaires') return htmlDesHoraires(clinique, langue);
    if (type === 'fermetures') return htmlDesFermetures(clinique, langue);
    if (type === 'garde') return htmlDeLaGarde(clinique, langue);
    throw new Error(`${fichier} : bloc de données inconnu « ${type} ». Les blocs sont horaires, fermetures et garde.`);
  });
}
