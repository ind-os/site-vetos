# Structure des pages

Ce que contient chaque type de page, dans quel ordre et à quelle longueur. Ces plans sont la convention du site : une page nouvelle les suit, une page modifiée les garde. Quand la personne demande quelque chose qui s'en écarte, une section en moins, un ordre différent, un texte bien plus long ou plus court, Claude le lui dit avant de modifier : ce que le plan prévoit, ce que sa demande change pour l'homogénéité du site. Puis il fait ce qu'elle décide.

## Lire un plan

- Chaque plan donne l'objectif de la page, la recherche qu'elle vise, le modèle de son title et de son H1, ses sections dans l'ordre, son volume et ses liens obligatoires. « Script » : `outils/verifier-les-pages.mjs` contrôle la règle ([verifications.md](verifications.md)).
- Le volume est une fourchette de mots du corps, élargie pour une page allemande. Les liens obligatoires sont des adresses relatives ; `/<clinique>/…` désigne la clinique de la page. Le title fait 60 caractères au plus, la description 150 à 160 ([format-des-pages.md](format-des-pages.md)).
- Le chapeau est le premier paragraphe, sans titre. Les sections sont des `##`, leurs sous-sections des `###`. Le H1 n'est pas dans le corps. Les horaires, les fermetures et la garde s'écrivent dans un bloc de données.
- Une page d'une clinique prend la même page de Payerne pour modèle, avec ses propres faits. Sa traduction allemande garde les mêmes sections ([traduction.md](traduction.md)). Ce que le gabarit ajoute autour du texte est dans [plan-des-pages.md](plan-des-pages.md) : le texte ne le redit pas.

## Les pages d'une clinique

### Accueil de la clinique, `accueil-clinique`

- Objectif : qu'un propriétaire de la région comprenne en dix secondes où est la clinique, pour quels animaux, comment prendre rendez-vous et quoi faire en urgence.
- Recherche : « vétérinaire {Ville} ». Title : « Vétérinaire à {Ville} : clinique Vetmint {Ville} ». H1 : « Clinique vétérinaire Vetmint {Ville} ».
- Volume : 900 à 1 400 mots. Script.
- Liens obligatoires : `/<clinique>/rendez-vous/`, `/<clinique>/equipe/`, `/<clinique>/contact/`, `/<clinique>/urgences/` si la clinique reçoit les urgences, `/<clinique>/tarifs/`, une page `/<clinique>/services/<service>/`, un `tel:`. Script.

1. Chapeau, trois phrases : la clinique, la ville, les animaux reçus, le temps de consultation. Puis le bouton « Prendre rendez-vous ».
2. Rendez-vous et horaires : téléphone, WhatsApp, e-mail, bloc horaires.
3. Les soins sur place : six à dix services en une phrase chacun, vers sa page dans la clinique, ou vers la page commune s'il n'en a pas ; la liste complète est sur la page Services.
4. L'équipe : noms, fonctions, langues parlées, lien vers la page Équipe.
5. Les locaux et l'accès : repère, parking, transports, accès de plain-pied, lien vers la page Contact.
6. En cas d'urgence : pendant et en dehors des heures d'ouverture, le supplément d'urgence, bloc garde, lien vers la page Urgences.
7. Prévention, tarifs et abonnements : la consultation, le bilan annuel, le plan de prévention, les abonnements, avec les prix d'appel et les liens vers Tarifs et Abonnements.
8. D'où viennent nos clients : les communes, en une ou deux phrases.
9. Conseils santé : deux ou trois conseils, selon les espèces reçues.

Interdits : un slogan, un paragraphe commun à une autre clinique, un avis client, une actualité datée (elle va dans le bandeau de la fiche).

### Les services de la clinique, `services-clinique`

