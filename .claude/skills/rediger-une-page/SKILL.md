---
name: rediger-une-page
description: "À suivre pour écrire, réécrire ou traduire un texte du site Vetmint : une page d'une clinique, un service, un conseil santé, une page commune, un title ou une description. Donne les gestes dans l'ordre, du choix du fichier à la page vérifiée en français et en allemand."
---

# Rédiger une page

Les règles et le pourquoi sont dans `docs/` : le plan des pages (`docs/plan-des-pages.md`), ce que contient chaque type de page (`docs/structure-des-pages.md`), le format (`docs/format-des-pages.md`), les prix (`docs/grille-des-prix.md`), la voix, le vocabulaire et le référencement (`docs/charte-redactionnelle.md`), la traduction (`docs/traduction.md`). Cette skill dit les gestes et les vérifications. Lis la charte en entier à la première page d'une session.

## 1. Situer la page

1. Trouve le type de la page et son fichier dans `docs/plan-des-pages.md`. Une page qui existe se modifie dans son fichier ; une page nouvelle prend le chemin et le type du plan.
2. La page d'un service dans un cabinet n'a pas de fichier : le site la fabrique avec la fiche du cabinet, sa grille des prix et la page commune du service (`docs/structure-des-pages.md`, « Un service dans le cabinet »). Elle se modifie à ces trois endroits, jamais ailleurs.
3. Lis le plan du type dans `docs/structure-des-pages.md` : les sections dans l'ordre, le volume, la forme du title, du H1 et de la description, les liens obligatoires.
4. Ouvre une page existante du même type (champ `type` de l'en-tête) et prends-la pour modèle. Pour une page d'une clinique, la même page de Payerne.
5. Si la demande de la personne s'écarte du plan (une section en moins, un ordre différent, un texte bien plus long ou plus court), dis-le-lui avant d'écrire : ce que le plan prévoit, et ce que sa demande change pour l'homogénéité du site. Fais ce qu'elle décide.
6. Note la recherche visée par la page : une seule expression, par exemple « radiographie chien Payerne ».

## 2. Rassembler les faits

1. La fiche de la clinique : `src/donnees/cliniques/<clinique>.json`.
2. La grille des prix du cabinet : `src/donnees/tarifs/<cabinet>.json`. Un prix absent de la grille s'y ajoute d'abord (`docs/grille-des-prix.md`, « Les gestes courants »).
3. Les pages du site qui parlent du sujet : `grep -rl "<mot>" src/content/pages/fr/`.
4. La personne qui demande la modification : un prix, un horaire, un nom qu'elle donne fait foi.
5. Quand deux sources se contredisent, garde les deux valeurs et demande à la personne laquelle est juste.

Un fait qui manque ne s'invente pas (charte, section 4). Ne s'inventent jamais : un nom de personne, un diplôme, un avis, un partenaire, une marque.

## 3. Écrire en français

1. L'en-tête d'abord, au format de `docs/format-des-pages.md`.
2. Le corps, section par section, dans l'ordre du plan du type et sur le modèle de la page choisie. Le H1 n'est pas dans le corps.
3. Les horaires et le numéro de garde dans leur bloc de données, chaque prix par son jeton `{prix:<cle>}` : jamais écrits à la main.
4. Les liens vers les pages liées (rendez-vous, tarifs, page commune du service) ; les téléphones en `tel:+41…`.
5. Relis une fois contre la voix de la charte : phrases courtes, aucun slogan, aucun adjectif de valeur, aucun tiret d'incise, aucun point d'exclamation.

Pour une page commune de service, son premier paragraphe s'affiche seul sur la page du soin dans chaque cabinet, et le reste du texte s'y déplie au clic. Ce premier paragraphe se lit sans la suite et reste vrai pour chaque cabinet.

Vérifie, et corrige jusqu'à zéro erreur :

```sh
node outils/verifier-les-pages.mjs --doublons src/content/pages/fr/<chemin>.md
```

Si la page partage plus de 20 % de son texte avec une autre, réécris les passages communs à partir des faits propres à la page.

## 4. Traduire en allemand

1. Crée ou modifie `src/content/pages/de/<chemin>.md`, même chemin que le français, en suivant `docs/traduction.md` : en-tête, adresse allemande, liens, blocs, jetons de prix identiques, style suisse.
2. Une modification du français se reporte dans l'allemand le même jour, phrase par phrase.

Vérifie :

```sh
node outils/verifier-les-pages.mjs --doublons src/content/pages/de/<chemin>.md
```

## 5. Montrer et vérifier le site

1. Ouvre la page en local dans les deux langues (`pnpm dev`, puis l'adresse du champ `url`), l'allemand d'abord, le français en dernier. Le lien « DE » ou « FR » de l'en-tête passe de l'une à l'autre.
2. Pour une page commune de service, ouvre aussi la page de ce soin dans un cabinet qui le pratique, `/payerne/services/<service>/`, et clique « Tout lire » : le texte modifié s'y retrouve.
3. Lance `pnpm verifier` : pages, prix, charte, types, construction, liens.

## 6. Dire ce qui a changé

En français, court :

1. Les pages modifiées, leur adresse dans chaque langue, le résultat des vérifications.
2. Pour une page commune de service ou un prix : les pages des cabinets qui affichent le changement.
3. Les faits que tu as retirés faute de les connaître.
4. Ce que la personne a choisi hors du plan du type, s'il y a lieu.
