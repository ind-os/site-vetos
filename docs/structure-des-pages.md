# Structure des pages

Ce que contient chaque type de page, dans quel ordre et à quelle longueur. Ces plans sont la convention du site : une page nouvelle les suit, une page modifiée les garde. Quand la personne demande quelque chose qui s'en écarte, une section en moins, un ordre différent, un texte bien plus long ou plus court, Claude le lui dit avant de modifier : ce que le plan prévoit, ce que sa demande change pour l'homogénéité du site. Puis il fait ce qu'elle décide.

## Lire un plan

- Chaque plan donne l'objectif de la page, la recherche qu'elle vise, le modèle de son title et de son H1, ses sections dans l'ordre, son volume et ses liens obligatoires. « Script » : `outils/verifier-les-pages.mjs` contrôle la règle ([verifications.md](verifications.md)).
- Le volume est une fourchette de mots du corps, élargie pour une page allemande. Les liens obligatoires sont des adresses relatives ; `/<cabinet>/…` désigne le cabinet de la page, par l'identifiant de sa fiche (`/payerne/…`). Le title fait 60 caractères au plus, la description 150 à 160 ([format-des-pages.md](format-des-pages.md)).
- Le chapeau est le premier paragraphe, sans titre. Les sections sont des `##`, leurs sous-sections des `###`. Le H1 n'est pas dans le corps. Les horaires, les fermetures et la garde s'écrivent dans un bloc de données ; un prix, par son jeton `{prix:<cle>}` ([grille-des-prix.md](grille-des-prix.md), « Le jeton »).
- Une page d'un cabinet prend la même page de Payerne pour modèle, avec ses propres faits. Sa traduction allemande garde les mêmes sections ([traduction.md](traduction.md)). Ce que le gabarit ajoute autour du texte est dans [plan-des-pages.md](plan-des-pages.md) : le texte ne le redit pas.
- Une page commune ne donne aucun montant et ne compare pas les cabinets ([charte-redactionnelle.md](charte-redactionnelle.md), 1.6).

## Les pages d'un cabinet

### Accueil du cabinet, `accueil-clinique`

- Objectif : qu'un propriétaire de la région comprenne en dix secondes où est le cabinet, pour quels animaux, comment prendre rendez-vous et quoi faire en urgence.
- Recherche : « vétérinaire {Ville} ». Title : « Vétérinaire à {Ville} : cabinet Vetmint {Ville} ». H1 : « Cabinet vétérinaire Vetmint {Ville} ».
- Volume : 900 à 1 400 mots. Script.
- Liens obligatoires : `/<cabinet>/rendez-vous/`, `/<cabinet>/equipe/`, `/<cabinet>/contact/`, `/<cabinet>/urgences/` si le cabinet reçoit les urgences, `/<cabinet>/tarifs/`, une page `/<cabinet>/services/<service>/`, un `tel:`. Script.

1. Chapeau, trois phrases : le cabinet, la ville, les animaux reçus, l'équipe, le temps de consultation. Puis le bouton « Prendre rendez-vous ».
2. Rendez-vous et horaires : téléphone, WhatsApp, e-mail, bloc horaires.
3. Les soins sur place : six à dix services en une phrase chacun, vers sa page dans le cabinet, ou vers la page commune s'il n'en a pas ; la liste complète est sur la page Services.
4. L'équipe : noms, fonctions, langues parlées, lien vers la page Équipe.
5. Les locaux et l'accès : repère, parking, transports, accès de plain-pied, lien vers la page Contact.
6. En cas d'urgence : pendant et en dehors des heures d'ouverture, le supplément d'urgence, bloc garde, lien vers la page Urgences.
7. Prévention, tarifs et abonnements : la consultation, le bilan annuel, le plan de prévention, les abonnements, avec leurs prix et les liens vers Tarifs et Abonnements.
8. D'où viennent nos clients : les communes, en une ou deux phrases.
9. Conseils santé : deux ou trois conseils, selon les espèces reçues.

