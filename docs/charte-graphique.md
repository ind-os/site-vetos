# Charte graphique

La charte est la piste A « Continuité », validée par Vetmint : le site actuel remis en ordre. Les couleurs de la marque, la police Nunito, les boutons arrondis et le logo actuel restent. La photo ne porte jamais de texte ; les informations pratiques remontent sous l'accueil.

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

## Les règles

- **Typographie** : titres en Nunito 800, marine ; texte en Nunito Sans 17 px, interligne 1,55 ; 70 caractères par ligne au plus.
- **Boutons** : en pilule, en aplat, sans dégradé. Principal en menthe plein, une action par bloc ; secondaire en contour marine. 44 px de haut au moins.
- **Cartes** : fond blanc, filet gris `#DCE5EA`, coins de 12 px.
- **Photos** : encadrées, coins de 16 px, à côté du titre, jamais sous le texte.
- **Survol** : seule la couleur change. Rien ne bouge, ne pivote ni ne grandit.
- **Logo** : le logo actuel, tel quel, une fois par page, dans l'en-tête. Il mène à l'accueil du site. Sur les pages d'une clinique, le nom du lieu se place à sa droite, séparé par un filet, et mène à l'accueil de cette clinique.
- **Rendez-vous et urgence d'abord** : « Prendre rendez-vous » et le téléphone sont visibles au premier écran sur smartphone ; le numéro de garde est cliquable, avec son tarif ; aucune fenêtre surgissante au chargement.
- **Lisible et rapide** : texte de 16 px au moins, contraste AA, photos en AVIF et WebP. Le module de rendez-vous n'est pas dans le premier affichage : il se prépare ensuite, quand le navigateur est libre, et le panneau s'ouvre tout de suite au clic.

## Ajouter un bloc

Une page se construit avec les blocs existants (`src/composants/`). On ne crée un bloc que si aucun ne convient. Le jour où on le crée, on l'ajoute au styleguide (`src/pages/styleguide/index.astro`) avec ses variantes et la façon de l'écrire, et ses textes d'interface dans `src/i18n/fr.ts` et `src/i18n/de.ts`.
