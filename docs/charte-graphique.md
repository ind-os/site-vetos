# Charte graphique

La charte graphique de vetmint.ch : les couleurs de la marque Vetmint, la police Nunito, des boutons en pilule et le logo Vetmint. La photo ne porte jamais de texte ; les informations pratiques (rendez-vous, téléphone, horaires) suivent directement le premier écran de l'accueil.

Chaque bloc est rendu, avec ses variantes et la façon de l'écrire, sur la page `/styleguide/` du site (jamais indexée). Les valeurs vivent dans `src/styles/charte.css`.

## Les couleurs portent un sens

| Couleur | Valeur | Variable | Sens |
|---|---|---|---|
| Marine | `#0A4675` | `--marine` | titres, navigation, pied de page |
| Menthe | `#007A70` | `--menthe-texte` | ce qui s'active : boutons et liens ; lisible sur blanc, gris bleuté et menthe pâle |
| Menthe foncé | `#006B62` | `--menthe-fonce` | survol des boutons et des liens |
| Menthe du logo | `#009C8C` | `--menthe` | décor seulement ; trop clair pour du texte |
| Gris bleuté | `#F2F6F8` | `--gris-bleute` | fond des sections alternées et des en-têtes de page |
| Rouge de la croix | `#C8102E` | `--urgence` | l'urgence, rien d'autre ; jamais une nouveauté ni une promotion |
| Encre | `#1D3448` | `--encre` | texte courant |
| Gris | `#5B6B78` | `--gris` | texte secondaire, puces |

Avant de colorer un élément, on sait ce que la couleur code. Sinon, il reste gris.

Toute couleur est un jeton de `src/styles/charte.css`, avec son sens en commentaire. Un composant, un gabarit ou un script n'écrit jamais une couleur en dur. Script. Les jetons qui découlent de la table :

- `--trait` `#DCE5EA`, le filet des cartes ; `--trait-leger`, les filets de séparation ; `--menthe-trait` `#BFE3DE`, le filet d'une pastille de service ; `--menthe-pale`, le fond d'une pastille ; `--urgence-pale`, le fond du rappel d'urgence.
- `--lac` `#D6E5EE`, les lacs de la carte des cliniques.
- `--autoroute` `#E2A24A` et `--autoroute-plaque` `#9B3B26`, les autoroutes de la carte des cliniques et leur plaque. Un repère pour venir à la clinique, rien d'autre ; la plaque n'est pas le rouge de l'urgence.
- Sur le fond marine : `--sur-marine` et `--sur-marine-lien` pour le texte et les liens, `--sur-marine-filet` pour les filets du pied de page et des horaires, `--sur-marine-fond` pour un encadré, les fermetures.
- `--voile`, la page derrière le panneau de rendez-vous, voilée de marine ; `--ombre-panneau`, l'ombre de ce panneau.

## Les règles

- **Typographie** : titres en Nunito 800, marine ; texte en Nunito Sans 17 px, interligne 1,55 ; 70 caractères par ligne au plus.
- **Boutons** : en pilule, en aplat, sans dégradé. Principal en menthe plein, une action par bloc ; secondaire en contour marine. `--cible`, 44 px, de haut au moins, comme toute cible tactile.
- **Cartes** : la classe `.carte` de `charte.css`, fond blanc, filet gris `--trait`, coins de 12 px, marge intérieure `--marge-carte`, 22 px. Un bloc qui a ce cadre pose la classe et n'en recopie pas les valeurs. `.carte--cliquable` rend toute la carte cliquable : filet menthe au survol, contour au focus.
- **Mise en page** : les classes de `charte.css` portent les dispositions communes. `.avec-cote` et `.avec-cote__cote`, la colonne latérale de `--largeur-cote`, 20 rem, qui reste visible à côté du texte sur ordinateur ; `.grille-de-cartes`, une grille de cartes qui se remplit selon la largeur, avec `--min` pour la largeur minimale d'une carte ; `.bloc`, une sous-section du corps, titre en taille de carte. Les points de rupture sont cinq, 40, 48, 56, 64 et 72 rem, listés en commentaire dans `charte.css`.
- **Tailles** : `--texte-m`, entre le texte et `--texte-l`, pour un numéro de téléphone dans une carte ; `--chiffre-grand`, le téléphone en grand de la page Contact et le numéro de garde en bloc ; `--police-code`, le code du styleguide.
- **Urgence** : la croix suisse rouge, `.croix`, signe de l'urgence et de rien d'autre. Le numéro de garde a un seul libellé partout, celui de la fiche écrit par `src/lib/donnees-de-la-clinique.ts`, « Numéro de garde : 0900 904 904, 1,70 franc la minute », en ligne sous l'accueil d'une clinique et en bloc en tête de sa page Urgences.
- **Photos** : encadrées, coins de 16 px, à côté du titre, jamais sous le texte.
- **Survol** : seule la couleur change. Rien ne bouge, ne pivote ni ne grandit.
- **Logo** : le logo Vetmint, tel quel, une fois par page, dans l'en-tête. Il mène à l'accueil du site. Sur les pages d'une clinique, le nom du lieu se place à sa droite, séparé par un filet, et mène à l'accueil de cette clinique.
- **Rendez-vous et urgence d'abord** : « Prendre rendez-vous » et le téléphone sont visibles au premier écran sur smartphone ; le numéro de garde est cliquable, avec son tarif ; aucune fenêtre surgissante au chargement.
- **Lisible et rapide** : texte de 16 px au moins, contraste AA, photos en AVIF et WebP. Le module de rendez-vous ne se charge pas avec la page : le bouton charge l'agenda au survol ou au focus, et le panneau s'ouvre au clic.
- **Un style répété devient commun** : un style écrit dans trois blocs devient une classe de `charte.css` ou un bloc de `src/composants/`.