Interdits : un slogan, un paragraphe commun à un autre cabinet, un avis client, une actualité datée (elle va dans le bandeau de la fiche).

### Les services du cabinet, `services-clinique`

- Objectif : la porte d'entrée vers chaque soin du cabinet ; le gabarit pose une carte par service de la fiche.
- Recherche : « services vétérinaires {Ville} ». Title : « Services vétérinaires à {Ville} | Vetmint ». H1 : « Les services à {Ville} ».
- Volume : 70 à 400 mots. Script.
- Liens obligatoires : `/<cabinet>/rendez-vous/`, `/<cabinet>/tarifs/`, un `tel:`. Script.

1. Chapeau : où, qui, la consultation de 30 minutes et son prix, un fait local.
2. Rendez-vous et tarifs : le téléphone, les liens vers Tarifs et Abonnements, le bouton « Prendre rendez-vous ».

### Un service dans le cabinet, `service-clinique`

- Objectif : présenter le soin dans ce cabinet, ses vétérinaires, son prix, le rendez-vous, puis l'explication du soin. Le site fabrique la page pour chaque service de la liste `services` de la fiche : aucun fichier à écrire. Elle vit à `/<cabinet>/services/<service>/`, en allemand `/de/<cabinet>/leistungen/<Leistung>/` ([traduction.md](traduction.md)). Son adresse canonique est elle-même : c'est la page que Google présente pour « {service} {Ville} ».
- Recherche : « {service} {Ville} ». H1 : le titre de la page commune, avant ses deux-points, suivi du lieu : « Dentisterie du chien et du chat à Payerne », « Prévention à Payerne », en allemand « Zahnmedizin bei Hund und Katze in Payerne ». Les espèces et la tournure sont celles que la page commune a choisies : le titre de la page d'un cabinet n'en ajoute aucune. Title : le H1 suivi de « | Vetmint » ; au-delà de 60 caractères, le H1 seul, puis le champ `nom` de la page commune avec le lieu. {Ville} et {Ort} sont le champ `lieu` de la fiche.
- Description, fabriquée elle aussi : le H1, « tarifs du cabinet, rendez-vous et explication du soin », le nom et le téléphone du cabinet.

Le contenu, dans l'ordre :

1. Le chapeau : la présentation du soin dans le cabinet, champ `presentation_dans_le_cabinet` de la page commune ([format-des-pages.md](format-des-pages.md)), où `{cabinet}` devient le nom du cabinet, « Vetmint Payerne ». Trois phrases environ, écrites une fois pour tous les cabinets : ce que le cabinet fait pour ce soin, avec les mots que l'on cherche (« soins dentaires », « détartrage », « extractions »), sans fait propre à un seul cabinet.
2. Le bouton « Prendre rendez-vous » du cabinet.
3. « Le prix à {Ville} » : les prix de la grille du cabinet dont le `service` est ce service, dans l'ordre de la grille ([grille-des-prix.md](grille-des-prix.md)), puis le lien « Tous les tarifs du cabinet ». Sans prix pour ce service : « Le prix dépend des examens choisis : le vétérinaire vous l'annonce avant de commencer. », puis le même lien.
4. « Infos pratiques à {Ville} » : des questions en accordéon, avec le balisage FAQPage, dont les réponses viennent de la fiche. Où se trouve le cabinet (adresse, `acces` : parking, transports, accessibilité) ; qui pratique {en_phrase} à {Ville} (les personnes de `equipe` dont la fonction commence par « Vétérinaire ») ; le cabinet est-il proche de chez moi (`communes`) ; comment prendre rendez-vous (téléphone, WhatsApp, module en ligne). Une question sans donnée dans la fiche ne s'affiche pas. Ce bloc est le texte propre au cabinet : il sert le visiteur qui arrive d'un moteur de recherche sans connaître Vetmint, et distingue la page de celle des autres cabinets.
5. « Le soin en bref » : le premier paragraphe de la page commune, dont la fin s'efface sous un voile, puis le bouton « Tout lire sur {en_phrase} ». Il déplie dans la page le reste du texte de la page commune, chargé au clic depuis `/textes-des-soins/<langue>/<service>.html` ([plan-des-pages.md](plan-des-pages.md)) ; sans JavaScript, il ouvre la page commune. Le texte déplié laisse de côté les sections qui listent les cabinets ou mènent à la liste des cabinets : le prix général, les cabinets qui pratiquent le soin, prendre rendez-vous. Ses titres descendent d'un niveau. Google ne lit pas ce texte déplié sur la page du cabinet : la page reste propre au cabinet.
6. « Les autres soins du cabinet ». À côté, la carte du cabinet.

