# Format des pages

Une page est un fichier Markdown avec un en-tête YAML. Astro vérifie l'en-tête à chaque construction (`src/content.config.ts`) : un champ manquant ou mal écrit arrête la construction avec le nom du fichier et du champ. Les règles d'écriture (voix, vocabulaire, plans types, référencement) sont dans la [charte de rédaction](charte-redactionnelle.md).

## En-tête

```yaml
---
type: accueil-clinique
clinique: payerne
url: /payerne/
title: "Vétérinaire à Payerne : clinique Vetmint Payerne"
description: "Clinique vétérinaire à Payerne pour chiens, chats, lapins et rongeurs. Consultation de 30 minutes sur rendez-vous, urgences, accès de plain-pied. 026 660 16 16."
h1: Clinique vétérinaire Vetmint Payerne
recherche: vétérinaire Payerne
redige_le: 2026-10-16
resume: Chiens, chats, lapins et rongeurs, route du Châtelard 13.
sources:
  - payerne.vetmint.ch (accueil, cabinet, contact), relevé du 16 octobre 2026
a_remplacer:
  - "Places de parc gratuites"
---
```

| Champ | Présence | Contenu |
|---|---|---|
| `type` | toujours | le type de page ([plan-des-pages.md](plan-des-pages.md)) |
| `clinique` | page d'une clinique | l'identifiant de la clinique, celui de son dossier (`payerne`) |
| `url` | toujours | l'adresse de la page, qui commence et finit par `/` ; en allemand, elle commence par `/de/` |
| `title` | toujours | 60 caractères au plus |
| `description` | toujours | 150 à 160 caractères |
| `h1` | s'il diffère du title | le titre de la page ; le corps n'a aucun titre de niveau 1 |
| `nom` | services | le nom court, pour les pastilles et le fil d'Ariane : « Radiographie » |
| `recherche` | toujours | l'expression visée par la page, une seule |
| `redige_le` | toujours | date AAAA-MM-JJ |
| `sources` | toujours | d'où viennent les faits ; note de travail, jamais affichée |
| `auteur`, `relecteur`, `relu_le` | service et conseil | `Rédaction Vetmint`, `en attente`, `en attente` tant qu'un vétérinaire n'a pas relu |
| `a_remplacer` | si la page contient un fait inventé | la liste des faits à confirmer, un par ligne ; note de travail. `pnpm faits-a-remplacer` les liste pour tout le site |
| `ordre` | facultatif | la position dans une liste (services, conseils) |
| `resume` | facultatif | une phrase de 20 mots au plus, pour les cartes et l'accroche |
| `especes` | service et conseil | `[chien, chat, nac]` |

Une valeur qui contient « : » se met entre guillemets.

## Corps

- Le corps commence par le chapeau, un paragraphe un peu plus grand ; puis des sections `##` et des sous-sections `###`.
- Un appel à l'action est un lien seul sur sa ligne : `[Prendre rendez-vous](/payerne/rendez-vous/)`. Il devient un bouton.
- Une liste dont chaque point commence par un lien devient une liste de cartes : `- [Radiographie](/services/radiographie/) : os, poumons, ventre.`
- Les liens vers le site sont relatifs et écrits avec l'adresse de la page dans la langue de la page : `/payerne/contact/`, `/de/payerne/kontakt/`. Un lien vers une clinique pas encore en ligne garde son adresse définitive ([plan-des-pages.md](plan-des-pages.md)).
- Téléphones : `[026 660 16 16](tel:+41266601616)`. E-mails : `[payerne@vetmint.ch](mailto:payerne@vetmint.ch)`.
- Questions fréquentes : chaque question est un `###`, la réponse suit.
- Tableaux Markdown pour les prix et les calendriers.
- Pas d'image dans le corps : les gabarits placent les photos.
- Pas de HTML, hors les blocs de données ci-dessous.
- Les services et les conseils finissent par leur signature : « Rédigé par la rédaction Vetmint. Relecture vétérinaire en attente. », puis « Relu par … le … » après la relecture.

## Blocs de données

Les horaires, les fermetures et le numéro de garde viennent de la fiche de la clinique ([fiche-clinique.md](fiche-clinique.md)). Dans une page, le passage qui les affiche est encadré par deux commentaires ; le texte entre eux est remplacé, à la construction, par la valeur de la fiche.

```markdown
<!-- donnees: horaires -->
- Lundi : 8 h à 12 h et 14 h à 18 h
<!-- /donnees -->
```

Blocs : `horaires`, `fermetures`, `garde`. Le texte autour reste vrai quelle que soit la valeur du jour : il dit quand appeler la garde, sans redonner le numéro.

Un bloc appartient à la clinique du champ `clinique`. Sur une page qui présente plusieurs cliniques (`/cliniques/`), il appartient à la clinique que nomme le titre `##` qui le précède (« ## Vetmint Payerne »).

## Vérifier une page

```sh
python3 -I outils/verifier-page.py src/content/pages/fr/payerne/tarifs.md
```

Le script contrôle le volume, le title, la description, le H1, les titres, les liens obligatoires, les tournures interdites et la part de texte commune avec les autres pages (20 % au plus). Une page allemande passe les contrôles de forme.
