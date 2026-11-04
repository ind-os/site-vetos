// Vérifie, après `pnpm build`, que chaque lien interne des pages construites (dist/) mène à une
// page qui existe. Les liens vers l'adresse hors ligne des cliniques pas encore en ligne, les liens
// externes, tel: et mailto: ne sont pas suivis.
//
//   node outils/verifier-les-liens.mjs

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

/** Les fichiers HTML de dist/. */
function pagesHtml(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) return pagesHtml(chemin);
    return nom.endsWith('.html') ? [chemin] : [];
  });
}

/** Vrai si une adresse du site correspond à un fichier de dist/. */
function existe(adresse) {
  const chemin = decodeURIComponent(adresse.split('#')[0].split('?')[0]);
  if (chemin === '' ) return true;
  const cible = join(DIST, chemin);
  return existsSync(cible) && (statSync(cible).isFile() || existsSync(join(cible, 'index.html')));
}

const problemes = [];
for (const fichier of pagesHtml(DIST)) {
  const page = `/${relative(DIST, fichier).replace(/index\.html$/, '')}`;
  if (page.startsWith('/404')) continue;
  const html = readFileSync(fichier, 'utf8');
  for (const [, href] of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (!existe(href)) problemes.push(`${page} : lien vers ${href}, page absente`);
  }
}

if (problemes.length) {
  console.error(`${problemes.length} lien(s) cassé(s) :\n- ${[...new Set(problemes)].join('\n- ')}`);
  process.exit(1);
}
console.log(`Liens vérifiés : ${pagesHtml(DIST).length} pages, aucun lien cassé.`);
