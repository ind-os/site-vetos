# Plan des pages

Le site est vetmint.ch, en français et en allemand. Il réunit les pages communes au groupe et les pages de chaque clinique, sous `vetmint.ch/<clinique>/`. Les pages communes sont écrites une fois ; les pages des cliniques y renvoient.

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
| `accueil-groupe` | accueil de vetmint.ch | premier écran, carte et cartes des huit cliniques |
| `cliniques` | les cliniques | carte et cartes des huit cliniques, avec leur bouton de rendez-vous |
| `service-index` | tous les services | listes de liens en cartes, rendez-vous à côté |
| `service` | un service, page commune | photo, à côté le rendez-vous et les cliniques qui le pratiquent |
| `urgences-groupe` | urgences de tout Vetmint | rien |
| `conseil-index`, `conseil-categorie` | conseils santé, par espèce | cartes des conseils, rendez-vous à côté |
| `conseil` | un conseil santé | photo, rendez-vous à côté, trois conseils de la même espèce |
| `simple` | tarifs et abonnements comparés, à propos, emploi, lettre d'information, pages légales | rien |
| `accueil-clinique` | accueil d'une clinique | premier écran avec rendez-vous et urgence, horaires, accès, aperçu de l'équipe |
| `services-clinique` | les services d'une clinique | une carte par soin de la fiche |
| `equipe` | équipe | une carte par personne de la fiche |
| `contact` | contact | téléphone en grand, e-mail, WhatsApp, adresse, itinéraires, horaires, photos des locaux |
| `tarifs`, `abonnements` | tarifs et abonnements de la clinique | carte de la clinique à côté |
| `rendez-vous` | rendez-vous | bouton du module de réservation et téléphone |
| `questions-frequentes` | questions fréquentes | chaque question ### en accordéon |
| `urgences` | urgences de la clinique | numéro de garde et tarif en premier |
| `service-clinique` | un service dans une clinique | photo, carte de la clinique, lien vers la page commune, autres soins |

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
| `/tarifs/`, `/abonnements/` | `tarifs.md`, `abonnements.md` | `simple` |
| `/a-propos/`, `/emploi/`, `/newsletter/` | `a-propos.md`, `emploi.md`, `newsletter.md` | `simple` |
| `/confidentialite/`, `/mentions-legales/` | `confidentialite.md`, `mentions-legales.md` | `simple` |

Les services, dans l'ordre du champ `ordre` : prevention, chirurgie, chirurgie-orthopedique, dentisterie, radiographie, echographie, endoscopie, hospitalisation, analyses-sanguines, laser, nac, visites-a-domicile. Les urgences n'ont pas de page de service : la liste des services et le menu mènent à `/urgences/`. Les anciennes adresses (consultation, vaccins, puce, stérilisation, éleveurs, douleur, soins dentaires, analyses, soins à domicile) renvoient vers la page qui les a reprises (`astro.config.mjs`).

## Les pages d'une clinique

Chaque clinique a son dossier, `src/content/pages/<langue>/<clinique>/`, et sa fiche, `src/donnees/cliniques/<clinique>.json` ([fiche-clinique.md](fiche-clinique.md)). Toute clinique a les mêmes pages, dans les deux langues :

| Adresse | Fichier | Type |
|---|---|---|
| `/<clinique>/` | `index.md` | `accueil-clinique` |
| `/<clinique>/services/` | `services/index.md` | `services-clinique` |
| `/<clinique>/equipe/` | `equipe.md` | `equipe` |
| `/<clinique>/contact/` | `contact.md` | `contact` |
| `/<clinique>/tarifs/` | `tarifs.md` | `tarifs` |
| `/<clinique>/abonnements/` | `abonnements.md` | `abonnements` |
| `/<clinique>/rendez-vous/` | `rendez-vous.md` | `rendez-vous` |
| `/<clinique>/questions-frequentes/` | `questions-frequentes.md` | `questions-frequentes` |
| `/<clinique>/urgences/` | `urgences.md`, si la fiche dit `"urgences": true` | `urgences` |
| `/<clinique>/services/<service>/` | `services/<service>.md`, pour chaque service du champ `services` de la fiche | `service-clinique` |

Cette liste est dans `src/lib/types-de-page.ts` (`PAGES_DE_CLINIQUE`). Une clinique peut avoir une page de service en plus, pour un soin qu'elle est seule à pratiquer : `services/<soin>.md` dans son dossier, type `service-clinique`, dans les deux langues ; le soin n'a pas besoin d'une page commune. Une page d'un dossier de clinique porte toujours un type de clinique et le champ `clinique`.

## Ce que le site vérifie

À chaque construction, le site s'arrête sur une page sans traduction, une adresse en double, une clinique en ligne incomplète ou un service sans page commune, avec le nom du fichier en cause ; en prévisualisation, le problème s'affiche dans le terminal sans arrêter le site. La liste complète, avec ce que `pnpm verifier` et `pnpm auditer` contrôlent en plus, est dans [verifications.md](verifications.md).

## Les cliniques pas encore en ligne

Les huit cliniques ont leur fiche. Tant qu'une fiche dit `"en_ligne": false`, la clinique figure sur la carte et dans les listes, et ses liens mènent à l'adresse du champ `adresse_hors_ligne` de sa fiche. Les textes écrivent l'adresse définitive (`/bussigny/rendez-vous/`) : le lien se rétablit seul le jour où la clinique passe en ligne. Leurs pages peuvent déjà être écrites : la prévisualisation les construit et les montre ; la construction du site en ligne les laisse de côté, ni page, ni plan du site, ni traduction exigée, tant que la fiche dit `"en_ligne": false`. La procédure est dans la skill `mettre-une-clinique-en-ligne`.