- Objectif : la porte d'entrée vers chaque soin de la clinique ; le gabarit pose une carte par service de la fiche.
- Recherche : « services vétérinaires {Ville} ». Title : « Services vétérinaires à {Ville} | Vetmint ». H1 : « Les services à {Ville} ».
- Volume : 70 à 400 mots. Script.
- Liens obligatoires : `/<clinique>/rendez-vous/`, `/<clinique>/tarifs/`, un `tel:`. Script.

1. Chapeau : où, qui, la consultation de 30 minutes et son prix, un fait local.
2. Rendez-vous et tarifs : le téléphone, les liens vers Tarifs et Abonnements, le bouton « Prendre rendez-vous ».

### Un service dans la clinique, `service-clinique`

- Objectif : présenter le soin dans la clinique, avec le même texte que la page commune. La page n'a pas de fichier : le site la fabrique pour chaque service de la fiche, à partir de `services/<service>.md` (`src/lib/pages.ts`, `src/lib/service-repris.ts`). Une correction de la page commune vaut pour toutes les cliniques.
- Ce que le site adapte : le surtitre « Ce soin à {Ville} », la carte de la clinique à côté, les liens vers la liste des cabinets qui mènent au rendez-vous de la clinique, les liens vers un service de la clinique qui restent dans la clinique, la section qui liste les cabinets du réseau qui disparaît, les autres soins de la clinique en bas. L'adresse canonique est celle de la page commune.
- Les prix et ce qui est propre au cabinet vont sur ses pages Tarifs, Questions fréquentes et Accueil.

Exception : un soin que la clinique est seule à pratiquer a sa page écrite dans le dossier de la clinique, `services/<soin>.md`, dans les deux langues. Elle suit la structure d'une page commune de service, avec le H1 « {Service} à {Ville} ».

### Un service, page commune, `service`

- Objectif : la page de référence du groupe sur un soin : ce que c'est, pour quels animaux, comment ça se passe, où le faire. Elle ne donne aucun prix : les prix sont sur les pages Tarifs de chaque cabinet. Les pages de service des cliniques reprennent son texte : elle ne nomme donc un cabinet que dans la section qui liste les cabinets, et mène au rendez-vous par la liste des cabinets.
- Recherche : « {service} {espèce} ». Title : « {Service} du {espèce} : {déroulement, prix ou âge} | Vetmint ». H1 : « {Service} du {espèce} » ou « {Service} : {précision} ».
- Volume : 1 200 à 2 100 mots. Script.
- Liens obligatoires : `/cabinets/`. Script. La page renvoie aussi vers un ou deux conseils santé liés quand ils existent.

1. Chapeau : ce que c'est, pour qui, en trois phrases, sans prix.
2. Ce que montre ou fait le soin, quand le sujet le demande (une radio, une échographie).
3. Pour quels animaux et dans quelles situations : espèces, âges, situations ; un tableau quand il y a un calendrier.
4. Pourquoi : ce que le soin évite ou soigne, chaque maladie expliquée en quelques mots.
5. Le déroulement : étape par étape, qui fait quoi, combien de temps.
6. La préparation : à jeun ou non, carnet, caisse de transport, jamais à jeun pour un lapin.
7. Les suites : ce qui est normal, ce qui doit faire rappeler, le contrôle.
8. Le prix : sans montant. Ce dont le prix dépend, « sur devis, au cabinet » quand le prix dépend du cas, puis la phrase « Les prix figurent sur la page Tarifs de votre cabinet, depuis la liste des cabinets », avec le lien vers `/cabinets/`.
9. Questions fréquentes : quatre à huit questions en `###`, formulées comme au comptoir.
10. Les cliniques qui le pratiquent : une ligne par clinique, vers sa page Services et son rendez-vous, sans particularité. Le site commun ne compare pas les cabinets : ni équipement, ni espace, ni service en plus dans un cabinet. Il nomme seulement les cabinets où se fait un soin que les autres ne font pas, pour que le propriétaire sache où aller.
11. Prendre rendez-vous : une phrase et le bouton vers `/cabinets/`. Jamais une marque de vaccin ou de médicament, ni un prix absent de la grille.

