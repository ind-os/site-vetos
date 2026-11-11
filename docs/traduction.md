# Traduction en allemand

Tout le site existe en français et en allemand. Le français est la langue de rédaction ; l'allemand en est la traduction, page par page. Ce document dit où vit chaque texte, comment écrire une page allemande et quelle adresse allemande correspond à chaque page.

## Où vivent les textes

| Texte | Français | Allemand |
|---|---|---|
| Une page | `src/content/pages/fr/<chemin>.md` | `src/content/pages/de/<chemin>.md`, même chemin, même nom de fichier |
| Les textes de l'interface (menus, boutons, titres des blocs) | `src/i18n/fr.ts` | `src/i18n/de.ts`, mêmes clés |
| Les textes d'une fiche de clinique (fonctions, accès, tarif de garde) | champ `fr` | champ `de` du même objet, dans `src/donnees/cliniques/<clinique>.json` |
| Le texte alternatif d'une photo | champ `alt.fr` | champ `alt.de`, dans `src/assets/images/catalogue.json` |

Le même chemin relie une page à sa traduction : `fr/payerne/equipe.md` et `de/payerne/equipe.md`. Le lien « DE » ou « FR » de l'en-tête mène de l'une à l'autre. La construction s'arrête si une page n'a pas sa traduction, ou si une clé de `fr.ts` ou de `de.ts` manque dans l'autre.

## Écrire une page allemande

1. Copier l'en-tête de la page française et traduire `title`, `description`, `h1`, `nom`, `recherche` et `resume`. `title` garde 60 caractères au plus ; `description` 150 à 160 caractères.
2. Remplacer `url` par l'adresse allemande de la table ci-dessous.
3. Garder tels quels `type`, `clinique`, `redige_le`, `especes` et `ordre`.
4. Traduire le corps phrase par phrase, sans rien ajouter ni retirer. Les faits, les chiffres, les prix et les noms restent identiques.
5. Remplacer chaque lien interne par l'adresse allemande de la même page. Les liens `tel:`, `mailto:` et les adresses externes ne changent pas.
6. Garder les blocs de données et leurs marqueurs `<!-- donnees: horaires -->` et `<!-- /donnees -->` ; traduire les lignes entre les marqueurs.
7. Vérifier : `node outils/verifier-les-pages.mjs --doublons src/content/pages/de/<chemin>.md`.

## Le style

- Vouvoiement : « Sie ».
- Orthographe suisse : « ss » à la place de « ß » (« Strasse », « schliessen », « Grösse »).
- Phrases courtes, comme en français. Pas de tiret d'incise, pas de point d'exclamation.
- Les noms de lieu des cliniques restent en français : Payerne, Bussigny, Fribourg Ouest, Saint-Légier. Les cantons se traduisent : Waadt, Freiburg, Neuenburg. Les lacs aussi : Neuenburgersee, Genfersee.
- Heures : « 8 Uhr », « 13.45 Uhr », « 8–12 Uhr ». Prix : « 57 Franken » dans une phrase, « CHF 57.– » dans un tableau.
- Les sigles se traduisent : CFF devient SBB.

## Le vocabulaire

| Français | Allemand |
|---|---|
| clinique vétérinaire Vetmint Payerne | Tierarztpraxis Vetmint Payerne |
| la clinique, les cliniques | die Praxis, die Praxen |
| vétérinaire | Tierärztin, Tierarzt ; au pluriel Tierärztinnen und Tierärzte |
| assistante en médecine vétérinaire (AMV) | Tiermedizinische Praxisassistentin (TPA) |
| consultation | Konsultation |
| bilan de santé, bilan annuel | Gesundheitscheck, Jahrescheck |
| prendre rendez-vous | einen Termin vereinbaren |
| urgence | Notfall |
| service de garde, numéro de garde | Notfalldienst, Notfallnummer |
| appel surtaxé | kostenpflichtiger Anruf |
| NAC (nouveaux animaux de compagnie) | Heimtiere (Kaninchen, Nager, Vögel, Reptilien) |
| stérilisation et castration | Kastration und Sterilisation |
| détartrage | Zahnsteinentfernung |
| puce électronique | Mikrochip |
| plan de prévention | Präventionsplan |
| abonnement | Abonnement, au pluriel Abonnemente |
| conseils santé | Gesundheitsratgeber |
| propriétaire | Halterin, Halter |
| Bons soins vétérinaires | Gute tierärztliche Versorgung |

## Les adresses allemandes

