# Les campagnes

Une campagne est une offre du réseau limitée dans le temps : le trimestre dentaire, un mois de la prévention. Elle s'affiche dans un encart, sous le premier écran de l'accueil du site et de l'accueil de chaque cabinet. Le bloc est `src/composants/EncartCampagne.astro` ; il est montré dans `/styleguide/`.

Chaque campagne est un fichier, `src/donnees/campagnes/<nom>.json`. Astro le vérifie à chaque construction (`src/content.config.ts`) ; les règles d'affichage sont dans `src/lib/campagnes.ts`.

Une annonce pratique d'un seul cabinet, une fermeture, un samedi d'ouverture, n'est pas une campagne : c'est le `bandeau` de sa fiche ([fiche-du-cabinet.md](fiche-du-cabinet.md)).

## Les champs

| Champ | Contenu |
|---|---|
| `active` | l'interrupteur : `false` retire l'encart partout, quelles que soient les dates |
| `du` | facultatif : le premier jour, `AAAA-MM-JJ` ; sans lui, la campagne commence dès qu'elle est active |
| `jusqu_au` | le dernier jour, `AAAA-MM-JJ` ; l'encart l'affiche, « Jusqu'au 31 décembre », et disparaît le lendemain |
| `titre` | le titre de l'encart, `fr` et `de` : le nom de la campagne |
| `texte` | une ou deux phrases, `fr` et `de` : ce qui est offert, pour quels animaux |
| `bouton` | facultatif, `contact` par défaut : l'encart ajoute « Pour plus d'informations, contactez votre cabinet Vetmint » et le bouton mène à la liste des cabinets ; sur l'accueil d'un cabinet, « contactez le cabinet Vetmint Payerne » et le bouton mène à sa page Contact. `service` : le bouton « Découvrir l'offre » mène à la page du soin |
| `service` | avec `"bouton": "service"` : la page commune du service ; sur l'accueil d'un cabinet qui le propose, sa page du service dans le cabinet |
| `photo` | facultatif : le sujet de la photo dans le catalogue, `service:dentisterie` ; la même photo s'affiche sur l'accueil du site et dans chaque cabinet |
| `cabinets` | facultatif : la liste des cabinets où l'encart s'affiche, par leur identifiant ; sans liste, tous |
| `accueil_du_site` | facultatif, vrai par défaut : `false` garde l'encart sur les accueils des cabinets seulement |

Si plusieurs campagnes sont en cours, l'encart montre celle qui finit le plus tôt.

## Les gestes courants

- **Lancer une campagne** : un nouveau fichier dans `src/donnees/campagnes/`, avec ses dates, son titre et son texte dans les deux langues. On peut la préparer à l'avance : avec `du`, elle apparaît ce jour-là.
- **L'arrêter avant la fin** : `"active": false`.
- **La relancer** : `"active": true`, et une nouvelle date `jusqu_au` si l'ancienne est passée.
- **Une campagne finie** : on peut garder le fichier, `"active": false`, pour la reprendre l'année suivante.

Le site se reconstruit chaque nuit : une campagne apparaît et disparaît seule, au plus tard le matin du jour dit.

## Le texte

La voix de la [charte rédactionnelle](charte-redactionnelle.md) : ce qui est offert, à qui, jusqu'à quand. Pas de point d'exclamation, pas de « exceptionnel », pas de « profitez-en ». Un montant de réduction s'écrit dans la grille des prix du cabinet, pas dans l'encart.
