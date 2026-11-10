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

/** Les anciennes adresses des services regroupés, vers la page qui les a reprises, en français et en allemand. */
function servicesRegroupes() {
  /** @type {Record<string, string>} */
  const fr = {
    consultation: 'prevention', 'vaccination-chien': 'prevention', 'vaccination-chat': 'prevention',
    'puce-electronique': 'prevention', 'conseils-aux-eleveurs': 'prevention',
    'sterilisation-castration': 'chirurgie', 'gestion-de-la-douleur': 'laser',
    'soins-dentaires': 'dentisterie', 'analyses-diagnostic': 'analyses-sanguines', 'soins-a-domicile': 'visites-a-domicile',
  };
  /** @type {Record<string, string>} */
  const de = {
    konsultation: 'praevention', 'impfung-hund': 'praevention', 'impfung-katze': 'praevention',
    mikrochip: 'praevention', zuechterberatung: 'praevention',
    'kastration-sterilisation': 'chirurgie', schmerztherapie: 'lasertherapie',
    zahnbehandlung: 'zahnmedizin', 'labor-diagnostik': 'blutanalysen',
  };
  /** @type {Record<string, string>} */
  const r = {};
  for (const [ancien, nouveau] of Object.entries(fr)) r[`/services/${ancien}/`] = `/services/${nouveau}/`;
  for (const [ancien, nouveau] of Object.entries(de)) r[`/de/leistungen/${ancien}/`] = `/de/leistungen/${nouveau}/`;
  // Les pages de Payerne, seul cabinet en ligne, qui avaient ces services.
  for (const ancien of ['consultation', 'vaccination-chien', 'vaccination-chat', 'puce-electronique', 'conseils-aux-eleveurs', 'sterilisation-castration', 'soins-dentaires', 'analyses-diagnostic'])
    r[`/payerne/services/${ancien}/`] = `/payerne/services/${fr[ancien]}/`;
  for (const ancien of ['konsultation', 'impfung-hund', 'impfung-katze', 'mikrochip', 'zuechterberatung', 'kastration-sterilisation', 'zahnbehandlung', 'labor-diagnostik'])
    r[`/de/payerne/leistungen/${ancien}/`] = `/de/payerne/leistungen/${de[ancien]}/`;
  return r;
}

export default defineConfig({
  site: ADRESSE_DU_SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  // Anciennes adresses : la page renvoie vers la nouvelle, pour ne casser ni lien ni favori.
  // « Clinique » est une appellation protégée : les cabinets Vetmint n'y ont pas droit.
  // Les services regroupés en treize pages (novembre 2026) : chaque ancienne page mène à celle qui l'a reprise.
  redirects: {
    '/cliniques/': '/cabinets/',
    ...servicesRegroupes(),
  },
  markdown: { processor: satteri(extensionsMarkdown) },
  integrations: [sitemap({ filter: (page) => !/\/(styleguide|404)\//.test(page) }), robots(), imagesNonCitees()],
});
