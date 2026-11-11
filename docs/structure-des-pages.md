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

- Objectif : dire comment un soin se fait dans cette clinique : la salle et l'équipement, qui le fait, ce qui se fait sur place et ce qui part ailleurs, le prix, la préparation et le retour à la maison. L'explication médicale reste sur la page commune du service, que la page renvoie sans la recopier.
- Recherche : « {service} {espèce} {Ville} ». Title : « {Service} chien et chat à {Ville} | Vetmint » ; un prix ou une durée peut prendre la place de « | Vetmint ». H1 : « {Service} à {Ville} ».
- Volume : 600 à 1 100 mots. Script.
- Liens obligatoires : `/services/<service>/`, `/<clinique>/rendez-vous/`, `/<clinique>/tarifs/`. Script.

1. Chapeau, trois à cinq phrases : les animaux reçus pour ce soin, l'équipement, ce que le propriétaire voit ou apprend pendant la visite. Puis le bouton « Prendre rendez-vous ».
2. Le soin dans la clinique : la salle, sa place dans les locaux, qui fait quoi, le déroulement de la visite.
3. Ce qui se fait sur place : les situations courantes ; ce qui part ailleurs, et vers qui.
4. Le prix dans la clinique : la grille, ce que chaque prix comprend, le lien vers Tarifs ; le plan de prévention ou l'abonnement quand il couvre le soin.
5. Préparer la visite : à jeun ou non, ce qu'il faut apporter, l'appel à passer avant de venir en urgence.
6. Le retour à la maison : l'heure de reprise, les soins du soir, les contrôles.
7. Les questions qu'on nous pose au comptoir : deux à quatre questions en `###`.
8. Une phrase qui dit ce que la page commune explique en plus, puis le bouton vers `/services/<service>/`.

Interdits : une explication médicale longue, un paragraphe repris du même service dans une autre clinique, un service absent de la fiche.

### Équipe, `equipe`

- Objectif : montrer qui soigne, avec quelle formation et quelles préférences, pour que le propriétaire choisisse à qui confier son animal.
- Recherche : « vétérinaire {Ville} », le nom de chaque vétérinaire. Title : « L'équipe vétérinaire de Vetmint {Ville} ». H1 : « L'équipe de Vetmint {Ville} ».
- Volume : 500 à 1 500 mots. Script.
- Liens obligatoires : `/<clinique>/rendez-vous/`, `/emploi/`. Script.

1. Chapeau, à la troisième personne : le nombre de personnes par fonction, les langues parlées, les animaux suivis.
2. Les vétérinaires : un `###` par personne, nom et fonction ; diplôme et année, parcours en deux phrases, ce qu'elle fait à la clinique, les animaux qu'elle suit de préférence, les langues, une ou deux phrases personnelles. 120 à 200 mots par personne.
3. Les assistantes en médecine vétérinaire : un `###` par personne, 50 à 100 mots.
4. Les apprenties et apprentis : même forme, plus courte.
5. Les intervenants externes, s'il y en a : qui vient, pour quoi, à quel rythme.
6. Comment l'équipe reçoit votre animal : à l'accueil, en consultation, le jour d'une opération.
7. Travailler à la clinique : une phrase et le lien vers la page Emploi.

### Contact, `contact`

- Objectif : venir sans se perdre, se garer, savoir si la clinique couvre sa commune.
- Recherche : « contact vétérinaire {Ville} ». Title : « Contact, accès et parking : vétérinaire Vetmint {Ville} ». H1 : « Nous trouver à {Ville} ».
- Volume : 400 à 900 mots. Script.
- Liens obligatoires : `/<clinique>/rendez-vous/`, `/<clinique>/urgences/`, un `tel:`, un `mailto:`. Script.

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
- Recherche : « rendez-vous vétérinaire {Ville} ». Title : « Prendre rendez-vous : clinique vétérinaire Vetmint {Ville} ». H1 : « Prendre rendez-vous à {Ville} ».
- Volume : 250 à 600 mots. Script.
- Liens obligatoires : un `tel:`, `/<clinique>/urgences/`, `/<clinique>/contact/`. Script.

1. Chapeau : les façons de prendre rendez-vous, en ligne, par téléphone, par WhatsApp, au comptoir.
2. Quel rendez-vous choisir : consultation, vaccin, opération, avec la durée de chacun.
3. Ce qu'il faut apporter : carnet, animal à jeun ou non, échantillon, caisse de transport, questions.
4. Délai et annulation : le délai habituel, la règle d'annulation.
5. Pour une urgence : le lien vers la page Urgences.

