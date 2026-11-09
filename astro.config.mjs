// @ts-check
// Un site statique : `pnpm build` écrit les pages dans dist/, que nginx sert.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { ADRESSE_DU_SITE, INDEXATION } from './src/config.ts';
import { extensionsMarkdown } from './src/lib/markdown.ts';

/** Écrit robots.txt à la fin de la construction : tout est interdit tant que le site n'est pas indexé. */
function robots() {
  /** @type {import('astro').AstroIntegration} */
  const integration = {
    name: 'vetmint-robots',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const contenu = INDEXATION
          ? `User-agent: *\nAllow: /\nDisallow: /styleguide/\n\nSitemap: ${ADRESSE_DU_SITE}/sitemap-index.xml\n`
          : 'User-agent: *\nDisallow: /\n';
        await writeFile(new URL('robots.txt', dir), contenu);
      },
    },
  };
  return integration;
}

/**
 * Retire de dist/_astro les images qu'aucune page n'affiche. Le site importe tout le dossier des
 * photos pour en choisir une par sujet : Vite copie chaque original, même ceux qu'aucune page
 * n'utilise.
 */
function imagesNonCitees() {
  /** @type {import('astro').AstroIntegration} */
  const integration = {
    name: 'vetmint-images-non-citees',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dossier = fileURLToPath(dir);
        const fichiers = (await readdir(dossier, { recursive: true, withFileTypes: true }))
          .filter((e) => e.isFile())
          .map((e) => join(e.parentPath, e.name));
        const images = fichiers.filter((f) => f.startsWith(join(dossier, '_astro')) && /\.(jpe?g|png|webp|avif)$/i.test(f));
        const textes = await Promise.all(fichiers.filter((f) => ['.html', '.css', '.js', '.xml'].includes(extname(f))).map((f) => readFile(f, 'utf8')));
        const cite = textes.join('\n');
        const inutiles = images.filter((f) => !cite.includes(basename(f)));
        await Promise.all(inutiles.map((f) => rm(f)));
        if (inutiles.length) logger.info(`${inutiles.length} image(s) jamais affichée(s), retirée(s) de dist/.`);
      },
    },
  };
  return integration;
}

export default defineConfig({
  site: ADRESSE_DU_SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  // Anciennes adresses : la page renvoie vers la nouvelle, pour ne casser ni lien ni favori.
  // « Clinique » est une appellation protégée : les cabinets Vetmint n'y ont pas droit.
  redirects: { '/cliniques/': '/cabinets/' },
  markdown: { processor: satteri(extensionsMarkdown) },
  integrations: [sitemap({ filter: (page) => !/\/(styleguide|404)\//.test(page) }), robots(), imagesNonCitees()],
});
