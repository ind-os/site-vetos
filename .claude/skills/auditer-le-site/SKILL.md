---
name: auditer-le-site
description: "À lancer de temps en temps, quand la personne demande une relecture complète du site Vetmint, un nettoyage ou un audit : passe toutes les vérifications, relit ce qu'aucun script ne voit, rapporte en mots simples et corrige sur accord, thème par thème. Jamais à chaque modification."
---

# Auditer le site

Cette skill relit tout le site, textes et code, et le remet d'équerre. Elle se lance à la demande de la personne, pas à chaque modification : la vérification de chaque publication (`pnpm verifier`) suffit au quotidien. Les règles sont dans `docs/` ; `docs/verifications.md` dit ce que les scripts contrôlent et ce qui reste une convention.

## 1. Annoncer

Dis à la personne, en deux phrases, ce que l'audit fait : les vérifications complètes du site, puis une relecture des conventions que les scripts ne voient pas. Il prend quelques minutes. Rien n'est modifié avant son accord.

## 2. Lancer les vérifications complètes

```sh
pnpm auditer
```

La commande vérifie les pages, la charte, les types, la construction et les liens, puis mesure le texte commun entre toutes les pages. Note chaque erreur et chaque alerte, avec le fichier en cause.

## 3. Relire ce qu'aucun script ne voit

Passe chaque point, et note ce qui s'écarte des conventions :

1. **La structure des pages** : pour chaque type de page, compare deux ou trois pages avec son plan dans `docs/structure-des-pages.md`. Les sections attendues sont là, dans l'ordre ; une section de plus ou de moins est notée.
2. **Les blocs** : un style répété dans trois blocs de `src/composants/` ou de `src/gabarits/` (même cadre, même grille, mêmes marges) ; un mouvement au survol (`transform`, `translate`, `scale`, `rotate`) ; une valeur écrite en dur là où un jeton de `src/styles/charte.css` existe.
3. **Les faits** : un numéro de téléphone, une adresse ou un horaire qui diffère entre la fiche d'une clinique et ses textes, ou entre deux pages. `grep -rn "<nombre>" src/content/pages src/donnees` sur chaque numéro des pages Urgences et Contact. Les prix viennent de la grille de chaque cabinet : la page `/grille-des-prix/` montre chaque prix et les pages qui l'affichent ; un prix affiché sur aucune page se signale.
4. **Les pages de service des cabinets** : ouvre-en deux par cabinet. Le premier paragraphe de la page commune se lit seul, les prix du soin sont ceux de la grille, « Tout lire » déplie le texte.
5. **Ce que rien n'utilise** : une clé de `src/i18n/fr.ts` qu'aucun composant ni gabarit ne lit ; une photo de `src/assets/images/catalogue.json` dont le sujet n'est demandé par aucune page ni aucun gabarit ; un bloc de `src/composants/` que rien n'importe hors du styleguide.
6. **Les renvois** : un commentaire du code, une doc ou une skill qui cite un fichier, une section ou une commande qui n'existe pas.
7. **Les deux langues** : une page dont la traduction n'a pas le même nombre de sections, de liens ou de blocs de données.

## 4. Rapporter

Un rapport en français, en mots simples, groupé par thème : les textes, les faits, les blocs et la mise en page, le code, les deux langues. Pour chaque point : le fichier, le problème en une phrase, la correction proposée. Dis ce qui est une erreur refusée par les scripts et ce qui est un écart à une convention. Ne corrige rien sans l'accord de la personne.

## 5. Corriger sur accord

1. Corrige thème par thème, dans l'ordre que la personne choisit.
2. Après chaque thème : `pnpm verifier`, puis montre une page corrigée dans le navigateur, en français et en allemand.
3. Un commit par thème, avec un message qui dit ce qui change sur le site.
4. Publie seulement si la personne le demande (geste « Publier » de `CLAUDE.md`).
