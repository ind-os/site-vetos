// Le texte complet de chaque page commune de service, sans son chapeau ni ce qui mène aux
// cabinets : la page d'un service dans un cabinet le déplie au clic (src/lib/explication-du-soin.ts).
// Un fragment HTML par langue et par service, hors du plan du site.
import type { APIRoute, GetStaticPaths } from 'astro';
import { lesCliniques } from '../../../lib/cliniques.ts';
import { texteComplet } from '../../../lib/explication-du-soin.ts';
import { adresse, langueDe, lesPages, slugDe, type Page } from '../../../lib/pages.ts';
import { LANGUES } from '../../../config.ts';

export const getStaticPaths = (async () => {
  const pages = (await Promise.all(LANGUES.map((langue) => lesPages(langue, 'service')))).flat();
  return pages.map((page) => ({ params: { langue: langueDe(page), service: slugDe(page) }, props: { page } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ page: Page }> = async ({ props }) => {
  const { page } = props;
  const html = texteComplet(page.rendered?.html ?? '', await adresse(langueDe(page), 'cliniques'), await lesCliniques());
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