Les titres, les liens et les phrases fixes de la page sont des textes de l'interface, dans `src/i18n/fr.ts` et `src/i18n/de.ts`.

L'explication d'un soin n'existe qu'une fois, dans sa page commune : une correction vaut pour tous les cabinets. Les faits du cabinet viennent de sa fiche et de sa grille, validées une fois. Rien n'est à relire cabinet par cabinet.

Exception : un soin qu'un cabinet est seul à pratiquer, sans page commune, a sa page écrite dans le dossier du cabinet, `services/<soin>.md`, type `service-clinique`, dans les deux langues. Elle suit les sections d'une page commune de service, sans « Les cabinets qui le pratiquent », avec le H1 « {Nom} à {Ville} ».

- Volume : 600 à 1 100 mots. Script.
- Liens obligatoires : une page commune `/services/<service>/`, `/<cabinet>/rendez-vous/`, `/<cabinet>/tarifs/`. Script.

### Équipe, `equipe`

- Objectif : montrer qui soigne, avec quelle formation et quelles préférences, pour que le propriétaire choisisse à qui confier son animal.
- Recherche : « équipe vétérinaire {Ville} ». Title : « L'équipe vétérinaire de Vetmint {Ville} ». H1 : « L'équipe de Vetmint {Ville} ».
- Volume : 500 à 1 500 mots. Script.
- Liens obligatoires : `/<cabinet>/rendez-vous/`, `/emploi/`. Script.

1. Chapeau, à la troisième personne : le nombre de personnes par fonction, les langues parlées, les animaux suivis. Puis le bouton « Prendre rendez-vous ».
2. Les vétérinaires : un `###` par personne, nom et fonction ; diplôme et année, parcours en deux phrases, ce qu'elle fait au cabinet, les animaux qu'elle suit de préférence, les langues, une ou deux phrases personnelles. 120 à 200 mots par personne. Puis un `###`, « Voir le même vétérinaire d'une visite à l'autre » : comment demander le vétérinaire qui suit l'animal.
3. Les assistantes en médecine vétérinaire : ce qu'elles font au cabinet, puis un `###` par personne, 50 à 100 mots.
4. Les apprentis : comment se passe l'apprentissage au cabinet, puis un `###` par personne, plus court.
5. Les intervenants externes, s'il y en a : qui vient, pour quoi, à quel rythme.
6. Comment l'équipe reçoit votre animal : trois `###`, à l'accueil, en consultation, le jour d'une opération ; puis le téléphone et le bouton « Prendre rendez-vous ».
7. Travailler au cabinet : une phrase et le lien vers la page Emploi.

### Contact, `contact`

- Objectif : venir sans se perdre, se garer, savoir si le cabinet couvre sa commune.
- Recherche : « contact vétérinaire {Ville} ». Title : « Contact, accès et parking : vétérinaire Vetmint {Ville} ». H1 : « Nous trouver à {Ville} ».
- Volume : 400 à 900 mots. Script.
- Liens obligatoires : `/<cabinet>/rendez-vous/`, `/<cabinet>/urgences/` si le cabinet reçoit les urgences, un `tel:`, un `mailto:`. Script.

