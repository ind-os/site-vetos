// Vérifie les pages Markdown du site (src/content/pages/) contre la charte de rédaction
// (docs/charte-redactionnelle.md) et le format des pages (docs/format-des-pages.md).
//
//   node outils/verifier-les-pages.mjs [--doublons] [--seuil N] [page.md …]
//
// Sans page nommée, le script vérifie toutes les pages, en français et en allemand, et n'affiche
// que celles qui ont une erreur ou une alerte, puis le bilan. Avec des pages nommées, il affiche le
// rapport complet de chacune.
// Une page française passe tous les contrôles. Une page allemande (dossier de/) passe les contrôles
// de forme (en-tête, title, description, titres, volume, liens, HTML, images, texte commun) ; les
// règles de style, propres au français, ne s'appliquent pas.
//
// Options :
//   --doublons  mesure aussi la part de texte commune (groupes de six mots) avec chaque autre page
//               de la même langue. Plus lent : sert à la rédaction d'une page et à l'audit.
//   --seuil N   part de texte commun tolérée, en pour cent (20 par défaut).
//
// Contrôles : en-tête, volume du corps selon le type de page, title, description, H1 unique,
// niveaux de titres, orthographe de « vétérinaire », liens obligatoires, mots et tournures
// interdits, phrases longues, passages sans intertitre, fait laissé « [à préciser » dans le texte,
// HTML et images dans le corps et, avec --doublons, part de texte commune avec chaque autre page.
//
// Code de sortie : 0 si aucune erreur, 1 sinon. Les alertes ne comptent pas comme des erreurs.
// Node seul, sans dépendance.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { TYPES_DE_PAGE, TYPES_DE_PAGE_DE_CLINIQUE } from '../src/lib/types-de-page.ts';

const RACINE = fileURLToPath(new URL('..', import.meta.url));
const PAGES = join(RACINE, 'src', 'content', 'pages');
const FICHES = join(RACINE, 'src', 'donnees', 'cliniques');
const TAILLE_BARDEAU = 6;
const USAGE = 'Usage : node outils/verifier-les-pages.mjs [--doublons] [--seuil N] [page.md …]';

// Fourchettes de mots par type de page.
const VOLUMES = {
  'accueil-clinique': [900, 1400],
  'services-clinique': [70, 400],
  'equipe': [500, 1500],
  'urgences': [700, 1200],
  'contact': [400, 900],
  'rendez-vous': [250, 600],
  'questions-frequentes': [600, 1000],
  'tarifs': [500, 1300],
  'abonnements': [600, 1300],
  'service-clinique': [600, 1100],
  'service': [1200, 2100],
  'accueil-groupe': [700, 1000],
  'cliniques': [400, 1300],
  'urgences-groupe': [800, 2000],
  'conseil': [600, 1600],
  'simple': [200, 1800],
  'service-index': [250, 600],
  'conseil-index': [200, 500],
  'conseil-categorie': [150, 500],
};

// Liens obligatoires des pages françaises, par type : [libellé, expression régulière sur le href].
// « {c} » est remplacé par l'identifiant de la clinique de la page.
const LIENS_OBLIGATOIRES = {
  'services-clinique': [
    ['rendez-vous', '^/{c}/rendez-vous/$'], ['tarifs', '^/{c}/tarifs/$'], ['téléphone', '^tel:'],
  ],
  'accueil-clinique': [
    ['rendez-vous', '^/{c}/rendez-vous/$'], ['équipe', '^/{c}/equipe/$'], ['contact', '^/{c}/contact/$'],
    ['urgences', '^/{c}/urgences/$'], ['tarifs', '^/{c}/tarifs/$'], ['une page de service de la clinique', '^/{c}/services/'],
    ['téléphone', '^tel:'],
  ],
  'equipe': [['rendez-vous', '^/{c}/rendez-vous/$'], ['emploi', '^/emploi/$']],
  'urgences': [
    ['téléphone de la clinique', '^tel:\\+41'], ['numéro de garde ou second numéro', '^tel:'], ['contact', '^/{c}/contact/$'],
    ['tarifs', '^/{c}/tarifs/$'],
  ],
  'contact': [['rendez-vous', '^/{c}/rendez-vous/$'], ['urgences', '^/{c}/urgences/$'], ['téléphone', '^tel:'], ['e-mail', '^mailto:']],
  'rendez-vous': [['téléphone', '^tel:'], ['urgences', '^/{c}/urgences/$'], ['contact', '^/{c}/contact/$']],
  'questions-frequentes': [['rendez-vous', '^/{c}/rendez-vous/$']],
  'tarifs': [['abonnements', '^/{c}/abonnements/$'], ['une page de service de la clinique', '^/{c}/services/'], ['rendez-vous', '^/{c}/rendez-vous/$']],
  'abonnements': [['tarifs', '^/{c}/tarifs/$'], ['rendez-vous', '^/{c}/rendez-vous/$']],
  'service-clinique': [
    ['page commune du service', '^/services/[a-z-]+/$'], ['rendez-vous', '^/{c}/rendez-vous/$'], ['tarifs', '^/{c}/tarifs/$'],
  ],
  'service': [['cabinets', '^/cabinets/$']],
  'accueil-groupe': [['cabinets', '^/cabinets/$'], ['conseils', '^/conseils/'], ['emploi', '^/emploi/$']],
  'conseil': [['une page de service', '^/services/'], ['rendez-vous ou cabinets', '^(/[a-z]+/rendez-vous/|/cabinets/)$'], ['un autre conseil', '^/conseils/']],
};

