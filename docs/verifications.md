# Ce que le site vérifie

Le site vérifie ses règles à trois moments. À la construction, donc aussi en prévisualisation, où le problème s'affiche dans le terminal sans arrêter le site. À `pnpm verifier`, avant chaque publication, en quelques secondes. À `pnpm auditer`, de temps en temps, avec les contrôles lents. Chaque message nomme le fichier et la règle en cause.

Tout ce qui n'est pas dans ces tables est une convention : la doc dit la règle, Claude l'applique, et la skill `auditer-le-site` la relit.

## À la construction

`pnpm build`, et `pnpm dev` pour la prévisualisation.

| Contrôle | Fichier | Ce qu'il protège |
|---|---|---|
| L'en-tête d'une page : `type` parmi les types connus, `url` en minuscules qui commence et finit par `/`, `title` de 60 caractères au plus, `description`, `recherche` et `redige_le` présents, `especes` parmi chien, chat et nac | `src/content.config.ts` | une page affichable et référençable |
| La fiche d'une clinique : chaque champ présent et bien formé, téléphone international, e-mail, textes dans les deux langues, outil de rendez-vous connu ; les dates sont `AAAA-MM-JJ` et existent dans le calendrier, `du` précède ou égale `au` dans une fermeture, une plage `08:00-12:00` a des heures de 00 à 24 et un début avant la fin | `src/content.config.ts` | les faits affichés sur toutes les pages de la clinique |
| La grille des prix d'un cabinet : `valable_des` est une date `AAAA-MM-JJ`, chaque `cle` est unique, en minuscules et tirets, chaque `libelle` a ses deux langues, un `montant` est un nombre, une fourchette ou un calcul ; un calcul ne cite que des nombres et des clés de la même grille, sans boucle | `src/content.config.ts`, calculs dans `src/lib/prix.ts` | les montants affichés sur toutes les pages du cabinet |
| Une grille porte l'identifiant d'une fiche ; le `service` d'un prix nomme une page commune de service | `src/lib/verifications.ts` | chaque prix s'affiche dans le bon cabinet et sur la bonne page de service |
| Un jeton `{prix:<cle>}`, dans le corps, la `description` ou le `resume`, ne s'écrit que sur une page d'un cabinet ; sa clé existe dans la grille de ce cabinet | `src/lib/verifications.ts` | aucun montant manquant ni pris dans la grille d'un autre cabinet |
| Chaque page existe dans les deux langues | `src/lib/verifications.ts` | le lien « DE » ou « FR » de chaque page |
| Chaque adresse est unique ; une adresse allemande commence par `/de/`, une française non | `src/lib/verifications.ts` | deux pages ne se remplacent pas l'une l'autre |
| Le champ `clinique` est obligatoire sur un type de page de clinique, interdit sur un type commun, et correspond au dossier de la page | `src/lib/verifications.ts` | la page lit la bonne fiche |
| Le champ `especes` est obligatoire sur une page `conseil-categorie` | `src/lib/verifications.ts` | la page des conseils d'une espèce sait laquelle |
| Les clés de `src/i18n/fr.ts` et de `de.ts` sont les mêmes, dans les deux sens | `src/i18n/index.ts` | aucun menu ni bouton sans l'autre langue |
| Chaque sujet du catalogue des photos nomme une clinique existante et, pour un portrait, une personne de sa fiche | `src/lib/images.ts` | aucune photo orpheline |
| Les pages d'une clinique dont la fiche dit `"en_ligne": false` se prévisualisent, mais la construction du site en ligne ne les construit pas, ne les met pas dans le plan du site et n'exige pas leur traduction | `src/lib/pages.ts` | une clinique s'écrit sans paraître |
| Chaque service cité par une fiche a sa page commune, avec les champs `en_phrase` et `soins_couverts` dans chaque langue | `src/lib/verifications.ts` | aucun lien de service vers le vide ; la page du service dans chaque cabinet |
| Une clinique en ligne a toutes ses pages obligatoires, dans les deux langues | `src/lib/verifications.ts`, liste dans `src/lib/types-de-page.ts` | une clinique complète |
| Un gabarit qui demande une page absente arrête la construction ; en prévisualisation, le lien mène à `#` et le terminal le dit | `src/lib/pages.ts` | aucun lien de navigation cassé |
| Un bloc de données a sa clinique et un type connu : horaires, fermetures, garde | `src/lib/donnees-de-la-clinique.ts` | les horaires et la garde affichés viennent de la fiche |
| Chaque photo du catalogue a son fichier | `src/lib/images.ts` | aucune image manquante |

Les messages de ces contrôles sont en français et nomment toujours le fichier et le champ ; seuls « Required » et « Expected type », qu'Astro écrit lui-même, restent en anglais.

## À `pnpm verifier`

Dans l'ordre : les pages, la charte, les types, la construction, les liens. Une erreur arrête la suite ; une alerte s'affiche et laisse passer. Sans argument, `verifier-les-pages` n'affiche que les pages en défaut et le bilan ; pour une page nommée, il affiche tout, informations comprises.