1. Chapeau : l'adresse, le moyen de contact le plus simple, un fait d'accès.
2. Coordonnées : adresse, téléphone, WhatsApp s'il existe, e-mail ; ce qu'il faut écrire dans un message.
3. Horaires et fermetures : blocs horaires et fermetures, puis les ouvertures exceptionnelles.
4. En voiture : sortie d'autoroute, parking, dépose.
5. En transports publics : gare ou arrêt, minutes à pied.
6. Accès en fauteuil roulant et avec un animal difficile à porter : étage, marches, entrée directe en salle.
7. D'où viennent nos clients : les communes, avec le temps de trajet.
8. Itinéraire : une phrase, puis le bouton vers l'itinéraire.
9. Rendez-vous et urgences : les liens vers les deux pages.

### Prendre rendez-vous, `rendez-vous`

- Objectif : que le propriétaire prenne rendez-vous par le canal qui lui convient et arrive préparé. Le gabarit pose le bouton du module et le téléphone.
- Recherche : « rendez-vous vétérinaire {Ville} ». Title : « Prendre rendez-vous : cabinet vétérinaire Vetmint {Ville} ». H1 : « Prendre rendez-vous à {Ville} ».
- Volume : 250 à 600 mots. Script.
- Liens obligatoires : un `tel:`, `/<cabinet>/urgences/` si le cabinet reçoit les urgences, `/<cabinet>/contact/`. Script.

1. Chapeau : les façons de prendre rendez-vous, en ligne, par téléphone, par WhatsApp, au comptoir.
2. Quel rendez-vous choisir : chaque motif avec sa durée, de la consultation au contrôle après une opération ; puis ce qui se fixe par téléphone, une opération, un détartrage, une visite à domicile.
3. Ce qu'il faut apporter : carnet, caisse de transport, médicaments en cours, échantillon, questions ; puis à jeun ou non avant une opération.
4. Délai et annulation : le délai habituel, le cabinet Vetmint voisin quand l'agenda est plein, la règle d'annulation.
5. Pour une urgence : les liens vers les pages Urgences et Contact.

### Urgences, `urgences`

- Objectif : qu'un propriétaire paniqué sache en cinq secondes qui appeler selon l'heure, puis ce qu'il doit faire en attendant. Seul un cabinet dont la fiche dit `"urgences": true` a cette page.
- Recherche : « urgence vétérinaire {Ville} ». Title : « Urgence vétérinaire à {Ville} : qui appeler, à quelle heure ». H1 : « Urgence vétérinaire à {Ville} ».
- Volume : 700 à 1 200 mots. Script.
- Liens obligatoires : le `tel:+41…` du cabinet, un second `tel:` distinct, `/<cabinet>/contact/`, `/<cabinet>/tarifs/`. Script.

1. Chapeau, puis « Que faire maintenant » : pendant les heures d'ouverture le téléphone du cabinet, en dehors le bloc garde.
2. Pendant les heures d'ouverture : urgences reçues sur appel, entre deux consultations ; le bloc horaires ; ce que coûte l'urgence, la consultation et le supplément ; ce qui se fait sur place.
3. En dehors des heures d'ouverture : qui répond au numéro de garde, où amener l'animal, tarif de l'appel et supplément.
4. Les signes qui imposent d'appeler : une liste par espèce, chaque signe en une ligne.
5. En attendant : ce qu'il faut faire et ne pas faire.
6. Les cabinets Vetmint voisins : nom, temps de trajet, téléphone, puis le lien vers `/cabinets/`.
7. Le paiement d'une urgence, avec le lien vers la page Tarifs.
8. Pour ce qui n'est pas urgent : les liens vers les pages Rendez-vous et Contact.

Interdits : un vétérinaire de garde « toujours disponible » sans numéro ni horaire, un délai non confirmé, un numéro de garde repris d'un autre cabinet.

### Questions fréquentes, `questions-frequentes`

