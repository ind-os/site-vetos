# Format des pages

Une page est un fichier Markdown avec un en-tête YAML. Astro vérifie l'en-tête à chaque construction (`src/content.config.ts`) : un champ manquant ou mal écrit arrête la construction avec le nom du fichier et du champ. Les règles d'écriture (voix, vocabulaire, typographie, référencement) sont dans la [charte de rédaction](charte-redactionnelle.md), les sections de chaque type de page dans [structure-des-pages.md](structure-des-pages.md). « Script » : `outils/verifier-les-pages.mjs` contrôle la règle.

## En-tête

```yaml
---
type: accueil-clinique
clinique: payerne
url: /payerne/
title: "Vétérinaire à Payerne : cabinet Vetmint Payerne"
description: "Cabinet vétérinaire à Payerne pour chiens, chats et NAC. Consultation de 30 minutes sur rendez-vous, urgences, accès de plain-pied. 026 660 16 16."
h1: Cabinet vétérinaire Vetmint Payerne
recherche: vétérinaire Payerne
redige_le: 2026-10-16
resume: Chiens, chats et NAC, route du Châtelard 13. Consultations de 30 minutes sur rendez-vous.
---
```

| Champ | Présence | Contenu |
|---|---|---|
| `type` | toujours | le type de page ([plan-des-pages.md](plan-des-pages.md)) |
| `clinique` | page d'un cabinet | l'identifiant du cabinet, celui de son dossier (`payerne`) |
| `url` | toujours | l'adresse de la page, qui commence et finit par `/` ; en allemand, elle commence par `/de/` |
| `title` | toujours | 60 caractères au plus |
| `description` | toujours | 150 à 160 caractères |
| `h1` | s'il diffère du title | le titre de la page ; le corps n'a aucun titre de niveau 1 |
| `nom` | services | le nom court, pour les pastilles et le fil d'Ariane : « Radiographie » |
| `recherche` | toujours | l'expression visée par la page, une seule |
| `redige_le` | toujours | date AAAA-MM-JJ |
| `ordre` | facultatif | la position dans une liste (services, conseils) |
| `resume` | facultatif | une phrase de 20 mots au plus, pour les cartes et l'accroche |
| `especes` | service et conseil ; obligatoire sur une page `conseil-categorie`, dont il donne l'espèce | `[chien, chat, nac]` |
| `en_phrase` | page commune d'un service ; obligatoire quand une fiche cite le service | le nom du soin tel qu'il s'écrit dans une phrase, avec son article : « la radiographie », « les visites à domicile » ; en allemand, à l'accusatif : « das Röntgen », « den Ultraschall », « Hausbesuche ». La page du service dans chaque cabinet l'écrit dans son bouton « Tout lire sur … » ([structure-des-pages.md](structure-des-pages.md)) |
| `presentation_dans_le_cabinet` | page commune d'un service ; obligatoire quand une fiche cite le service | la présentation du soin dans un cabinet, trois phrases environ, valables pour chaque cabinet, avec les mots que l'on cherche ; `{cabinet}` y devient le nom du cabinet : « Le cabinet {cabinet} propose des soins dentaires à tous vos animaux, chiens, chats ou NAC. Nous disposons sur place du matériel pour le détartrage… ». C'est le chapeau de la page du service dans chaque cabinet ([structure-des-pages.md](structure-des-pages.md)) |

Une valeur qui contient « : » se met entre guillemets.

## Corps

- Le corps commence par le chapeau, un paragraphe un peu plus grand ; puis des sections `##` et des sous-sections `###`.
- Un appel à l'action est un lien seul sur sa ligne : `[Prendre rendez-vous](/payerne/rendez-vous/)`. Il devient un bouton.
- Une liste dont chaque point commence par un lien devient une liste de cartes : `- [Radiographie](/services/radiographie/) : os, poumons, ventre.`
- Les liens vers le site sont relatifs et écrits avec l'adresse de la page dans la langue de la page : `/payerne/contact/`, `/de/payerne/kontakt/`. Un lien vers un cabinet pas encore en ligne garde son adresse définitive ([plan-des-pages.md](plan-des-pages.md)).
- Téléphones : `[026 660 16 16](tel:+41266601616)`. E-mails : `[payerne@vetmint.ch](mailto:payerne@vetmint.ch)`.
- Questions fréquentes : chaque question est un `###`, la réponse suit.
- Tableaux Markdown pour les prix et les calendriers.
- Pas d'image dans le corps : les gabarits placent les photos. Script.
- Pas de HTML, hors les marqueurs des blocs de données ci-dessous. Script.

## Les prix

Sur une page d'un cabinet, un montant s'écrit par son jeton, `{prix:<cle>}`, dans le corps et dans les champs `description` et `resume`. Le site le remplace par le montant de la grille du cabinet. La grille, les endroits où un jeton ne s'écrit jamais et les formes d'un montant sont dans [grille-des-prix.md](grille-des-prix.md).

```markdown
| Consultation sur rendez-vous | 30 minutes avec un vétérinaire, examen complet et conseils | {prix:consultation} |
```

## Blocs de données

Les horaires, les fermetures et le numéro de garde viennent de la fiche du cabinet ([fiche-du-cabinet.md](fiche-du-cabinet.md)). Dans une page, le passage qui les affiche est encadré par deux commentaires ; le texte entre eux est remplacé, à la construction, par la valeur de la fiche.

```markdown
<!-- donnees: horaires -->
- Lundi : 8 h à 12 h et 14 h à 18 h
<!-- /donnees -->
```

Blocs : `horaires`, `fermetures`, `garde`. Le texte autour reste vrai quelle que soit la valeur du jour : il dit quand appeler la garde, sans redonner le numéro.

Un bloc appartient au cabinet du champ `clinique`. Sur une page qui présente plusieurs cabinets (`/cabinets/`), il appartient au cabinet que nomme le titre `##` qui le précède (« ## Vetmint Payerne »).

## Vérifier une page

```sh
node outils/verifier-les-pages.mjs --doublons src/content/pages/fr/payerne/tarifs.md
```

Le script contrôle l'en-tête, le title, la description, le H1 et les titres, le volume du type de page, les liens obligatoires, les tournures interdites, les prix, le HTML et les images dans le corps et, avec `--doublons`, la part de texte commune avec les autres pages de la même langue (20 % au plus). Une page allemande passe les contrôles de forme. `pnpm verifier` passe toutes les pages, sans la mesure des doublons ([verifications.md](verifications.md)).