### Urgences du groupe, `urgences-groupe`

- Objectif : mettre en avant les deux services d'urgence de Vetmint, Vet'Urgences Fribourg et Vet'Urgences Neuchâtel, puis dire qui appeler dans chaque clinique.
- Recherche : « vétérinaire de garde ». Title : « Vétérinaire de garde : numéros et prix | Vetmint ». H1 : « Urgences et vétérinaire de garde dans les cliniques Vetmint ».
- Volume : 800 à 2 000 mots. Script.

1. Chapeau : les deux services d'urgence, leurs horaires, appeler avant de venir, ce qui se passe après minuit.
2. Nos deux services d'urgence : un `###` par service (téléphone, adresse, horaires, accès, site), puis « Ce que font nos services d'urgence ».
3. Qui appeler, clinique par clinique : une ligne par clinique avec son téléphone et son bloc garde.
4. Urgence, appel ou rendez-vous : trois `###`, appelez tout de suite, appelez dans la journée, prenez rendez-vous.
5. Questions fréquentes.

### Conseils santé, `conseil-index` et `conseil-categorie`

- Objectif : présenter les conseils et les classer par espèce. Le gabarit pose les cartes des conseils.
- Title : « Conseils santé pour vos animaux : chien, chat, NAC | Vetmint » ; par espèce, « Conseils santé pour le chien | Vetmint ». H1 : « Conseils santé », « Conseils santé pour le chien ».
- Volume : 200 à 500 mots pour l'index, 150 à 500 par espèce. Script.

Index : à quoi servent ces conseils ; d'où ils viennent ; comment ils sont classés ; quand appeler plutôt que lire. Par espèce : les sujets traités ; la prévention de chaque année ; quand appeler plutôt que lire.

### Un conseil santé, `conseil`

- Objectif : répondre à une question de santé et conduire vers le bon service.
- Recherche : la question telle qu'elle se tape, « chat en surpoids », « lapin de compagnie ». Title : « {Sujet} : {ce que la page apprend} | Vetmint ». H1 : « {Sujet} ».
- Volume : 600 à 1 600 mots. Script.
- Liens obligatoires : une page `/services/<service>/`, un rendez-vous de clinique ou `/cabinets/`, un autre conseil. Script.

Les sections suivent le sujet : pour une maladie, les signes, les causes, ce que fait le vétérinaire, le traitement, la prévention ; pour une espèce, ses repères, son caractère, son espace, son alimentation, la prévention. Deux sections sont présentes sur chaque conseil : « Quand consulter » ou « Les signes qui imposent d'appeler », et une dernière section qui mène au service concerné et au rendez-vous. Pas de marque d'aliment ni de complément ; un lien externe mène à un site de référence tenu par des vétérinaires.

### Pages de texte, `simple`

Volume : 200 à 1 800 mots. Script. Le script ne contrôle pas les liens d'une page `simple` : la relecture s'en charge.

- `/a-propos/` : qui dirige Vetmint ; comment le groupe s'est formé ; ce que partagent les huit cliniques ; Vetmint et les autres vétérinaires ; joindre le groupe.
- `/remettre-un-cabinet/` : pour le vétérinaire qui pense à remettre son cabinet : trois façons de travailler avec Vetmint (vendre, rejoindre sans vendre, s'installer) ; comment se passe une reprise ; de vétérinaire à vétérinaire ; nous écrire. Elle a son lien dans le menu, entre Emploi et Urgences.
- `/emploi/`, type `emploi` (même volume) : les postes ouverts, un `###` par poste et la candidature spontanée, toujours en première section `##` : chaque `###` y devient une carte ; postuler.
- `/mentions-legales/` et `/confidentialite/` : les sections que la loi demande, dans l'ordre des pages en ligne ; les faits viennent de Vetmint SA.