- Objectif : répondre aux questions posées au téléphone et au comptoir.
- Recherche : « questions cabinet vétérinaire {Ville} ». Title : « Questions fréquentes : cabinet vétérinaire Vetmint {Ville} ». H1 : « Vos questions sur le cabinet de {Ville} ».
- Volume : 600 à 1 000 mots. Script.
- Liens obligatoires : `/<cabinet>/rendez-vous/`. Script. Chaque thème renvoie en plus vers la page du cabinet qui le développe.

Un chapeau d'une ou deux phrases, puis huit à douze questions en `###`, sous trois ou quatre `##` : Rendez-vous et horaires ; Prix et paiement ; Soins et hospitalisation ; Accès. Chaque réponse fait 40 à 80 mots, donne le fait et le lien vers la page qui développe. Aucune question n'est inventée pour atteindre le volume : si le cabinet en a cinq, la page en a cinq et reste courte.

### Tarifs du cabinet, `tarifs`

- Objectif : publier la grille du cabinet ligne par ligne, avec ce que chaque prix comprend. Chaque montant est le jeton d'un prix de la grille ([grille-des-prix.md](grille-des-prix.md)).
- Recherche : « tarif vétérinaire {Ville} ». Title : « Tarif vétérinaire à {Ville} : vaccins, opérations, urgences ». H1 : « Les tarifs du cabinet Vetmint {Ville} ».
- Volume : 500 à 1 300 mots, tableaux compris. Script.
- Liens obligatoires : `/<cabinet>/abonnements/`, une page `/<cabinet>/services/<service>/`, `/<cabinet>/rendez-vous/`. Script.

1. Chapeau, puis « Comment lire cette grille » : francs, taxes comprises, date de validité, prix annoncé avant tout soin hors grille.
2. La consultation.
3. Bilans de santé et vaccins, par animal.
4. Stérilisations et castrations, avec ce que le forfait comprend.
5. Les dents.
6. Examens et analyses.
7. Les urgences : les suppléments par moment, le bloc garde, le lien vers la page Urgences.
8. Visites à domicile.
9. Payer.
10. Plan de prévention et abonnements, avec le lien vers la page Abonnements.
11. Comparer avec les autres cabinets : chacun publie ses prix sur sa page Tarifs, avec le lien vers `/cabinets/` ; puis le bouton « Prendre rendez-vous ».

Chaque tarif est un tableau : prestation, ce que vous payez, prix. Un forfait d'opération montre ses deux parts, acte et bloc opératoire puis anesthésie et douleur, avant le prix total. Chaque soin renvoie à sa page dans le cabinet.

### Plan de prévention et abonnements du cabinet, `abonnements`

- Objectif : dire ce que coûtent dans ce cabinet le plan de prévention et les abonnements, ce qu'ils couvrent, comment souscrire et comment arrêter.
- Recherche : « abonnement vétérinaire {Ville} ». Title : « Abonnement vétérinaire et plan de prévention à {Ville} ». H1 : « Plan de prévention et abonnements à {Ville} ».
- Volume : 600 à 1 300 mots. Script.
- Liens obligatoires : `/<cabinet>/tarifs/`, `/<cabinet>/rendez-vous/`. Script.

1. Chapeau, puis « Laquelle choisir » : selon l'âge de l'animal et la façon de payer.
2. Le plan de prévention, en trois `###` : ce qu'il couvre pendant douze mois, avec le lien vers chaque page de service du cabinet ; ce qu'il coûte, comparé aux mêmes soins achetés un par un ; régler en quatre fois.
3. Les abonnements mensuels : niveaux, âges, prix pour le chien et pour le chat ; puis un `###`, les soins de chaque niveau.
4. Ce qui reste à votre charge.
5. Souscrire, payer, arrêter : le téléphone et l'e-mail du cabinet.
6. Vos questions : deux ou trois questions en `###`, dont « Les autres cabinets ont-ils les mêmes prix ? » avec le lien vers `/cabinets/` ; puis le bouton « Prendre rendez-vous ».

