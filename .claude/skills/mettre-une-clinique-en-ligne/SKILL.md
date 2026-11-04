---
name: mettre-une-clinique-en-ligne
description: "À suivre pour écrire et publier les pages d'une clinique Vetmint sur le site (Bussigny, La Chaux-de-Fonds, Domdidier, Fribourg Ouest, Lac-de-Joux, Saint-Blaise, Saint-Légier), sur le modèle de Payerne : fiche, photos, pages en français et en allemand, passage en ligne."
---

# Mettre une clinique en ligne

Les règles sont dans `docs/plan-des-pages.md` (les pages d'une clinique), `docs/fiche-clinique.md` (la fiche) et `docs/traduction.md`. Payerne est le modèle : ses pages sont dans `src/content/pages/fr/payerne/` et `src/content/pages/de/payerne/`, sa fiche dans `src/donnees/cliniques/payerne.json`.

## 1. Compléter la fiche

1. Ouvre `src/donnees/cliniques/<clinique>.json`. Elle a déjà l'adresse, le téléphone, les horaires, la garde, les services et le lien de rendez-vous.
2. Ajoute, sur le modèle de `payerne.json` : `accroche`, `equipe`, `acces`, `communes`, `whatsapp` si la clinique en a un. Chaque texte affiché s'écrit en français et en allemand.
3. Vérifie la liste `services` avec la clinique : chaque service a ensuite sa page.

## 2. Ajouter les photos

1. Copie les photos dans `src/assets/images/`, nommées `<clinique>-<sujet>.jpg`.
2. Ajoute une entrée par photo dans `src/assets/images/catalogue.json` : `sujet` (`<clinique>:accueil`, `<clinique>:locaux`, `<clinique>:equipe:<Nom Prénom>`), `alt` en français et en allemand, `point_focal`.

## 3. Écrire les pages en français

Les pages obligatoires sont dans `docs/plan-des-pages.md`, « Les pages d'une clinique ». Pour chacune, suis la skill `rediger-une-page`, avec la même page de Payerne pour modèle. Les faits viennent de la fiche de la clinique et de la personne ; aucun ne se reprend de Payerne.

Tant que la fiche dit `"en_ligne": false`, les pages se prévisualisent mais les liens des autres pages mènent encore à l'adresse du champ `adresse_hors_ligne` de la fiche.

## 4. Traduire en allemand

Chaque page française a sa traduction, au même chemin dans `src/content/pages/de/<clinique>/`, avec les adresses allemandes de `docs/traduction.md`.

## 5. Passer en ligne

1. Mets `"en_ligne": true` dans la fiche.
2. Lance `pnpm verifier`. Il liste chaque page obligatoire qui manque, dans chaque langue, et chaque lien cassé. Corrige jusqu'à ce qu'il passe.
3. Montre à la personne l'accueil de la clinique, une page de service et la page des cliniques, en français et en allemand. Les liens vers la clinique mènent maintenant à ses pages.
4. Publie (geste « Publier » de `CLAUDE.md`).
