---
name: rediger-une-page
description: "À suivre pour écrire, réécrire ou traduire un texte du site Vetmint : une page d'une clinique, un service, un conseil santé, une page commune, un title ou une description. Donne les gestes dans l'ordre, du choix du fichier à la page vérifiée en français et en allemand."
---

# Rédiger une page

Les règles et le pourquoi sont dans `docs/` : le plan des pages (`docs/plan-des-pages.md`), le format (`docs/format-des-pages.md`), la voix et les plans types (`docs/charte-redactionnelle.md`), la traduction (`docs/traduction.md`). Cette skill dit les gestes et les vérifications. Lis la charte en entier à la première page d'une session.

## 1. Situer la page

1. Trouve le type de la page et son fichier dans `docs/plan-des-pages.md`. Une page qui existe se modifie dans son fichier ; une page nouvelle prend le chemin et le type du plan.
2. Relis le plan type de ce type dans la charte (section 3) : sections, volume, liens obligatoires, modèles de title et de description.
3. Note la recherche visée par la page : une seule expression, par exemple « radiographie chien Payerne ».

## 2. Rassembler les faits

1. La fiche de la clinique : `src/donnees/cliniques/<clinique>.json`.
2. Les pages du site qui parlent du sujet : `grep -rl "<mot>" src/content/pages/fr/`.
3. La personne qui demande la modification : un prix, un horaire, un nom qu'elle donne fait foi.
4. Quand deux sources se contredisent, garde les deux valeurs et demande à la personne laquelle est juste.

Un fait qui manque ne s'invente pas (charte, section 5). Ne s'inventent jamais : un nom de personne, un diplôme, un avis, un partenaire, une marque.

## 3. Écrire en français

1. L'en-tête d'abord, au format de `docs/format-des-pages.md`.
2. Le corps, section par section, selon le plan type. Le H1 n'est pas dans le corps.
3. Les horaires et le numéro de garde dans leur bloc de données, jamais écrits à la main.
4. Les liens obligatoires du plan type ; les téléphones en `tel:+41…`.
5. Relis une fois contre la voix de la charte : phrases courtes, aucun slogan, aucun adjectif de valeur, aucun tiret d'incise, aucun point d'exclamation.

Vérifie, et corrige jusqu'à zéro erreur :

```sh
python3 -I outils/verifier-page.py src/content/pages/fr/<chemin>.md
```

Si la page partage plus de 20 % de son texte avec une autre, réécris les passages communs à partir des faits propres à la page.

## 4. Traduire en allemand

1. Crée ou modifie `src/content/pages/de/<chemin>.md`, même chemin que le français, en suivant `docs/traduction.md` : en-tête, adresse allemande, liens, blocs, style suisse.
2. Une modification du français se reporte dans l'allemand le même jour, phrase par phrase.

Vérifie :

```sh
python3 -I outils/verifier-page.py src/content/pages/de/<chemin>.md
```

## 5. Montrer et vérifier le site

1. Ouvre la page en local dans les deux langues (`pnpm dev`, puis l'adresse du champ `url`). Le lien « DE » ou « FR » de l'en-tête passe de l'une à l'autre.
2. Lance `pnpm verifier` : types, construction, règles du site, liens.

## 6. Dire ce qui a changé

En français, court :

1. Les pages modifiées, leur adresse dans chaque langue, le résultat des vérifications.
2. Les faits qui restent à confirmer (`a_remplacer`) et qui peut les confirmer.
3. Les contradictions rencontrées entre sources.
4. Pour un service ou un conseil : la relecture par un vétérinaire reste à faire tant que la signature dit « Relecture vétérinaire en attente ».
