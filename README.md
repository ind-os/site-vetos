# Site Vetmint

Le site vetmint.ch, en français et en allemand : les pages communes du groupe Vetmint et les pages de chaque clinique, sous `vetmint.ch/<clinique>/`. Astro 7, sortie statique, servie par nginx. Seb le fait évoluer depuis Claude Code (`CLAUDE.md`).

## Ce que contient le dépôt

| Dossier | Contenu |
|---|---|
| `src/content/pages/fr/`, `src/content/pages/de/` | les textes, un fichier Markdown par page et par langue |
| `src/donnees/cliniques/` | la fiche de chaque clinique : coordonnées, équipe, services, horaires, fermetures, annonce, garde, rendez-vous |
| `src/i18n/` | les textes de l'interface (menus, boutons) en français et en allemand |
| `src/assets/images/` | les photos et leur catalogue (sujet, texte alternatif, point focal) |
| `src/composants/` | les blocs réutilisables, montrés sur `/styleguide/` |
| `src/gabarits/` | la mise en page de chaque type de page |
| `src/lib/` | la lecture des pages et des fiches, les horaires, le Markdown, le balisage |
| `docs/` | les règles : plan des pages, format des pages, fiche de clinique, charte graphique, charte de rédaction, traduction |
| `outils/` | la vérification d'une page et des liens |
| `.claude/skills/` | les procédures pour Claude Code : préparer l'ordinateur, rédiger une page, mettre une clinique en ligne |

## Travailler dessus

```bash
pnpm install
pnpm dev            # http://localhost:4321, et http://localhost:4321/styleguide/
pnpm verifier       # types, construction, règles du site, liens
python3 -I outils/verifier-page.py src/content/pages/fr/payerne/tarifs.md
```

Hors d'un terminal interactif (Claude Code), `astro dev` démarre en arrière-plan et rend la main ; `pnpm astro dev status` et `pnpm astro dev stop` le suivent.

Le site n'est pas indexé par les moteurs de recherche tant que `INDEXATION` vaut `false` dans `src/config.ts` : chaque page porte `noindex` et `robots.txt` interdit tout.

## Construire et lancer l'image

```bash
docker build --build-arg GIT_SHA="$(git rev-parse HEAD)" -t site .
docker run --rm -p 8080:80 site
```

- Un seul port exposé : **80**.
- La sonde : `GET /healthz.json` rend `{"ok":true,"sha":"<GIT_SHA>"}`, avec `Cache-Control: no-store`.
- Le `HEALTHCHECK` demande la sonde par le `wget` de busybox (l'image nginx alpine n'a pas curl).

## La publication

`.github/workflows/publier.yml`, à chaque poussée sur `main` :

1. construit l'image avec `GIT_SHA` au commit et la pousse sur
   `ghcr.io/<compte>/<dépôt>`, étiquetée `main` et par le commit, avec le
   `GITHUB_TOKEN` du workflow (`packages: write`) ;
2. si les secrets `REDEPLOIEMENT_ADRESSE` et `REDEPLOIEMENT_JETON` existent :
   `POST` sur l'adresse, avec le jeton en `Authorization: Bearer`, puis attend
   que `<SITE_ADRESSE>/healthz.json` rende ce commit ; rouge après dix minutes.
   Sans ces deux secrets, le résumé du workflow dit que rien n'est publié, et le
   workflow finit vert.

Les poussées passent l'une après l'autre (`concurrency`, sans annulation de la
publication en cours). GitHub ne garde qu'une publication en attente : d'une
rafale de poussées, la dernière est publiée, et celles d'entre deux sont
annulées avant de commencer.

Ce que le dépôt reçoit du serveur qui sert le site, posé à l'installation du
serveur :

| Nom | Sorte | Contenu |
| --- | --- | --- |
| `REDEPLOIEMENT_ADRESSE` | secret | l'adresse qui fait reprendre l'image `main` au serveur |
| `REDEPLOIEMENT_JETON` | secret | le jeton de cette adresse |
| `SITE_ADRESSE` | variable | l'adresse du site en ligne, `https://site.exemple.ch` |

Le serveur tire l'image sans identifiant : le paquet GHCR se rend public une
fois, après la première poussée, dans les réglages du paquet sur GitHub. Un
paquet naît privé.

## Claude Code

- `CLAUDE.md` : les gestes de Seb, pour Claude Code : vérifier l'ordinateur, prévisualiser, modifier le site, publier, revenir à une version d'avant.
- `.claude/skills/` : préparer l'ordinateur, rédiger ou traduire une page, mettre une clinique en ligne.
- `.claude/settings.json` : Claude ne modifie ni `.github/` ni `.claude/`, ne lance ni `gh secret`, ni `gh api`, ni `gh variable set` ou `delete`, ni les gestes de `gh auth` qui rendent ou changent le jeton, et ne force aucune poussée.