### Urgences, `urgences`

- Objectif : qu'un propriétaire paniqué sache en cinq secondes qui appeler selon l'heure, puis ce qu'il doit faire en attendant. Seule une clinique dont la fiche dit `"urgences": true` a cette page.
- Recherche : « urgence vétérinaire {Ville} ». Title : « Urgence vétérinaire à {Ville} : qui appeler, à quelle heure ». H1 : « Urgence vétérinaire à {Ville} ».
- Volume : 700 à 1 200 mots. Script.
- Liens obligatoires : le `tel:+41…` de la clinique, un second `tel:` distinct, `/<clinique>/contact/`, `/<clinique>/tarifs/`. Script.

1. Chapeau, puis « Que faire maintenant » : pendant les heures d'ouverture le téléphone de la clinique, en dehors le bloc garde.
2. Pendant les heures d'ouverture : urgences reçues sur appel, délai, supplément et son prix.
3. En dehors des heures d'ouverture : qui répond au numéro de garde, où amener l'animal, tarif de l'appel et supplément.
4. Les signes qui imposent d'appeler : une liste par espèce, chaque signe en une ligne.
5. En attendant : ce qu'il faut faire et ne pas faire.
6. Les cliniques Vetmint voisines : nom, temps de trajet, téléphone.
7. Le paiement d'une urgence.
8. Pour ce qui n'est pas urgent : le lien vers la page Rendez-vous.

Interdits : un vétérinaire de garde « toujours disponible » sans numéro ni horaire, un délai non confirmé, un numéro de garde repris d'une autre clinique.

### Questions fréquentes, `questions-frequentes`

- Objectif : répondre aux questions posées au téléphone et au comptoir.
- Recherche : « questions clinique vétérinaire {Ville} ». Title : « Questions fréquentes : clinique vétérinaire Vetmint {Ville} ». H1 : « Vos questions sur la clinique de {Ville} ».
- Volume : 600 à 1 000 mots. Script.
- Liens obligatoires : `/<clinique>/rendez-vous/`. Script. Chaque thème renvoie en plus vers la page de la clinique qui le développe.

Huit à douze questions en `###`, sous trois ou quatre `##` : Rendez-vous et horaires ; Prix et paiement ; Soins et hospitalisation ; Accès. Chaque réponse fait 40 à 80 mots, donne le fait et le lien vers la page qui développe. Aucune question n'est inventée pour atteindre le volume : si la clinique en a cinq, la page en a cinq et reste courte.

### Tarifs de la clinique, `tarifs`

- Objectif : publier la grille de la clinique ligne par ligne, avec ce que chaque prix comprend.
- Recherche : « tarif vétérinaire {Ville} ». Title : « Tarif vétérinaire à {Ville} : vaccins, opérations, urgences ». H1 : « Les tarifs de la clinique Vetmint {Ville} ».
- Volume : 500 à 1 300 mots, tableaux compris. Script.
- Liens obligatoires : `/<clinique>/abonnements/`, une page `/<clinique>/services/<service>/`, `/<clinique>/rendez-vous/`. Script.

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
11. Comparer avec les autres cliniques : chacune publie ses prix sur sa page Tarifs, avec le lien vers `/cabinets/`.

Chaque tarif est un tableau à trois colonnes : prestation, ce que vous payez, prix. Chaque soin renvoie à sa page dans la clinique.

### Plan de prévention et abonnements de la clinique, `abonnements`

- Objectif : dire ce que coûtent dans cette clinique le plan de prévention et les abonnements, ce qu'ils couvrent, comment souscrire et comment arrêter.
- Recherche : « abonnement vétérinaire {Ville} ». Title : « Abonnement vétérinaire et plan de prévention à {Ville} ». H1 : « Plan de prévention et abonnements à {Ville} ».
- Volume : 600 à 1 300 mots. Script.
- Liens obligatoires : `/<clinique>/tarifs/`, `/<clinique>/rendez-vous/`. Script.

1. Chapeau, puis « Laquelle choisir » : selon l'âge de l'animal et la façon de payer.
2. Le plan de prévention : ce qu'il couvre pendant douze mois, avec le lien vers chaque page de service de la clinique ; ce qu'il coûte, comparé aux mêmes soins achetés un par un ; régler en quatre fois.
3. Les abonnements mensuels : niveaux, âges, prix pour le chien et pour le chat ; les soins de chaque niveau.
4. Ce qui reste à votre charge.
5. Souscrire, payer, arrêter : le téléphone et l'e-mail de la clinique.
6. Vos questions : deux ou trois questions en `###`, dont la comparaison avec les autres cliniques et le lien vers `/abonnements/`.

