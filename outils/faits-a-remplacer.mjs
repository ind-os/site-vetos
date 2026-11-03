// Liste les faits à confirmer avant la mise en ligne : le champ `a_remplacer` de chaque page
// française et de chaque fiche de clinique en ligne. Une page allemande reprend les faits de sa
// page française : elle n'est pas listée.
//
//   pnpm faits-a-remplacer              tout le site
//   pnpm faits-a-remplacer payerne      une clinique et ses pages

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RACINE = new URL('..', import.meta.url).pathname;
const PAGES = join(RACINE, 'src/content/pages/fr');
const FICHES = join(RACINE, 'src/donnees/cliniques');
const filtre = process.argv[2];

/** Les fichiers Markdown d'un dossier, sous-dossiers compris. */
function fichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : nom.endsWith('.md') ? [chemin] : [];
  });
}

/** Les lignes de la liste `a_remplacer` d'un en-tête YAML. */
function aRemplacer(texte) {
  const entete = /^---\n([\s\S]*?)\n---/.exec(texte)?.[1] ?? '';
  const bloc = /^a_remplacer:\n((?:\s+- .*\n?)+)/m.exec(entete)?.[1] ?? '';
  return bloc.split('\n').map((l) => l.replace(/^\s+- /, '').replace(/^"|"$/g, '').trim()).filter(Boolean);
}

let total = 0;
for (const nom of readdirSync(FICHES).sort()) {
  const fiche = JSON.parse(readFileSync(join(FICHES, nom), 'utf8'));
  if (!fiche.en_ligne || (filtre && fiche.id !== filtre) || !fiche.a_remplacer?.length) continue;
  console.log(`\nFiche ${fiche.id} (src/donnees/cliniques/${nom})`);
  for (const fait of fiche.a_remplacer) console.log(`  - ${fait}`);
  total += fiche.a_remplacer.length;
}
for (const fichier of fichiers(PAGES).sort()) {
  const chemin = relative(PAGES, fichier);
  if (filtre && !chemin.startsWith(`${filtre}/`)) continue;
  const faits = aRemplacer(readFileSync(fichier, 'utf8'));
  if (!faits.length) continue;
  console.log(`\n${chemin}`);
  for (const fait of faits) console.log(`  - ${fait}`);
  total += faits.length;
}
console.log(`\n${total} fait(s) à confirmer.`);
