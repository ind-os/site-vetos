# Grille des prix d'un cabinet

Chaque cabinet a sa grille des prix, `src/donnees/tarifs/<cabinet>.json`, au nom de l'identifiant de sa fiche (`payerne.json`). Tous les prix du cabinet y vivent, une fois chacun. Aucune page ne tape un prix : elle écrit le jeton du prix et le site affiche le montant de la grille. Astro vérifie la grille à chaque construction (`src/content.config.ts`) ; les calculs et la forme des montants sont dans `src/lib/prix.ts`.

## Les champs

| Champ | Contenu |
|---|---|
| `valable_des` | la date depuis laquelle les prix s'appliquent, `AAAA-MM-JJ` |
| `prix` | la liste des prix du cabinet ; l'ordre de la liste est celui de la page d'un service |

Chaque prix de la liste :

| Champ | Contenu |
|---|---|
| `cle` | le nom du prix, unique dans la grille, en minuscules et tirets : `sterilisation-chatte` |
| `libelle` | ce que le prix paie, dans les deux langues : `{ "fr": "…", "de": "…" }` |
| `montant` | un nombre, `57` ; une fourchette, `{ "min": 25, "max": 200 }` ; ou un calcul sur d'autres clés de la même grille, avec des nombres et les opérateurs + - * / entourés d'espaces : `"consultation + supplement-urgence-jour"`, `"plan-prevention / 4"`. Un calcul est arrondi au centime ; une fourchette n'entre pas dans un calcul |
| `service` | facultatif : le nom de la page commune du service, `radiographie`. Le prix s'affiche alors sur la page de ce service dans le cabinet ([structure-des-pages.md](structure-des-pages.md), « Un service dans le cabinet ») |

```json
{ "cle": "sterilisation-chatte", "service": "chirurgie", "libelle": { "fr": "Stérilisation de la chatte, anesthésie comprise", "de": "Sterilisation der Katze, Narkose inbegriffen" }, "montant": "sterilisation-chatte-acte + sterilisation-chatte-anesthesie" }
```

## Le jeton

Un texte n'écrit jamais un montant : il écrit le jeton `{prix:<cle>}`, par exemple `{prix:consultation}`. Le même jeton s'écrit dans les deux langues. Seule exception : « Le coût à la minute d'un numéro de garde ».

- Un jeton s'écrit sur une page d'un cabinet : dans le corps et dans les champs `description` et `resume` de son en-tête.
- Jamais dans `title`, `h1` ou une ligne de titre.
- Jamais sur une page commune.

## Les formes d'un montant

Le site écrit le montant à la forme de la langue et de l'endroit : la forme d'un tableau dans une cellule de tableau, celle d'une phrase partout ailleurs, `description` et `resume` compris.

- En français : « 57 francs » dans une phrase, « 57 CHF » dans un tableau ; une fourchette, « 25 à 200 francs » ou « 25 à 200 CHF » ; les milliers, « 1 240 » ; les décimales, « 128,75 ».
- En allemand : « 57 Franken » dans une phrase, « CHF 57.– » dans un tableau ; une fourchette, « 25 bis 200 Franken » ou « CHF 25–200 » ; les milliers, « 1’240 » ; les décimales, « 128.75 ».

## Le coût à la minute d'un numéro de garde

Seul montant tapé à la main : le coût à la minute d'un numéro de garde en 0900. Il vit dans le champ `garde` de la fiche du cabinet ([fiche-clinique.md](fiche-clinique.md)) et s'écrit à côté du numéro : « 2 francs la minute », « 2 CHF/min » dans un tableau ; en allemand « 2 Franken pro Minute », « CHF 2.–/Min. » dans un tableau.

## La page `/grille-des-prix/`

La page `/grille-des-prix/` montre toutes les grilles. Pour chaque cabinet, chaque prix avec son libellé, son montant, son calcul s'il en a un, son service et les pages qui l'affichent. Elle n'est ni indexée ni dans le plan du site ; aucune page n'y mène. Quiconque a le lien peut l'ouvrir, ce qui ne pose pas de problème : les prix sont publics sur les pages Tarifs.

## Ce que le site vérifie

La construction refuse une grille mal formée, une clé en double, un calcul qui cite une clé absente ou tourne en boucle, un jeton inconnu de la grille. `pnpm verifier` refuse un montant tapé dans un texte et un jeton mal placé. La liste est dans [verifications.md](verifications.md).

## Les gestes courants

- **Changer un prix** : modifier son `montant`. Chaque page qui l'affiche suit : Tarifs, Abonnements, pages de service, accueil, questions fréquentes. Chaque calcul qui cite sa clé suit aussi.
- **Ajouter un prix** : ajouter une entrée dans `prix`, avec une clé que la grille n'a pas, puis écrire son jeton dans le texte, en français et en allemand.
- **Montrer un prix sur la page d'un service** : lui donner le `service` de cette page commune. La page du service dans le cabinet le montre, à sa place dans l'ordre de la grille.
- **Retirer un prix** : retirer son jeton de chaque page, dans les deux langues (`grep -rn "{prix:<cle>}" src/content/pages`), puis sa clé des calculs qui la citent, puis son entrée.
- **Voir tous les prix et les pages qui les affichent** : ouvrir `/grille-des-prix/` dans la prévisualisation.