## Les pages communes

### Accueil du groupe, `accueil-groupe`

- Objectif : dire ce qu'est Vetmint, orienter vers la bonne clinique, donner accès aux services et aux conseils. Aucun montant : les prix ne sont que sur les pages Tarifs et Abonnements de chaque clinique.
- Recherche : « cliniques vétérinaires Suisse romande ». Title : « Vetmint : huit cliniques vétérinaires en Suisse romande ». H1 : « Vetmint, cliniques vétérinaires en Suisse romande ».
- Volume : 700 à 1 000 mots. Script.
- Liens obligatoires : `/cabinets/`, `/conseils/` ou un conseil, `/emploi/`. Script.

1. Chapeau : huit cliniques, trois cantons, un groupe dirigé par des vétérinaires.
2. Trouver votre clinique : les huit, avec la ville, le téléphone et le lien vers son accueil.
3. Ce que nos huit cliniques font de la même façon : un `###` par trait, consultation de 30 minutes, prévention, prix connus, garde, animal moins stressé.
4. Nos services : un `###` par famille, chaque service en lien vers sa page.
5. Conseils santé : par espèce.
6. Travailler chez Vetmint.
7. Vous êtes vétérinaire et pensez à remettre votre cabinet.

### Les cliniques, `cliniques`

- Objectif : choisir la clinique la plus proche et la joindre. Le gabarit pose la carte et les cartes des huit cliniques ; le texte devient une carte par clinique.
- Recherche : « cliniques Vetmint ». Title : « Les cliniques vétérinaires Vetmint : adresses et horaires ». H1 : « Nos cliniques ».
- Volume : 400 à 1 300 mots. Script.

Un `##` par clinique, « Vetmint Payerne » : adresse, téléphone, e-mail, bloc horaires, bloc garde, le bouton vers son accueil. Un bloc de données sous un `##` appartient à la clinique que ce titre nomme.

### Tous les services, `service-index`

- Objectif : la porte d'entrée vers chaque service du groupe.
- Recherche : « services vétérinaires ». Title : « Services vétérinaires des cliniques Vetmint ». H1 : « Nos services vétérinaires ».
- Volume : 250 à 600 mots. Script.

1. Chapeau : ce que les cabinets font, la consultation de 30 minutes.
2. Un `##` par famille, Prévention, Chirurgie, Imagerie, Soins analyses et médecine spécialisée, À domicile et en urgence : une liste de liens, un service par ligne avec une phrase, dans l'ordre du menu.
3. Prix et rendez-vous : sans montant, la page Tarifs de chaque clinique, avec le lien vers `/cabinets/`.

### Un service, page commune, `service`

- Objectif : la page de référence du groupe sur un soin : ce que c'est, pour quels animaux, comment ça se passe, où le faire. Elle ne donne aucun prix : les prix sont sur les pages Tarifs de chaque cabinet. Les pages de service des cliniques y renvoient et ne la recopient pas.
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

- Objectif : qui appeler dans chaque clinique, comment fonctionne la garde, ce que coûte une urgence.
- Recherche : « vétérinaire de garde ». Title : « Vétérinaire de garde : numéros et prix | Vetmint ». H1 : « Urgences et vétérinaire de garde dans les cliniques Vetmint ».
- Volume : 800 à 2 000 mots. Script.

1. Chapeau, puis « Qui appeler, clinique par clinique » : une ligne par clinique avec son téléphone et son bloc garde.
2. Comment fonctionne la garde.
3. Ce que coûte une urgence : les trois parts, sans montant, puis la page Tarifs de chaque clinique par `/cabinets/`. Le coût de l'appel au numéro de garde reste.
4. Urgence, appel ou rendez-vous : trois `###`, appelez tout de suite, appelez dans la journée, prenez rendez-vous.
5. Ce que le vétérinaire de garde vous demandera.
6. Loin de votre clinique habituelle.
7. Questions fréquentes.
8. Les soins d'urgence dans les cliniques, puis « Pour ce qui peut attendre » avec le lien vers `/cabinets/`.

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
- `/emploi/` : les postes ouverts, un `###` par poste et la candidature spontanée ; ce que vous trouvez chez Vetmint ; les huit cliniques ; postuler.
- `/mentions-legales/` et `/confidentialite/` : les sections que la loi demande, dans l'ordre des pages en ligne ; les faits viennent de Vetmint SA.