L'adresse allemande d'une page est l'adresse française précédée de `/de/`, avec chaque morceau traduit. Les identifiants des cliniques ne se traduisent pas.

### Pages communes

| Français | Allemand |
|---|---|
| `/` | `/de/` |
| `/cabinets/` | `/de/praxen/` |
| `/urgences/` | `/de/notfall/` |
| `/tarifs/` | `/de/preise/` |
| `/abonnements/` | `/de/abonnemente/` |
| `/a-propos/` | `/de/ueber-uns/` |
| `/remettre-un-cabinet/` | `/de/praxisuebergabe/` |
| `/emploi/` | `/de/jobs/` |
| `/confidentialite/` | `/de/datenschutz/` |
| `/mentions-legales/` | `/de/impressum/` |
| `/services/` | `/de/leistungen/` |
| `/conseils/` | `/de/ratgeber/` |
| `/conseils/chien/` | `/de/ratgeber/hund/` |
| `/conseils/chat/` | `/de/ratgeber/katze/` |
| `/conseils/nac/` | `/de/ratgeber/heimtiere/` |

### Services

Une page commune : `/services/<service>/` devient `/de/leistungen/<Leistung>/`. La page des services d'une clinique : `/<clinique>/services/` devient `/de/<clinique>/leistungen/`. La page d'un service dans une clinique : `/<clinique>/services/<service>/` devient `/de/<clinique>/leistungen/<Leistung>/`.

| Service | Leistung |
|---|---|
| `prevention` | `praevention` |
| `chirurgie` | `chirurgie` |
| `chirurgie-orthopedique` | `orthopaedische-chirurgie` |
| `dentisterie` | `zahnmedizin` |
| `radiographie` | `roentgen` |
| `echographie` | `ultraschall` |
| `endoscopie` | `endoskopie` |
| `hospitalisation` | `stationaere-betreuung` |
| `analyses-sanguines` | `blutanalysen` |
| `laser` | `lasertherapie` |
| `nac` | `heimtiere` |
| `visites-a-domicile` | `hausbesuche` |

### Conseils santé

`/conseils/<conseil>/` devient `/de/ratgeber/<Ratgeber>/`.

| Conseil | Ratgeber |
|---|---|
| `le-lapin` | `das-kaninchen` |
| `le-cochon-d-inde` | `das-meerschweinchen` |
| `le-rat` | `die-ratte` |
| `hyperthyroidie-feline` | `schilddruesenueberfunktion-katze` |
| `bilan-sanguin` | `blutuntersuchung` |
| `diabete-du-chien` | `diabetes-hund` |
| `pancreatite-du-chien` | `pankreatitis-hund` |
| `obesite-du-chat` | `uebergewicht-katze` |
| `alimentation-du-lapin` | `ernaehrung-kaninchen` |
| `sterilisation-du-lapin` | `kastration-kaninchen` |
| `maladie-dentaire-du-lapin` | `zahnerkrankungen-kaninchen` |
| `otites-du-lapin` | `ohrenentzuendung-kaninchen` |
| `rhinite-du-lapin` | `schnupfen-kaninchen` |
| `pododermatite-du-lapin` | `pododermatitis-kaninchen` |
| `encephalitozoonose` | `encephalitozoonose` |
| `arthrose-des-nac` | `arthrose-heimtiere` |
| `mycoplasmose` | `mykoplasmose-ratte` |
| `sablose-urinaire` | `harngriess` |
| `troubles-de-la-ponte` | `legenot-vogel` |
| `nebulisations-et-inhalations` | `inhalation` |
| `peca-pecalbo` | `peca-pecalbo` |

### Pages d'une clinique

Pour chaque clinique, par exemple `payerne` :

| Français | Allemand |
|---|---|
| `/payerne/` | `/de/payerne/` |
| `/payerne/equipe/` | `/de/payerne/team/` |
| `/payerne/contact/` | `/de/payerne/kontakt/` |
| `/payerne/tarifs/` | `/de/payerne/preise/` |
| `/payerne/abonnements/` | `/de/payerne/abonnemente/` |
| `/payerne/rendez-vous/` | `/de/payerne/termin/` |
| `/payerne/questions-frequentes/` | `/de/payerne/haeufige-fragen/` |
| `/payerne/urgences/` | `/de/payerne/notfall/` |
| `/payerne/services/` | `/de/payerne/leistungen/` |
| `/payerne/services/<service>/` | `/de/payerne/leistungen/<Leistung>/` |