## Les pages communes

### Accueil du groupe, `accueil-groupe`

- Objectif : dire ce qu'est Vetmint, orienter vers le bon cabinet, donner accès aux services et aux conseils.
- Recherche : « cabinets vétérinaires Suisse romande ». Title : « Vetmint : huit cabinets vétérinaires en Suisse romande ». H1 : « Vetmint, cabinets vétérinaires en Suisse romande ».
- Volume : 700 à 1 000 mots. Script.
- Liens obligatoires : `/cabinets/`, `/conseils/` ou un conseil, `/emploi/`. Script.

1. Chapeau : huit cabinets, trois cantons, un groupe dirigé par des vétérinaires, les animaux reçus.
2. Trouver votre cabinet : les huit par région, chacun en lien vers son accueil, puis le bouton vers `/cabinets/`.
3. Ce que nos huit cabinets font de la même façon : un `###` par trait, la consultation de 30 minutes, la prévention, des prix connus avant le rendez-vous, l'urgence la nuit ou le week-end.
4. Nos services : un `###` par famille, chaque service en lien vers sa page.
5. Conseils santé : par espèce.
6. Travailler chez Vetmint.
7. Vous êtes vétérinaire et pensez à remettre votre cabinet.

### Les cabinets, `cliniques`

- Objectif : choisir le cabinet le plus proche et le joindre. Le gabarit pose la carte et les cartes des huit cabinets ; le texte devient une carte par cabinet.
- Recherche : « cabinets Vetmint ». Title : « Les cabinets vétérinaires Vetmint : adresses et horaires ». H1 : « Nos cabinets ».
- Volume : 400 à 1 300 mots. Script.

Un chapeau : les cabinets par canton, les deux services d'urgence. Puis un `##` par cabinet, « Vetmint Payerne » : adresse et repère, téléphone, e-mail, bloc horaires, bloc garde, le lien vers son accueil. Un bloc de données sous un `##` appartient au cabinet que ce titre nomme.

### Tous les services, `service-index`

- Objectif : la porte d'entrée vers chaque service du groupe.
- Recherche : « services vétérinaires ». Title : « Services vétérinaires des cabinets Vetmint ». H1 : « Nos services vétérinaires ».
- Volume : 250 à 600 mots. Script.

1. Chapeau : ce que les cabinets font, la consultation de 30 minutes.
2. Un `##` par famille, « Prévention », « Chirurgie », « Imagerie », « Soins, analyses et médecine spécialisée », « À domicile et en urgence » : une phrase, puis une liste de liens, un service par ligne avec une phrase, dans l'ordre du menu.
3. Prix et rendez-vous : la page Tarifs de chaque cabinet, avec le lien vers `/cabinets/`.

### Un service, page commune, `service`

- Objectif : la page de référence du groupe sur un soin : ce que c'est, pour quels animaux, comment ça se passe, où le faire. Son texte s'affiche aussi sur la page de ce service dans chaque cabinet (« Un service dans le cabinet ») : elle ne nomme donc un cabinet que dans la section qui liste les cabinets ; elle mène au rendez-vous par la liste des cabinets.
- Recherche : « {service} {espèce} ». Title : « {Service} du {espèce} : {déroulement, prix ou âge} | Vetmint ». H1 : « {Service} du {espèce} » ou « {Service} : {précision} ».
- En-tête : `nom`, `especes` et `en_phrase`, que la page du service dans chaque cabinet reprend ([format-des-pages.md](format-des-pages.md)).
- Volume : 1 200 à 2 100 mots. Script.
- Liens obligatoires : `/cabinets/`. Script. La page renvoie aussi vers un ou deux conseils santé liés quand ils existent.

