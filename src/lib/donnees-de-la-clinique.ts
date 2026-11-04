// Les données d'une clinique qui changent souvent, écrites en HTML : horaires, fermetures,
// numéro de garde. Les composants (Horaires, AppelUrgence) et les blocs des pages Markdown
// passent par ces fonctions : une donnée s'affiche partout de la même façon.
//
// Dans une page Markdown, un bloc encadré par deux commentaires est remplacé à la construction
// par la valeur de la fiche de la clinique (docs/format-des-pages.md) :
//
//   <!-- donnees: horaires -->
//   - Lundi : 8 h à 12 h et 14 h à 18 h
//   <!-- /donnees -->
//
// Le texte entre les marqueurs est la valeur connue à la rédaction ; la fiche fait foi. Ce
// fichier est le seul à lire ces données : changer leur source ne touche que lui.

import type { Langue } from '../config.ts';
import { textes } from '../i18n/index.ts';
import type { Clinique } from './cliniques.ts';
import { echapper, lienTelephone } from './format.ts';
import { fermeturesAVenir, lignesDHoraires, texteDeFermeture } from './horaires.ts';

/** Les horaires en liste de définitions, avec la ligne « Ouvert maintenant » remplie dans le navigateur. */
export function htmlDesHoraires(clinique: Clinique, langue: Langue, statut = true): string {
  const lignes = lignesDHoraires(clinique.horaires, langue)
    .map((l) => `<div class="horaires__ligne${l.ferme ? ' horaires__ligne--ferme' : ''}"><dt>${echapper(l.jours)}</dt><dd>${echapper(l.plages)}</dd></div>`)
    .join('');
  const ligneDuStatut = statut
    ? `<p class="statut" data-statut-ouverture data-langue="${langue}" data-horaires="${echapper(JSON.stringify(clinique.horaires))}" data-fermetures="${echapper(JSON.stringify(clinique.fermetures))}" hidden><span class="statut__point" aria-hidden="true"></span><span data-statut-texte></span></p>`
    : '';
  return `<div class="horaires">${ligneDuStatut}<dl class="horaires__liste">${lignes}</dl>${htmlDesFermetures(clinique, langue)}</div>`;
}

/** Les fermetures annoncées et pas encore passées ; rien s'il n'y en a pas. */
export function htmlDesFermetures(clinique: Clinique, langue: Langue): string {
  const aVenir = fermeturesAVenir(clinique.fermetures);
  if (aVenir.length === 0) return '';
  const t = textes(langue).horaires;
  const lignes = aVenir.map((f) => `<li>${echapper(texteDeFermeture(f, langue))}</li>`).join('');
  return `<div class="fermetures"><p class="fermetures__titre">${t.fermetures}</p><ul>${lignes}</ul></div>`;
}

/** Le numéro de garde en une ligne : « Numéro de garde : 0900 904 904, appel surtaxé, 1,70 franc la minute ». */
export function htmlDeLaGarde(clinique: Clinique, langue: Langue): string {
  const t = textes(langue).urgence;
  const { telephone, tarif } = clinique.garde;
  return `<p class="garde"><span class="garde__croix" aria-hidden="true"></span><span>${t.garde}${langue === 'fr' ? ' ' : ''}: <a href="${lienTelephone(telephone.international)}">${echapper(telephone.affiche)}</a>, ${echapper(tarif[langue])}</span></p>`;
}

const BLOC = /<!--\s*donnees\s*:\s*([a-z]+)\s*-->([\s\S]*?)<!--\s*\/donnees\s*-->/g;
const TITRE_2 = /<h2[^>]*>([\s\S]*?)<\/h2>/g;

/** Le texte d'un fragment HTML, sans balises. */
function texteDe(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

/**
 * Remplace les blocs de données d'une page par la valeur de la fiche. La clinique d'un bloc est
 * celle de la page ; sur une page qui présente plusieurs cliniques (/cliniques/), c'est celle que
 * nomme le dernier titre ## qui précède le bloc (« ## Vetmint Payerne »).
 */
export function remplirLesDonnees(html: string, cliniques: Clinique[], langue: Langue, cliniqueDeLaPage?: string): string {
  const titres = [...html.matchAll(TITRE_2)].map((m) => ({ position: m.index, texte: texteDe(m[1]).toLowerCase() }));
  return html.replace(BLOC, (_bloc, type: string, _texte: string, position: number) => {
    const titre = titres.filter((t) => t.position < position).at(-1)?.texte;
    const id = cliniqueDeLaPage ?? cliniques.find((c) => c.nom.toLowerCase() === titre)?.id;
    const clinique = cliniques.find((c) => c.id === id);
    if (!clinique) throw new Error(`Bloc « donnees: ${type} » sans clinique : la page n'a pas de champ « clinique » et aucun titre ## ne nomme une clinique avant le bloc.`);
    if (type === 'horaires') return htmlDesHoraires(clinique, langue);
    if (type === 'fermetures') return htmlDesFermetures(clinique, langue);
    if (type === 'garde') return htmlDeLaGarde(clinique, langue);
    // Le bandeau s'affiche en haut de chaque page de la clinique, pas dans le texte.
    if (type === 'bandeau') return '';
    throw new Error(`Bloc de données inconnu : « ${type} ». Les blocs sont horaires, fermetures et garde.`);
  });
}
