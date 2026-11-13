# Plan des pages

Le site est vetmint.ch, en français et en allemand. Il réunit les pages communes au groupe et les pages de chaque cabinet, sous `vetmint.ch/<cabinet>/`. Les pages communes sont écrites une fois ; les pages des cabinets y renvoient.

## Une page, un fichier

Chaque page est un fichier Markdown dans `src/content/pages/<langue>/`. Le chemin du fichier sert de clé : la même clé dans les deux langues relie une page à sa traduction. L'adresse publique est le champ `url` de l'en-tête.

| Fichier | Adresse |
|---|---|
| `fr/index.md` | `/` |
| `de/index.md` | `/de/` |
| `fr/services/radiographie.md` | `/services/radiographie/` |
| `de/services/radiographie.md` | `/de/leistungen/roentgen/` |
| `fr/payerne/equipe.md` | `/payerne/equipe/` |
| `de/payerne/equipe.md` | `/de/payerne/team/` |

Le format du fichier est dans [format-des-pages.md](format-des-pages.md), le contenu de chaque type de page dans [structure-des-pages.md](structure-des-pages.md), les adresses allemandes dans [traduction.md](traduction.md), les règles d'écriture dans la [charte de rédaction](charte-redactionnelle.md).

## Le type de page choisit la mise en page

Le champ `type` de l'en-tête choisit le gabarit de la page (`src/gabarits/`). Tous les types sont listés dans `src/lib/types-de-page.ts`, et `src/gabarits/index.ts` donne le gabarit de chacun.

| Type | Page | Ce que le gabarit ajoute au texte |
|---|---|---|
| `accueil-groupe` | accueil de vetmint.ch | premier écran, carte et cartes des huit cabinets |
| `cliniques` | les cabinets | carte et cartes des huit cabinets, avec leur bouton de rendez-vous |
| `service-index` | tous les services | listes de liens en cartes, rendez-vous à côté |
| `service` | un service, page commune | photo, à côté le rendez-vous et les cabinets qui le pratiquent |
| `urgences-groupe` | urgences de tout Vetmint | à côté, nos services d’urgence : logo et numéro gratuit, avant le texte sur un téléphone |
| `conseil-index`, `conseil-categorie` | conseils santé, par espèce | cartes des conseils, rendez-vous à côté |
| `conseil` | un conseil santé | photo, rendez-vous à côté, trois conseils de la même espèce |
| `simple` | à propos, pages légales | rien |
| `emploi` | emploi | une carte par poste ouvert, deux par ligne |
| `accueil-clinique` | accueil d'un cabinet | premier écran avec rendez-vous et urgence, horaires, accès, aperçu de l'équipe |
| `services-clinique` | les services d'un cabinet | une carte par soin de la fiche |
| `equipe` | équipe | une carte par personne de la fiche |
| `contact` | contact | téléphone en grand, e-mail, WhatsApp, adresse, itinéraires, horaires, photos des locaux |
| `tarifs`, `abonnements` | tarifs et abonnements du cabinet | carte du cabinet à côté |
| `rendez-vous` | rendez-vous | bouton du module de réservation et téléphone |
| `questions-frequentes` | questions fréquentes | chaque question ### en accordéon |
| `urgences` | urgences du cabinet | numéro de garde et tarif en premier |
| `service-clinique` | un service dans un cabinet | toute la page, sans texte écrit : le chapeau tiré de la fiche, le rendez-vous, les prix de la grille, le soin en bref, les autres soins ; photo, carte du cabinet à côté ([structure-des-pages.md](structure-des-pages.md), « Un service dans le cabinet »). Autour d'une page écrite pour un soin propre au cabinet : photo, carte du cabinet, autres soins |

## Les pages communes

| Adresse | Fichier | Type |
|---|---|---|
| `/` | `index.md` | `accueil-groupe` |
| `/cabinets/` | `cliniques.md` | `cliniques` |
| `/services/` | `services/index.md` | `service-index` |
| `/services/<service>/` | `services/<service>.md` | `service` |
| `/urgences/` | `urgences.md` | `urgences-groupe` |
| `/conseils/` | `conseils/index.md` | `conseil-index` |
| `/conseils/chien/`, `/conseils/chat/`, `/conseils/nac/` | `conseils/<espèce>.md` | `conseil-categorie` |
| `/conseils/<conseil>/` | `conseils/<conseil>.md` | `conseil` |
| `/a-propos/` | `a-propos.md` | `simple` |
| `/emploi/` | `emploi.md` | `emploi` |
| `/remettre-un-cabinet/` | `remettre-un-cabinet.md` | `simple` |
| `/confidentialite/`, `/mentions-legales/` | `confidentialite.md`, `mentions-legales.md` | `simple` |