| Contrôle | Script | Ce qu'il protège |
|---|---|---|
| L'en-tête : champs présents, type connu, clinique connue sur une page de clinique, valeur avec « : » entre guillemets | `outils/verifier-les-pages.mjs`, erreur | une page lisible par le site |
| Le title : 60 caractères au plus, le lieu sur une page de clinique ; alerte s'il est très court ou si une page commune ne dit pas « Vetmint » | `verifier-les-pages`, erreur | le résultat de recherche |
| La description : 140 à 165 caractères ; alerte hors de 150 à 160 | `verifier-les-pages`, erreur | le résultat de recherche |
| Un seul H1, dans l'en-tête ; les niveaux de titre se suivent sans saut | `verifier-les-pages`, erreur | la structure lue par les moteurs et les lecteurs d'écran |
| Le volume du corps dans la fourchette du type ([structure-des-pages.md](structure-des-pages.md)), élargie en allemand | `verifier-les-pages`, erreur | des pages de même taille d'un type à l'autre |
| « vétérinaire » et « Vetmint » bien orthographiés | `verifier-les-pages`, erreur | la marque et le mot le plus cherché |
| Les tournures interdites en français : tiret d'incise, virgule avant « et », « permet de », point d'exclamation | `verifier-les-pages`, erreur | la voix de la charte |
| Un fait laissé « [à préciser] » | `verifier-les-pages`, erreur | aucun blanc en ligne |
| Les prix : un montant tapé hors d'un jeton, sauf le coût à la minute d'un numéro de garde ; un jeton sur une page commune ; un jeton dans le title, le h1 ou un titre ; un jeton inconnu de la grille du cabinet | `verifier-les-pages`, erreur | chaque prix écrit une fois, dans la grille du cabinet ([grille-des-prix.md](grille-des-prix.md)) |
| Les liens obligatoires du type de page ([structure-des-pages.md](structure-des-pages.md)) ; une page Urgences a deux `tel:` distincts | `verifier-les-pages`, erreur | le parcours rendez-vous, tarifs, urgences, contact |
| Un lien `tel:` bien formé ; aucun lien vers une page de l'autre langue | `verifier-les-pages`, erreur | des numéros qui composent, des langues qui ne se mélangent pas |
| Aucun HTML dans le corps, hors les marqueurs de bloc ; aucune image dans le corps | `verifier-les-pages`, erreur | la mise en page reste aux gabarits |
| Les mots à éviter de la charte, « nouveau », les capitales hors sigles, les points de suspension | `verifier-les-pages`, alerte | la voix de la charte |
| Les phrases de plus de 30 mots, une moyenne au-dessus de 20, un passage de plus de 300 mots sans intertitre | `verifier-les-pages`, alerte | la lisibilité |
| Les mots de la recherche visée absents du title ou des 160 premiers mots | `verifier-les-pages`, alerte | le référencement de la page |
| Un lien en `http://`, un lien interne sans barre oblique finale | `verifier-les-pages`, alerte | des liens propres |
| Chaque bloc de `src/composants/` est montré dans le styleguide, sauf EnTete, PiedDePage, Logo et TeteHtml | `outils/verifier-la-charte.mjs`, erreur | un styleguide complet |
| Aucune couleur écrite en dur hors de `src/styles/` | `verifier-la-charte`, erreur | des couleurs qui portent un sens ([charte-graphique.md](charte-graphique.md)) |
| Les types du code | `astro check` | un code cohérent |
| Tout ce qui est vérifié à la construction | `astro build` | |
| Chaque lien interne des pages construites mène à une page qui existe | `outils/verifier-les-liens.mjs`, erreur | aucun lien cassé |

Une page allemande passe les contrôles de forme : en-tête, title, description, titres, volume, liens, prix, HTML. Les règles de style sont propres au français.

## À `pnpm auditer`

`pnpm verifier`, puis la mesure du texte commun sur toutes les pages (`node outils/verifier-les-pages.mjs --doublons`) : plus de 20 % de groupes de six mots partagés avec une autre page de la même langue est une erreur. Cette mesure compare chaque page à toutes les autres : elle prend une demi-minute par langue, d'où sa place hors de la vérification courante. La skill `rediger-une-page` la lance sur la page en cours d'écriture.

## Tout le reste est une convention

La doc dit la règle, Claude l'applique, et prévient la personne quand une demande s'en écarte : ce que la convention prévoit, ce que la demande change pour l'homogénéité du site, puis il fait ce qu'elle décide. La skill `auditer-le-site` relit ces conventions de temps en temps.

| Convention | Doc |
|---|---|
| L'ordre, le contenu et la longueur des sections de chaque type de page | [structure-des-pages.md](structure-des-pages.md) |
| La voix, le vocabulaire, la typographie, les faits manquants | [charte-redactionnelle.md](charte-redactionnelle.md) |
| Les couleurs et leur sens, le survol sans mouvement, la classe `.carte`, un style répété qui devient une classe, le catalogue des photos | [charte-graphique.md](charte-graphique.md) |
| Quelle page vit où, et ce que chaque gabarit ajoute au texte | [plan-des-pages.md](plan-des-pages.md) |
| Le format d'une page et les blocs de données | [format-des-pages.md](format-des-pages.md) |
| Les champs de la fiche et les gestes courants | [fiche-clinique.md](fiche-clinique.md) |
| Les clés, les libellés et l'ordre des prix d'une grille, les gestes courants | [grille-des-prix.md](grille-des-prix.md) |
| La traduction, le style suisse, les adresses allemandes | [traduction.md](traduction.md) |
