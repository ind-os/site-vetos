---
name: mettre-une-clinique-en-ligne
description: "À suivre pour écrire et publier les pages d'une clinique Vetmint sur le site (Bussigny, La Chaux-de-Fonds, Domdidier, Fribourg Ouest, Lac-de-Joux, Saint-Blaise, Saint-Légier), sur le modèle de Payerne : fiche, grille des prix, photos, pages en français et en allemand, passage en ligne."
---

# Mettre une clinique en ligne

Les règles sont dans `docs/plan-des-pages.md` (les pages d'un cabinet), `docs/structure-des-pages.md` (ce que contient chacune), `docs/fiche-clinique.md` (la fiche), `docs/grille-des-prix.md` (les prix) et `docs/traduction.md`. Payerne est le modèle : ses pages sont dans `src/content/pages/fr/payerne/` et `src/content/pages/de/payerne/`, sa fiche dans `src/donnees/cliniques/payerne.json`, sa grille dans `src/donnees/tarifs/payerne.json`.

## 1. Compléter la fiche

1. Ouvre `src/donnees/cliniques/<clinique>.json`. Elle a déjà l'adresse, le téléphone, les horaires, la garde, les services et le lien de rendez-vous.
2. Ajoute, sur le modèle de `payerne.json` : `equipe`, `acces`, `communes`, `whatsapp` si la clinique en a un. Chaque texte affiché s'écrit en français et en allemand.
3. Vérifie la liste `services` avec la personne. Chaque service de la liste a sa page dans la clinique, que le site fabrique avec la fiche, la grille et la page commune du service : aucune page de service n'est à écrire.

## 2. Écrire la grille des prix

Crée `src/donnees/tarifs/<clinique>.json` sur le modèle de `payerne.json`, avec les prix de la clinique (`docs/grille-des-prix.md`, « Les gestes courants »). Un prix rattaché à un service par le champ `service` s'affiche sur la page de ce service dans la clinique. Contrôle la grille sur la page `/grille-des-prix/`.

## 3. Ajouter les photos

Copie les photos dans `src/assets/images/` et ajoute chacune au catalogue, comme le dit « Le catalogue des photos » de `docs/charte-graphique.md`. Une clinique a besoin d'une photo d'accueil, de photos de ses locaux et du portrait de chaque personne de l'équipe ; une personne sans portrait reste dans l'équipe.

## 4. Écrire les pages en français

Les pages à écrire sont dans `docs/plan-des-pages.md`, « Les pages d'un cabinet ». Pour chacune, suis la skill `rediger-une-page`, avec la même page de Payerne pour modèle. Les faits viennent de la fiche, de la grille et de la personne ; aucun ne se reprend de Payerne. Un prix s'écrit par son jeton `{prix:<cle>}`.

Tant que la fiche dit `"en_ligne": false`, les pages se prévisualisent mais les liens des autres pages mènent encore à l'adresse du champ `adresse_hors_ligne` de la fiche.

## 5. Traduire en allemand

Chaque page française a sa traduction, au même chemin dans `src/content/pages/de/<clinique>/`, avec les adresses allemandes de `docs/traduction.md` et les mêmes jetons de prix.

## 6. Passer en ligne

1. Mets `"en_ligne": true` dans la fiche.
2. Lance `pnpm verifier`. Il liste chaque page obligatoire qui manque, dans chaque langue, chaque prix inconnu de la grille et chaque lien cassé. Corrige jusqu'à ce qu'il passe.
3. Montre à la personne l'accueil de la clinique, une page de service avec ses prix et la page des cabinets, en allemand puis en français. Les liens vers la clinique mènent maintenant à ses pages.
4. Publie (geste « Publier » de `CLAUDE.md`).