Les services, dans l'ordre du champ `ordre` : prevention, chirurgie, chirurgie-orthopedique, dentisterie, radiographie, echographie, endoscopie, hospitalisation, analyses-sanguines, laser, nac, visites-a-domicile. Les urgences n'ont pas de page de service : la liste des services et le menu mènent à `/urgences/`. Les anciennes adresses (consultation, vaccins, puce, stérilisation, éleveurs, douleur, soins dentaires, analyses, soins à domicile) renvoient vers la page qui les a reprises (`astro.config.mjs`).

## Les pages d'un cabinet

Chaque cabinet a son dossier, `src/content/pages/<langue>/<cabinet>/`, et sa fiche, `src/donnees/cliniques/<cabinet>.json` ([fiche-du-cabinet.md](fiche-du-cabinet.md)). Tout cabinet a les mêmes pages, dans les deux langues :

| Adresse | Fichier | Type |
|---|---|---|
| `/<cabinet>/` | `index.md` | `accueil-clinique` |
| `/<cabinet>/services/` | `services/index.md` | `services-clinique` |
| `/<cabinet>/equipe/` | `equipe.md` | `equipe` |
| `/<cabinet>/contact/` | `contact.md` | `contact` |
| `/<cabinet>/tarifs/` | `tarifs.md` | `tarifs` |
| `/<cabinet>/abonnements/` | `abonnements.md` | `abonnements` |
| `/<cabinet>/rendez-vous/` | `rendez-vous.md` | `rendez-vous` |
| `/<cabinet>/questions-frequentes/` | `questions-frequentes.md` | `questions-frequentes` |
| `/<cabinet>/urgences/` | `urgences.md`, si la fiche dit `"urgences": true` | `urgences` |
| `/<cabinet>/services/<service>/` | aucun fichier : le site fabrique la page pour chaque service du champ `services` de la fiche | `service-clinique` |

Cette liste est dans `src/lib/types-de-page.ts` (`PAGES_DE_CLINIQUE`). Les pages de service d'un cabinet se fabriquent toutes seules, depuis sa fiche, sa grille des prix ([grille-des-prix.md](grille-des-prix.md)) et la page commune de chaque service (`src/lib/pages.ts`). Un cabinet peut avoir une page de service écrite, pour un soin qu'il est seul à pratiquer : `services/<soin>.md` dans son dossier, type `service-clinique`, dans les deux langues ; le soin n'a pas besoin d'une page commune. Une page d'un dossier de cabinet porte toujours un type de page de cabinet et le champ `clinique`.

## Les pages internes et les textes des soins

Le site fabrique aussi, sans fichier Markdown, des adresses qui ne sont pas des pages du site public. Aucune n'est dans le plan du site ; `robots.txt` les ferme aux moteurs de recherche.

| Adresse | Ce qu'elle montre |
|---|---|
| `/styleguide/` | chaque bloc du site ([charte-graphique.md](charte-graphique.md)) |
| `/grille-des-prix/` | les grilles des prix de tous les cabinets, avec les pages qui affichent chaque prix ([grille-des-prix.md](grille-des-prix.md)) |
| `/textes-des-soins/<langue>/<service>.html` | le texte de la page commune d'un service, sans son chapeau ni ses sections qui mènent aux cabinets. Un morceau de page, sans en-tête ni menu, que la page du service dans un cabinet charge au clic ([structure-des-pages.md](structure-des-pages.md), « Un service dans le cabinet ») |

## Ce que le site vérifie

À chaque construction, le site s'arrête sur une page sans traduction, une adresse en double, un cabinet en ligne incomplet, un service sans page commune ou un jeton de prix absent de la grille, avec le nom du fichier en cause ; en prévisualisation, le problème s'affiche dans le terminal sans arrêter le site. La liste complète, avec ce que `pnpm verifier` et `pnpm auditer` contrôlent en plus, est dans [verifications.md](verifications.md).

## Les cabinets pas encore en ligne

Les huit cabinets ont leur fiche. Tant qu'une fiche dit `"en_ligne": false`, le cabinet figure sur la carte et dans les listes, et ses liens mènent à l'adresse du champ `adresse_hors_ligne` de sa fiche. Les textes écrivent l'adresse définitive (`/bussigny/rendez-vous/`) : le lien se rétablit seul le jour où le cabinet passe en ligne. Leurs pages peuvent déjà être écrites : la prévisualisation les construit et les montre ; la construction du site en ligne les laisse de côté, ni page, ni plan du site, ni traduction exigée, tant que la fiche dit `"en_ligne": false`. La procédure est dans la skill `mettre-un-cabinet-en-ligne`.