1. Chapeau : ce que c'est, pour qui, en trois phrases, sans prix. Il se lit seul : la page du service dans chaque cabinet le reprend sous « Le soin en bref ». Puis le bouton vers `/cabinets/`.
2. Ce que montre ou fait le soin, quand le sujet le demande (une radio, une échographie).
3. Pour quels animaux et dans quelles situations : espèces, âges, situations ; un tableau quand il y a un calendrier.
4. Pourquoi : ce que le soin évite ou soigne, chaque maladie expliquée en quelques mots.
5. Le déroulement : étape par étape, qui fait quoi, combien de temps.
6. La préparation : à jeun ou non, carnet, caisse de transport, jamais à jeun pour un lapin.
7. Les suites : ce qui est normal, ce qui doit faire rappeler, le contrôle.
8. Le prix : ce dont le prix dépend, « sur devis, au cabinet » quand le prix dépend du cas, puis la phrase « Les prix figurent sur la page Tarifs de votre cabinet, depuis la liste des cabinets », avec le lien vers `/cabinets/`.
9. Questions fréquentes : quatre à huit questions en `###`, formulées comme au comptoir.
10. Les cabinets qui le pratiquent : une ligne par cabinet, vers sa page Services et son rendez-vous, sans particularité.
11. Prendre rendez-vous : une phrase et le bouton vers `/cabinets/`.

Les sections 8, 10 et 11 restent sur la page commune : la page du service dans un cabinet les laisse de côté.

Interdits : une marque de vaccin ou de médicament.

### Urgences du groupe, `urgences-groupe`

- Objectif : mettre en avant les deux services d'urgence de Vetmint, Vet'Urgences Fribourg et Vet'Urgences Neuchâtel, puis dire qui appeler dans chaque cabinet.
- Recherche : « vétérinaire de garde ». Title : « Vétérinaire de garde : numéros et prix | Vetmint ». H1 : « Urgences et vétérinaire de garde dans les cabinets Vetmint ».
- Volume : 800 à 2 000 mots. Script.

1. Chapeau : les deux services d'urgence, leurs horaires, appeler avant de venir, ce qui se passe après minuit.
2. Nos deux services d'urgence : un `###` par service (téléphone, adresse, horaires, accès, site), puis « Ce que font nos services d'urgence ».
3. Qui appeler, cabinet par cabinet : une ligne par cabinet avec son téléphone et son bloc garde.
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
- Liens obligatoires : une page `/services/<service>/`, un rendez-vous de cabinet ou `/cabinets/`, un autre conseil. Script.

Les sections suivent le sujet : pour une maladie, les signes, les causes, ce que fait le vétérinaire, le traitement, la prévention ; pour une espèce, ses repères, son caractère, son espace, son alimentation, la prévention. Deux sections sont présentes sur chaque conseil : « Quand consulter » ou « Les signes qui imposent d'appeler » ; une dernière section qui mène au service concerné et au rendez-vous. Pas de marque d'aliment ni de complément ; un lien externe mène à un site de référence tenu par des vétérinaires.

### Pages de texte, `simple`

Volume : 200 à 1 800 mots. Script. Le script ne contrôle pas les liens d'une page `simple` : la relecture s'en charge.

- `/a-propos/` : qui dirige Vetmint ; comment le groupe s'est formé ; ce que partagent les huit cabinets ; Vetmint et les autres vétérinaires ; joindre le groupe.
- `/remettre-un-cabinet/` : pour le vétérinaire qui pense à remettre son cabinet : trois façons de travailler avec Vetmint (vendre, rejoindre sans vendre, s'installer) ; comment se passe une reprise ; de vétérinaire à vétérinaire ; nous écrire. Elle a son lien dans le menu, entre Emploi et Urgences.
- `/emploi/`, type `emploi` (même volume) : les postes ouverts, un `###` par poste et la candidature spontanée, toujours en première section `##` : chaque `###` y devient une carte ; postuler.
- `/mentions-legales/` et `/confidentialite/` : les sections que la loi demande, dans l'ordre des pages en ligne ; les faits viennent de Vetmint SA.