// Tournures interdites par les règles d'écriture : erreur.
const INTERDITS = [
  ['tiret cadratin', /—/],
  ['tiret demi-cadratin', /–/],
  ['virgule avant « et »', /,\s+et\s/],
  ['« permet de »', /\bpermet(?:tent|tant|tra|trait)?\s+(?:de|d')\b/],
  ["point d'exclamation", /!/],
];
// Mots et tournures à éviter (charte, section 2.3) : alerte.
const A_EVITER = [
  ['méta-texte', /\b(?:ci-dessous|ci-dessus|voici|voilà|cliquez|n'hésitez pas|découvrez|retrouvez|sur cette page|en trois points)\b/],
  ['connecteur soutenu', /\b(?:néanmoins|toutefois|en outre|par ailleurs|il convient|force est de|notons que)\b/],
  ['mot de nouveauté ou de temps relatif', /\b(?:désormais|dorénavant|dès maintenant|nouveauté|au lieu de|contrairement à avant|cette année)\b/],
  ['adjectif de valeur', /\b(?:optimal|optimale|idéal|idéale|performant|performante|moderne|flambant neuf|dernier cri|à la pointe|innovant|innovante|unique|exceptionnel|exceptionnelle|exclusif|exclusive|supérieur|supérieure|le meilleur|la meilleure|talentueux|éminent|réputé|formidable|dévoué|dévoués|dévouée|passionné|passionnés|passionnée|qualitatif|qualitatifs)\b/],
  ['mot de remplissage', /\b(?:philosophie|prise en charge|prodiguer|prodigue|proprement dite|dans les meilleurs délais|sérénité|convivial|conviviale|chaleureux|chaleureuse|bienveillant|bienveillante)\b/],
  ['anglicisme', /\b(?:monitoring|microchip|check-up|online|update|team)\b/],
  ['périphrase animale', /\b(?:quatre pattes|protégés|boule de poils|loulou|minette|toutou)\b/],
  ['slogan', /Soigner\. Écouter\. Prévenir|vent de fra[iî]cheur|Protéger (?:&|et) Soigner/],
  ['points de suspension', /\.\.\.|…/],
];
const SIGLES = new Set(['NAC', 'CHF', 'FIV', 'FELV', 'ANIS', 'AMICUS', 'CFF', 'GST', 'SVS', 'PCR', 'VHD', 'RHD', 'SMS', 'TWINT', 'IRM', 'AMV', 'CFC', 'CEAV', 'TTC', 'AVS', 'AOC', 'TPF', 'TL', 'MBC', 'CGN', 'TRN', 'TPC', 'TPN', 'VMCV', 'ISME', 'ECBU', 'CPV', 'FPV', 'CHUV', 'HCC']);

// Noms de lieux, remplacés par « ville » avant de mesurer le texte commun : deux pages qui ne
// diffèrent que par la ville comptent comme du texte commun. Le texte est déjà sans accents.
const VILLES = [
  /\bla chaux[- ]de[- ]fonds\b/, /\bchaux[- ]de[- ]fonds\b/, /\bfribourg[- ]ouest\b/, /\bfribourg\b/, /\bgivisiez\b/,
  /\blac[- ]de[- ]joux\b/, /\bl ?'?abbaye\b/, /\b(?:saint|st)[- ]blaise\b/, /\b(?:saint|st)[- ]legier(?:[- ]la[- ]chiesaz)?\b/,
  /\bbussigny\b/, /\bdomdidier\b/, /\bpayerne\b/,
];

// Une lettre, un chiffre ou « _ », accents compris.
const LETTRE = '[\\p{L}\\p{N}_]';
// La limite d'un mot. En JavaScript, \b ne connaît que les lettres sans accent : le « é » de
// « vétérinaire » y serait une limite de mot. avecAccents() remplace \b par cette limite.
const LIMITE = `(?:(?<=${LETTRE})(?!${LETTRE})|(?<!${LETTRE})(?=${LETTRE}))`;

/** L'expression régulière donnée, où \b connaît les lettres accentuées. */
function avecAccents(expression, drapeaux = '') {
  return new RegExp(expression.source.replaceAll('\\b', LIMITE), `${drapeaux}u`);
}

const REGLES_INTERDITES = INTERDITS.map(([libelle, motif]) => [libelle, avecAccents(motif, 'g')]);
const REGLES_A_EVITER = A_EVITER.map(([libelle, motif]) => [libelle, avecAccents(motif, 'gi')]);
const MOTIFS_VILLES = VILLES.map((motif) => avecAccents(motif, 'g'));
const MOTIF_VETERINAIRE = avecAccents(/\b(v[eéè]t[eéè]rr?in+aires?)\b/, 'gi');
const MOTIF_MARQUE = avecAccents(/\bVetMint\b|\bVETMINT\b|\bvetMint\b/, 'g');
const MOTIF_NOUVEAU = avecAccents(/\bnouveau\b|\bnouvelle\b|\bnouveaux\b|\bnouvelles\b/, 'gi');
const MOTIF_CAPITALES = avecAccents(/\b[A-ZÉÈÀÂÎÔÛÇ]{3,}\b/, 'g');
const MOTIF_ABREVIATION = avecAccents(/\b(Dr|Dre|M|Mme|etc|p|ex|av|rte|ch)\./, 'g');
const MOTIF_PRECISER = /\[(?:à|a|À|A) préciser[^\]]*\]/gu;
const MOTIF_LIEN = /(?<!!)\[([^\]]*)\]\(([^)"]+?)(?:\s+"[^"]*")?\)/gu;
const MOTIF_IMAGE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/gu;
const MOTIF_TITRE = /^(#{1,6})\s+(.*?)\s*#*\s*$/u;
// Une balise HTML ouvrante ou fermante ; les commentaires <!-- … --> sont retirés avant.
const MOTIF_BALISE = /<\/?[A-Za-z][^<>]*>/gu;
// Une image Markdown, quelle que soit sa forme.
const MOTIF_IMAGE_DU_CORPS = /!\[[^\]]*\]\([^)]*\)/gu;

/** Les cliniques, d'après leur fiche (src/donnees/cliniques/) : identifiant → { lieu, urgences }. */
function lireLesCliniques() {
  const cliniques = new Map();
  for (const nom of readdirSync(FICHES).filter((nom) => nom.endsWith('.json')).sort()) {
    const fiche = JSON.parse(readFileSync(join(FICHES, nom), 'utf8'));
    cliniques.set(fiche.id, { lieu: fiche.lieu, urgences: fiche.urgences === true });
  }
  return cliniques;
}

/** Trie des chemins dossier par dossier : « conseils/chat.md » vient avant « conseils.md ». */
function trierLesChemins(chemins) {
  return chemins.sort((a, b) => {
    const [cleA, cleB] = [a.split(sep).join('\0'), b.split(sep).join('\0')];
    return cleA < cleB ? -1 : cleA > cleB ? 1 : 0;
  });
}

/** Les fichiers Markdown d'un dossier et de ses sous-dossiers, triés. */
function fichiersMarkdown(dossier) {
  const fichiers = readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) return fichiersMarkdown(chemin);
    return nom.endsWith('.md') ? [chemin] : [];
  });
  return trierLesChemins(fichiers);
}

