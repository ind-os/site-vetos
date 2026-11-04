// Vérifie que le code suit la charte graphique (docs/charte-graphique.md) :
// - chaque bloc de src/composants/ est montré dans le styleguide (src/pages/styleguide/index.astro) ;
// - aucune couleur n'est écrite en dur dans les fichiers .astro et .ts de src/ : les couleurs sont
//   des jetons, définis dans src/styles/charte.css.
//
//   node outils/verifier-la-charte.mjs
//
// Code de sortie : 0 si tout est en ordre, 1 sinon.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = fileURLToPath(new URL('../', import.meta.url));
const SRC = join(RACINE, 'src');
const COMPOSANTS = join(SRC, 'composants');
const STYLEGUIDE = join(SRC, 'pages', 'styleguide', 'index.astro');

// Les blocs de src/composants/ que le styleguide ne montre pas. Le sous-dossier
// src/composants/styleguide/ n'est pas lu : c'est le styleguide lui-même.
const HORS_STYLEGUIDE = [
  // La structure de chaque page, présente partout, pas un bloc qu'on place dans une page
  'EnTete',
  'PiedDePage',
  'Logo',
  'TeteHtml',
];

// Une couleur écrite en dur : #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb(, rgba(, hsl(, hsla(.
// « &#039; » (un caractère HTML) et « #contact » (une ancre) ne sont pas des couleurs.
const MOTIF_COULEUR = /(?<![&\w])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])|\b(?:rgba?|hsla?)\([^)\n]*\)?/gi;

/** Les fichiers d'un dossier et de ses sous-dossiers dont le nom finit par l'une des extensions. */
function fichiers(dossier, extensions) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) return fichiers(chemin, extensions);
    return extensions.some((extension) => nom.endsWith(extension)) ? [chemin] : [];
  });
}

/** Le code sans ses commentaires (<!-- … -->, /* … *\/, // …), retours à la ligne gardés. */
function sansCommentaires(code) {
  const blanchir = (commentaire) => commentaire.replace(/[^\n]/g, '');
  return code
    .replace(/<!--[\s\S]*?-->/g, blanchir)
    .replace(/\/\*[\s\S]*?\*\//g, blanchir)
    // « // » ouvre un commentaire en début de ligne ou après une espace, pas dans « https:// »
    .replace(/(^|\s)\/\/.*$/gm, '$1');
}

const problemes = [];

// 1. Chaque bloc est montré dans le styleguide
const styleguide = readFileSync(STYLEGUIDE, 'utf8');
const importes = new Set(
  [...styleguide.matchAll(/from\s+['"]([^'"]+\.astro)['"]/g)].map(([, chemin]) => resolve(dirname(STYLEGUIDE), chemin)),
);
for (const nom of readdirSync(COMPOSANTS).filter((nom) => nom.endsWith('.astro')).sort()) {
  if (HORS_STYLEGUIDE.includes(nom.replace(/\.astro$/, ''))) continue;
  if (!importes.has(join(COMPOSANTS, nom))) {
    problemes.push(`src/composants/${nom} n'est pas montré dans le styleguide (src/pages/styleguide/index.astro) : un bloc s'ajoute au styleguide le jour où il est créé`);
  }
}

// 2. Aucune couleur écrite en dur
for (const fichier of fichiers(SRC, ['.astro', '.ts']).sort()) {
  sansCommentaires(readFileSync(fichier, 'utf8')).split('\n').forEach((ligne, i) => {
    for (const [couleur] of ligne.matchAll(MOTIF_COULEUR)) {
      problemes.push(`${relative(RACINE, fichier)}:${i + 1} : couleur écrite en dur (${couleur}) ; les couleurs sont des jetons de src/styles/charte.css`);
    }
  });
}

if (problemes.length) {
  console.error(`${problemes.length} écart(s) à la charte graphique :\n- ${problemes.join('\n- ')}`);
  process.exit(1);
}
console.log('Charte graphique vérifiée : chaque bloc est dans le styleguide, aucune couleur écrite en dur.');
