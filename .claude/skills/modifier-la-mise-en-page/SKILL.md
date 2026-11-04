---
name: modifier-la-mise-en-page
description: "À suivre pour changer la mise en page du site Vetmint : modifier un bloc, en ajouter un, changer une couleur, un espacement, une police, la disposition d'une page. Donne les gestes dans l'ordre, du styleguide à la vérification, pour que le site reste homogène."
---

# Modifier la mise en page

Les règles et le pourquoi sont dans `docs/charte-graphique.md` : le sens de chaque couleur, la typographie, les boutons, les cartes, les photos, le survol, le catalogue des photos. Cette skill dit les gestes et les vérifications. Les blocs vivent dans `src/composants/`, les gabarits de page dans `src/gabarits/`, les jetons (couleurs, espacements, rayons, polices) dans `src/styles/charte.css`.

## 1. Chercher le bloc qui existe

1. Ouvre `/styleguide/` dans le navigateur et parcours `src/composants/` : chaque bloc y est montré avec ses variantes et la façon de l'écrire.
2. Nomme le bloc existant qui convient à la demande. Une page se construit avec les blocs existants ; un bloc ne se crée que si aucun ne convient.
3. Si la personne veut un bloc nouveau là où un bloc existe, dis-le-lui avant de modifier : le bloc qui fait déjà ce qu'elle demande, et ce qu'un bloc de plus change pour l'homogénéité du site. Fais ce qu'elle décide.

## 2. Modifier ou créer le bloc

1. Les couleurs, les espacements, les rayons et les polices viennent des jetons de `src/styles/charte.css`. Aucune valeur écrite en dur. Une couleur nouvelle est un jeton nouveau, avec son sens en commentaire, et seulement si elle code quelque chose.
2. Un cadre de carte (fond blanc, filet, coins arrondis) est la classe `carte` de la charte, posée sur l'élément racine du bloc ; le bloc n'écrit que ce qui lui est propre.
3. Au survol, seule la couleur change. Rien ne bouge, ne pivote ni ne grandit.
4. Un texte d'interface (titre d'un bloc, libellé d'un lien, étiquette) s'écrit dans `src/i18n/fr.ts` et, avec la même clé, dans `src/i18n/de.ts`.
5. Un style qui se répète dans trois blocs devient une classe de `src/styles/charte.css` ou un bloc.

## 3. Montrer le bloc dans le styleguide

Le jour même, ajoute ou mets à jour le bloc dans `src/pages/styleguide/index.astro` : son nom, à quoi il sert, son rendu avec ses variantes, et le code pour l'écrire. Un bloc absent du styleguide arrête la vérification.

## 4. Vérifier

```sh
node outils/verifier-la-charte.mjs
pnpm verifier
```

Le premier dit si un bloc manque au styleguide ou si une couleur est écrite en dur ; le second vérifie tout le site. Corrige jusqu'à ce que les deux passent.

## 5. Montrer

Ouvre dans le navigateur à côté de la conversation une page qui utilise le bloc, en français puis en allemand, à la largeur d'un ordinateur puis à celle d'un téléphone (réduis la fenêtre). Montre aussi `/styleguide/`.

## 6. Dire ce qui a changé

En français, court : le bloc modifié ou créé, les pages où il apparaît, les jetons ajoutés et leur sens, le résultat des vérifications, et ce que la personne a choisi hors de la charte, s'il y a lieu.