/** Le contenu d'un fichier, fins de ligne Windows ramenées à « \n ». */
function lireFichier(chemin) {
  return readFileSync(chemin, 'utf8').replace(/\r\n?/g, '\n');
}

/**
 * Lit un en-tête YAML simple : clés scalaires et listes à un niveau.
 * Retourne { entete, corps, ligneDuCorps } : entete vaut null sans en-tête ; ligneDuCorps est le
 * numéro, dans le fichier, de la première ligne du corps.
 */
function lireFrontmatter(texte) {
  const fin = texte.startsWith('---') ? texte.indexOf('\n---', 3) : -1;
  if (fin < 0) return { entete: null, corps: texte, ligneDuCorps: 1 };
  const bloc = texte.slice(3, fin).replace(/^\n+|\n+$/g, '');
  const corps = texte.slice(fin + 4);
  const ligneDuCorps = texte.slice(0, fin + 4).split('\n').length;
  const entete = {};
  let cleCourante = null;
  for (const brute of bloc.split('\n')) {
    const ligne = brute.trimEnd();
    if (!ligne.trim() || ligne.trim().startsWith('#')) continue;
    if (/^[ \t]/.test(ligne) && ligne.trim().startsWith('- ') && cleCourante) {
      if (!Array.isArray(entete[cleCourante])) entete[cleCourante] = [];
      entete[cleCourante].push(nettoyerValeur(ligne.trim().slice(2)));
      continue;
    }
    const m = ligne.match(/^([A-Za-z_][\p{L}\p{N}_-]*)\s*:\s*(.*)$/u);
    if (!m) continue;
    cleCourante = m[1];
    const valeur = nettoyerValeur(m[2]);
    entete[cleCourante] = valeur !== '' ? valeur : null;
  }
  return { entete, corps, ligneDuCorps };
}