## Le catalogue des photos

Les photos sont dans `src/assets/images/`, décrites une par une dans `src/assets/images/catalogue.json`. Les gabarits demandent une photo par sujet ; le texte d'une page n'en place jamais. Astro sert chaque photo en AVIF et WebP, aux tailles utiles, recadrée sur son point focal.

Le fichier : `<clinique>-<sujet>.jpg` pour une clinique (`payerne-locaux-entree.jpg`, `payerne-equipe-claire-lise-tinguely.jpg`), `<famille>-<sujet>.jpg` pour le reste (`service-radiographie-cliche.jpg`, `conseil-le-lapin.jpg`, `espece-chat-chaton-clair.jpg`, `accueil-veterinaire-carlin.jpg`). En minuscules, sans accent ni espace ; `.jpg`, `.png` ou `.webp`.

L'entrée du catalogue :

```json
{
  "fichier": "payerne-locaux-entree.jpg",
  "sujet": "payerne:locaux",
  "alt": { "fr": "L'entrée de plain-pied de la clinique de Payerne", "de": "Der ebenerdige Eingang der Praxis in Payerne" },
  "point_focal": { "x": 0.5, "y": 0.4 },
  "source": "https://…"
}
```

| Champ | Contenu |
|---|---|
| `fichier` | le nom du fichier dans `src/assets/images/` |
| `sujet` | ce que les gabarits demandent : `accueil`, `espece:chien`, `service:<service>`, `conseil:<conseil>` ; pour une clinique, `<clinique>:accueil`, `<clinique>:locaux` (l'entrée, la réception, une façade), `<clinique>:service:<service>`, `<clinique>:equipe:<Prénom Nom>` avec le nom tel qu'il est dans la fiche. La construction refuse un sujet qui nomme une clinique ou une personne absente des fiches |
| `alt` | ce que montre la photo, en français et en allemand : « La salle de radiographie de la clinique de Payerne » |
| `point_focal` | le point à garder visible quand la photo est recadrée, `x` et `y` de 0 à 1 depuis le coin haut gauche ; absent, le centre |
| `source` | facultatif : d'où vient la photo |

Plusieurs photos peuvent porter le même sujet ; le gabarit choisit laquelle il montre. Une photo que rien ne demande n'est pas servie.

- **Ajouter une photo** : copier le fichier, ajouter son entrée.
- **Remplacer une photo** : remplacer le fichier sous le même nom, ou poser un nouveau fichier et changer `fichier` dans l'entrée.
- **Retirer une photo** : retirer l'entrée et le fichier. La construction s'arrête si une entrée cite un fichier absent.

## Ajouter ou modifier un bloc

Une page se construit avec les blocs existants (`src/composants/`). On ne crée un bloc que si aucun ne convient. Le jour où on le crée, on l'ajoute au styleguide (`src/pages/styleguide/index.astro`) avec ses variantes et la façon de l'écrire, et ses textes d'interface dans `src/i18n/fr.ts` et `src/i18n/de.ts`. Les gestes, dans l'ordre, sont dans la skill `modifier-la-mise-en-page`.

## Ce que le script vérifie

`outils/verifier-la-charte.mjs`, lancé par `pnpm verifier` ([verifications.md](verifications.md)) :

- chaque bloc de `src/composants/` est montré dans le styleguide, sauf EnTete, PiedDePage, Logo et TeteHtml, qui sont la structure de la page et non des blocs ;
- aucune couleur n'est écrite en dur hors de `src/styles/`.

Le reste de cette charte est une convention : le sens des couleurs, le survol sans mouvement, le choix d'un bloc existant, le style répété qui devient commun. La skill `auditer-le-site` la relit.