/** Enlève guillemets et commentaire de fin de ligne d'une valeur YAML. */
function nettoyerValeur(brute) {
  const valeur = brute.trim();
  for (const guillemet of ['"', "'"]) {
    if (valeur.startsWith(guillemet) && valeur.split(guillemet).length > 2) {
      return valeur.slice(1, valeur.lastIndexOf(guillemet));
    }
  }
  return valeur.replace(/\s+#.*$/u, '').trim();
}

/** Retire les commentaires <!-- … --> en gardant leurs retours à la ligne : les numéros de ligne restent ceux du fichier. */
function enleverCommentaires(corps) {
  return corps.replace(/<!--[\s\S]*?-->/g, (commentaire) => commentaire.replace(/[^\n]/g, ''));
}

/** Transforme du Markdown en texte lisible : titres gardés, images retirées, liens réduits à leur texte. */
function texteVisible(markdown) {
  const lignes = [];
  let dansCode = false;
  for (const brute of markdown.split('\n')) {
    if (brute.trim().startsWith('```')) {
      dansCode = !dansCode;
      continue;
    }
    if (dansCode) continue;
    // Ligne de séparation d'un tableau : |---|---|
    if (/^\s*\|?\s*:?-{3,}/u.test(brute) && brute.includes('|')) continue;
    const ligne = brute
      .replace(MOTIF_IMAGE, '')
      .replace(MOTIF_LIEN, '$1')
      .replace(/<[^>]+>/gu, '')
      .replace(MOTIF_TITRE, '$2')
      .replace(/^\s*(?:[-*+]|\d+[.)])\s+/u, '')
      .replace(/^\s*>\s?/u, '')
      .replaceAll('|', ' ')
      .replace(/[*_`]+/gu, '');
    lignes.push(ligne);
  }
  return lignes.join('\n');
}

function compterMots(texte) {
  return texte.split(/\s+/u).filter((mot) => /[\p{L}\p{N}_]/u.test(mot)).length;
}

/** Le texte sans accents ni autre caractère hors de l'ASCII, en minuscules. */
function sansAccents(texte) {
  return texte.normalize('NFKD').replace(/[^\x00-\x7F]/g, '').toLowerCase();
}

/** Minuscules, sans accents, sans ponctuation, villes remplacées par « ville ». */
function normaliser(texte) {
  let resultat = sansAccents(texte);
  for (const motif of MOTIFS_VILLES) resultat = resultat.replace(motif, ' ville ');
  return resultat.match(/[a-z0-9]+/g) ?? [];
}

/** Minuscules, sans accents, sans ponctuation. */
function normaliserSansVilles(texte) {
  return sansAccents(texte).match(/[a-z0-9]+/g) ?? [];
}

/** Les groupes de six mots qui se suivent. */
function bardeaux(mots) {
  const groupes = new Set();
  for (let i = 0; i + TAILLE_BARDEAU <= mots.length; i++) groupes.add(mots.slice(i, i + TAILLE_BARDEAU).join(' '));
  return groupes;
}

/** Découpe en phrases, ligne par ligne, en protégeant quelques abréviations. */
function phrases(texte) {
  const resultat = [];
  for (const brute of texte.split('\n')) {
    const ligne = brute.trim();
    if (!ligne) continue;
    const protegee = ligne.replace(MOTIF_ABREVIATION, '$1<pt>').replace(/(\d)\.(\d)/g, '$1<pt>$2');
    for (const morceau of protegee.split(/(?<=[.?!])\s+/u)) {
      const phrase = morceau.replaceAll('<pt>', '.').trim();
      if (phrase) resultat.push(phrase);
    }
  }
  return resultat;
}

/** Les cibles des liens du corps. */
function ciblesDesLiens(corps) {
  return [...corps.matchAll(MOTIF_LIEN)].map((m) => m[2].trim());
}

/** Jusqu'à trois passages du texte autour des occurrences du motif. */
function extraits(texte, motif) {
  return [...texte.matchAll(motif)].slice(0, 3).map((m) => {
    const debut = Math.max(0, m.index - 25);
    const fin = Math.min(texte.length, m.index + m[0].length + 25);
    return `…${texte.slice(debut, fin).replaceAll('\n', ' ')}…`;
  }).join(' ; ');
}

/** Le nombre de caractères, accents et symboles comptés pour un. */
function longueur(texte) {
  return [...texte].length;
}

/** Une valeur de l'en-tête, citée dans un message. */
function citer(valeur) {
  return valeur == null ? 'aucun' : `'${valeur}'`;
}

/** Le chemin d'un fichier depuis la racine du dépôt, avec des « / ». */
function cheminDuDepot(chemin) {
  return relative(RACINE, chemin).split(sep).join('/');
}

/** Vrai pour une page allemande : son fichier est dans un dossier de/. */
function estAllemand(chemin) {
  return `/${cheminDuDepot(chemin)}`.includes('/de/');
}

// Les groupes de six mots des pages de chaque langue, calculés une fois pour --doublons.
const PAGES_PAR_LANGUE = new Map();

/** Les pages d'un dossier de langue, avec leurs groupes de six mots. */
function pagesDeLaLangue(dossier) {
  if (!PAGES_PAR_LANGUE.has(dossier)) {
    PAGES_PAR_LANGUE.set(dossier, fichiersMarkdown(dossier).map((chemin) => {
      const { corps } = lireFrontmatter(lireFichier(chemin));
      const nom = relative(dossier, chemin).split(sep).join('/');
      return { chemin, nom, groupes: bardeaux(normaliser(texteVisible(enleverCommentaires(corps)))) };
    }));
  }
  return PAGES_PAR_LANGUE.get(dossier);
}

/** Vérifie une page. Retourne son rapport : erreurs, alertes et informations. */
function verifier(chemin, cliniques, seuil, mesurerDoublons) {
  const rapport = { chemin, erreurs: [], alertes: [], infos: [] };
  const erreur = (texte) => rapport.erreurs.push(texte);
  const alerte = (texte) => rapport.alertes.push(texte);
  const info = (texte) => rapport.infos.push(texte);

  let texte;
  try {
    texte = lireFichier(chemin);
  } catch (probleme) {
    erreur(`lecture impossible : ${probleme.message}`);
    return rapport;
  }

  const lu = lireFrontmatter(texte);
  const fm = lu.entete ?? {};
  if (!lu.entete) erreur('en-tête YAML absent (le fichier doit commencer par ---)');
  // Une valeur qui contient « : » s'écrit entre guillemets, sinon le YAML est invalide
  texte.split('\n---')[0].split('\n').forEach((ligne, i) => {
    const m = ligne.match(/^\s*(?:- |[A-Za-z_][\p{L}\p{N}_-]*:\s+)(.*)$/u);
    if (m && m[1].includes(': ') && !/^["']/.test(m[1])) {
      erreur(`en-tête, ligne ${i + 1} : une valeur qui contient « : » se met entre guillemets`);
    }
  });
  const corps = enleverCommentaires(lu.corps);
  const lignesDuCorps = corps.split('\n');

  // Langue, d'après le dossier du fichier ou l'adresse
  const allemand = estAllemand(chemin) || (fm.url ?? '').startsWith('/de/');

  // Frontmatter
  const typePage = fm.type;
  if (!TYPES_DE_PAGE.includes(typePage)) {
    erreur(`type de page inconnu : ${citer(typePage)} (attendu : ${TYPES_DE_PAGE.join(', ')})`);
  }
  const clinique = fm.clinique;
  const estClinique = TYPES_DE_PAGE_DE_CLINIQUE.includes(typePage);
  const fiche = cliniques.get(clinique);
  if (estClinique && !fiche) {
    erreur(`champ clinique absent ou inconnu : ${citer(clinique)} (attendu : ${[...cliniques.keys()].join(', ')})`);
  }
  if (!estClinique && clinique) alerte(`champ clinique renseigné (${clinique}) sur une page commune`);
  for (const champ of ['url', 'title', 'description', 'recherche', 'redige_le']) {
    if (!fm[champ]) erreur(`champ ${champ} absent du frontmatter`);
  }

  const title = fm.title ?? '';
  const description = fm.description ?? '';
  const h1 = fm.h1 || title;

  // Title
  const lt = longueur(title);
  if (lt > 60) erreur(`title de ${lt} caractères (60 au plus) : ${title}`);
  else if (lt && lt < 20) alerte(`title très court (${lt} caractères)`);
  else info(`title : ${lt} caractères`);
  if (estClinique && fiche && !title.toLowerCase().includes(fiche.lieu.toLowerCase())) {
    erreur(`le title ne contient pas « ${fiche.lieu} »`);
  }
  if (!estClinique && typePage && !title.toLowerCase().includes('vetmint')) {
    alerte("le title d'une page commune ne contient pas « Vetmint »");
  }

  // Description
  const ld = longueur(description);
  if (ld && (ld < 140 || ld > 165)) erreur(`description de ${ld} caractères (150 à 160 attendus, 140 à 165 tolérés)`);
  else if (ld && (ld < 150 || ld > 160)) alerte(`description de ${ld} caractères (150 à 160 visés)`);
  else if (ld) info(`description : ${ld} caractères`);

  // Titres du corps
  const titres = [];
  lignesDuCorps.forEach((ligne, i) => {
    const m = ligne.match(MOTIF_TITRE);
    if (m) titres.push({ niveau: m[1].length, texte: m[2], ligne: lu.ligneDuCorps + i });
  });
  const nbH1 = (h1 ? 1 : 0) + titres.filter((titre) => titre.niveau === 1).length;
  if (nbH1 !== 1) erreur(`${nbH1} H1 (un seul attendu : le H1 vient du frontmatter, le corps n'en contient pas)`);
  else info(`H1 : ${h1}`);
  let niveauPrecedent = 1;
  for (const titre of titres) {
    if (titre.niveau > niveauPrecedent + 1) {
      erreur(`saut de niveau de titre ligne ${titre.ligne} : H${niveauPrecedent} puis H${titre.niveau} « ${titre.texte} »`);
    }
    niveauPrecedent = titre.niveau;
  }

  // HTML et images : une page s'écrit en Markdown, les gabarits placent les blocs et les photos
  lignesDuCorps.forEach((ligne, i) => {
    for (const [balise] of ligne.matchAll(MOTIF_BALISE)) {
      erreur(`HTML dans le corps, ligne ${lu.ligneDuCorps + i} : ${balise} ; une page s'écrit en Markdown, les blocs viennent des gabarits`);
    }
    for (const _ of ligne.matchAll(MOTIF_IMAGE_DU_CORPS)) {
      erreur(`image dans le corps, ligne ${lu.ligneDuCorps + i} : les gabarits placent les photos (docs/format-des-pages.md)`);
    }
  });

  // Texte visible et volume
  const visible = texteVisible(corps);
  const visibleSansMarqueurs = visible.replace(MOTIF_PRECISER, ' ');
  const mots = compterMots(visibleSansMarqueurs);
  if (Object.hasOwn(VOLUMES, typePage)) {
    let [bas, haut] = VOLUMES[typePage];
    if (allemand) [bas, haut] = [Math.trunc(bas * 0.8), Math.trunc(haut * 1.3)];
    if (mots < bas || mots > haut) erreur(`${mots} mots dans le corps, fourchette du type ${typePage} : ${bas} à ${haut}`);
    else info(`${mots} mots dans le corps (fourchette ${bas} à ${haut})`);
  }

  // Passages sans intertitre
  let plusLong = 0;
  for (const segment of corps.split(/^#{1,6}\s+.*$/mu)) {
    plusLong = Math.max(plusLong, compterMots(texteVisible(segment).replace(MOTIF_PRECISER, ' ')));
  }
  if (plusLong > 300) {
    alerte(`un passage sans intertitre fait ${plusLong} mots (300 au plus, un intertitre toutes les 200 à 300 mots)`);
  }

  // Phrases
  const corpsSansTitres = corps.replace(/^#{1,6}\s+.*$/gmu, '');
  const listePhrases = phrases(texteVisible(corpsSansTitres).replace(MOTIF_PRECISER, ' '));
  if (listePhrases.length) {
    const longueurs = listePhrases.map(compterMots);
    const moyenne = longueurs.reduce((somme, n) => somme + n, 0) / longueurs.length;
    info(`${listePhrases.length} phrases, ${moyenne.toFixed(1)} mots en moyenne`);
    const longues = listePhrases.map((phrase, i) => [longueurs[i], phrase]).filter(([n]) => n > 30);
    for (const [n, phrase] of longues.slice(0, 8)) {
      alerte(`phrase de ${n} mots : « ${[...phrase].slice(0, 90).join('')}… »`);
    }
    if (moyenne > 20) alerte(`phrases de ${moyenne.toFixed(1)} mots en moyenne (20 visés)`);
  }

  // Orthographe et marque, sur tout le fichier
  const h1Distinct = h1 !== title ? h1 : '';
  const tout = `${title}\n${description}\n${h1Distinct}\n${corps}`;
  const fautes = allemand ? [] : [...new Set([...tout.matchAll(MOTIF_VETERINAIRE)].map((m) => m[1]))]
    .filter((mot) => !['vétérinaire', 'vétérinaires'].includes(mot.toLowerCase()))
    .sort();
  if (fautes.length) erreur(`orthographe de « vétérinaire » : ${fautes.join(', ')}`);
  const marques = [...new Set([...tout.matchAll(MOTIF_MARQUE)].map((m) => m[0]))].sort();
  if (marques.length) erreur(`la marque s'écrit « Vetmint » : ${marques.join(', ')}`);

  // Tournures interdites et mots à éviter (hors URL des liens et hors marqueurs)
  const texteRegles = `${title}\n${description}\n${h1Distinct}\n${texteVisible(corps)}`.replace(MOTIF_PRECISER, ' ');
  if (!allemand) {
    for (const [libelle, motif] of REGLES_INTERDITES) {
      const nombre = [...texteRegles.matchAll(motif)].length;
      if (nombre) erreur(`${libelle} (${nombre}) : ${extraits(texteRegles, motif)}`);
    }
    for (const [libelle, motif] of REGLES_A_EVITER) {
      const nombre = [...texteRegles.matchAll(motif)].length;
      if (nombre) alerte(`${libelle} (${nombre}) : ${extraits(texteRegles, motif)}`);
    }
    const nouveau = [...texteRegles.matchAll(MOTIF_NOUVEAU)].length;
    const nouveauNac = [...texteRegles.matchAll(/nouveaux animaux de compagnie/giu)].length;
    if (nouveau > nouveauNac) {
      alerte(`« nouveau » (${nouveau - nouveauNac}) hors « nouveaux animaux de compagnie » : vérifier qu'il ne date pas la page`);
    }
    const capitales = [...new Set([...texteRegles.matchAll(MOTIF_CAPITALES)].map((m) => m[0]))]
      .filter((mot) => !SIGLES.has(mot))
      .sort();
    if (capitales.length) alerte(`mots en capitales (sigles exceptés) : ${capitales.slice(0, 10).join(', ')}`);
  }

  // Faits laissés en blanc
  for (const [marqueur] of tout.matchAll(MOTIF_PRECISER)) {
    erreur(`fait laissé en blanc : ${marqueur} ; demande-le à la personne ou retire la phrase`);
  }

  // Recherche visée
  const recherche = (fm.recherche ?? '').trim();
  if (recherche && !allemand) {
    const motsTitle = new Set(normaliserSansVilles(title));
    const motsDebut = new Set(normaliserSansVilles(visible.trim().split(/\s+/u).slice(0, 160).join(' ')));
    const motsRecherche = [...new Set(normaliserSansVilles(recherche))].sort();
    const manquantsTitle = motsRecherche.filter((mot) => !motsTitle.has(mot));
    const manquantsDebut = motsRecherche.filter((mot) => !motsDebut.has(mot));
    if (manquantsTitle.length) alerte(`mots de la recherche visée absents du title : ${manquantsTitle.join(', ')}`);
    if (manquantsDebut.length) alerte(`mots de la recherche visée absents des 160 premiers mots : ${manquantsDebut.join(', ')}`);
  }

  // Liens
  const cibles = ciblesDesLiens(corps);
  // Une clinique sans urgences n'a pas de page urgences : aucun lien vers elle n'est exigé
  const sansUrgences = Boolean(fiche) && !fiche.urgences;
  for (const [libelle, brut] of allemand || !Object.hasOwn(LIENS_OBLIGATOIRES, typePage) ? [] : LIENS_OBLIGATOIRES[typePage]) {
    if (sansUrgences && brut.includes('urgences')) continue;
    const motif = brut.replaceAll('{c}', clinique ?? '');
    const expression = new RegExp(motif, 'u');
    if (!cibles.some((cible) => expression.test(cible))) erreur(`lien obligatoire absent : ${libelle} (${motif})`);
  }
  if (typePage === 'urgences' && new Set(cibles.filter((cible) => cible.startsWith('tel:'))).size < 2) {
    erreur('une page Urgences a au moins deux liens tel: distincts (clinique et garde)');
  }
  for (const cible of cibles) {
    if (cible.startsWith('tel:') && !/^tel:(\+41\d{9}|0900\d{6}|0800\d{6}|0848\d{6})$/.test(cible)) {
      erreur(`lien tel: mal formé : ${cible} (attendu tel:+41XXXXXXXXX ou tel:0900XXXXXX)`);
    }
    if (cible.startsWith('http://')) alerte(`lien en http:// : ${cible}`);
    if (cible.startsWith('/') && !cible.split('#')[0].endsWith('/')) alerte(`lien interne sans barre oblique finale : ${cible}`);
    if (allemand && cible.startsWith('/') && !cible.startsWith('/de/')) {
      erreur(`lien vers une page française dans une page allemande : ${cible} (docs/traduction.md donne l'adresse allemande)`);
    }
    if (!allemand && cible.startsWith('/de/')) erreur(`lien vers une page allemande dans une page française : ${cible}`);
  }
  const nbTel = cibles.filter((cible) => cible.startsWith('tel:')).length;
  const nbSite = cibles.filter((cible) => cible.startsWith('/')).length;
  info(`${cibles.length} liens, dont ${nbTel} tel: et ${nbSite} vers le site`);

  // Texte commun avec les autres pages de la même langue
  if (mesurerDoublons) {
    const groupesDeLaPage = bardeaux(normaliser(visibleSansMarqueurs));
    if (groupesDeLaPage.size < 20) {
      alerte('page trop courte pour mesurer le texte commun');
    } else {
      const dossier = join(PAGES, estAllemand(chemin) ? 'de' : 'fr');
      const resultats = pagesDeLaLangue(dossier)
        .filter((autre) => autre.chemin !== chemin)
        .map((autre) => {
          const commun = [...groupesDeLaPage].filter((groupe) => autre.groupes.has(groupe));
          return { part: (commun.length / groupesDeLaPage.size) * 100, nom: autre.nom, commun };
        })
        .sort((a, b) => b.part - a.part);
      for (const { part, nom } of resultats.slice(0, 5)) {
        if (part > 0) info(`texte commun avec ${nom} : ${part.toFixed(1)} %`);
      }
      for (const { part, nom, commun } of resultats) {
        if (part > seuil) {
          const exemples = commun.sort().slice(0, 3).join(' | ');
          erreur(`${part.toFixed(1)} % de texte commun avec ${nom} (seuil ${seuil} %). Exemples : ${exemples}`);
        }
      }
    }
  }
  return rapport;
}

/** Affiche le rapport d'une page. */
function imprimer(rapport) {
  console.log(`\n=== ${cheminDuDepot(rapport.chemin)}`);
  for (const ligne of rapport.infos) console.log(`  i  ${ligne}`);
  for (const ligne of rapport.alertes) console.log(`  A  ${ligne}`);
  for (const ligne of rapport.erreurs) console.log(`  E  ${ligne}`);
  const etat = rapport.erreurs.length ? 'ERREURS' : 'PASSE';
  console.log(`  => ${etat} (${rapport.erreurs.length} erreur(s), ${rapport.alertes.length} alerte(s))`);
}

// Chaque type de page a sa fourchette de mots
const sansFourchette = TYPES_DE_PAGE.filter((type) => !Object.hasOwn(VOLUMES, type));
if (sansFourchette.length) {
  console.error(`Type de page sans fourchette de mots : ${sansFourchette.join(', ')}. Ajoute sa fourchette à VOLUMES, dans outils/verifier-les-pages.mjs.`);
  process.exit(1);
}

let options;
try {
  options = parseArgs({
    allowPositionals: true,
    options: { doublons: { type: 'boolean', default: false }, seuil: { type: 'string', default: '20' } },
  });
} catch (probleme) {
  console.error(`${probleme.message}\n${USAGE}`);
  process.exit(1);
}
const seuil = Number(options.values.seuil);
if (!Number.isFinite(seuil)) {
  console.error(`--seuil attend un nombre, en pour cent.\n${USAGE}`);
  process.exit(1);
}

const cliniques = lireLesCliniques();
const pagesNommees = options.positionals.length > 0;
const pages = pagesNommees ? options.positionals.map((page) => resolve(page)) : fichiersMarkdown(PAGES);
let avecErreurs = 0;
for (const page of pages) {
  const rapport = verifier(page, cliniques, seuil, options.values.doublons);
  if (pagesNommees || rapport.erreurs.length || rapport.alertes.length) imprimer(rapport);
  if (rapport.erreurs.length) avecErreurs++;
}
console.log(`\n${pages.length} pages vérifiées, ${avecErreurs} avec des erreurs.`);
process.exit(avecErreurs ? 1 : 0);
