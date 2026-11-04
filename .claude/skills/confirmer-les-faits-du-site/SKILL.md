---
name: confirmer-les-faits-du-site
description: "À lancer une seule fois, quand la personne le demande : passer en revue avec elle les faits du site qui demandent sa confirmation (prix, numéros de garde, horaires, services, équipe, pages légales), corriger le site selon ses réponses, publier, puis retirer cette skill."
---

# Confirmer les faits du site

Le site a été écrit sans que Vetmint ait tout confirmé. Cette skill pose à la personne les questions qui restent, une seule fois, puis corrige le site.

## 1. Annoncer

Dis à la personne, en deux phrases : tu vas lui poser une vingtaine de questions, par thème, quatre ou cinq à la fois. Pour chacune, elle confirme, corrige, ou répond « je ne sais pas » ; une question sans réponse ne change rien au site. Elle peut s'arrêter à tout moment et reprendre plus tard.

## 2. Poser les questions

Pose les questions thème par thème, dans l'ordre de la section « Les questions ». Pour chacune, donne la valeur que le site affiche aujourd'hui, pour qu'elle n'ait qu'à dire oui ou à corriger. Note ses réponses au fil de l'eau.

## 3. Corriger le site

Après chaque thème, applique les réponses :

1. Trouve chaque endroit où la valeur apparaît, dans les deux langues et dans les fiches : `grep -rn "<valeur>" src/content/pages src/donnees`. Cherche le nombre seul pour un prix (« 515 »), le numéro sans espaces et avec espaces pour un téléphone.
2. Corrige chaque endroit, en français et en allemand (`docs/traduction.md` pour la forme des prix et des heures en allemand).
3. Si la personne ne veut pas d'un prix sur le site, écris « sur devis » à sa place. Si un fait est faux et qu'elle n'a pas la bonne valeur, retire la phrase.
4. Un horaire, un numéro de garde ou un service se change dans la fiche de la clinique (`docs/fiche-clinique.md`) ; les pages suivent.

## 4. Vérifier et publier

1. `pnpm verifier`, puis montre à la personne deux ou trois pages corrigées, en français et en allemand (geste « Prévisualiser » de `CLAUDE.md`).
2. Quand elle le demande, publie (geste « Publier »).

## 5. Retirer cette skill

Quand toutes les questions ont une réponse ou que la personne dit qu'elle n'en a plus, retire cette skill : `git rm -r .claude/skills/confirmer-les-faits-du-site`, puis publie. C'est le seul fichier de `.claude/` que tu retires.

## Les questions

### Vetmint SA et les pages légales

1. Le numéro IDE de Vetmint SA ? Le site affiche `CHE-000.000.000`. Vetmint SA est-elle inscrite au registre du commerce du canton de Fribourg, avec Fribourg pour for juridique ?
2. Les raisons sociales exactes des huit sociétés des cliniques, en particulier « Vetmint La Chaux-de-Fonds SA » et « Vetmint Lac de Joux SA ». Sont-elles toutes filiales de Vetmint SA ?
3. Protection des données : Vetmint SA est-elle responsable du traitement pour le site, et chaque clinique pour les rendez-vous et le dossier de l'animal ? Quel est le rôle de Vetplatform SA ? Les demandes vont-elles à ek@vetmint.ch ou à une autre adresse ?
4. Page « À propos » : Vetmint SA créée en 2021, Ewen Kerharo vétérinaire et directeur du groupe, cliniques entrées dans cet ordre : Domdidier et Saint-Légier, puis Payerne et Saint-Blaise, puis La Chaux-de-Fonds, Fribourg Ouest et Lac-de-Joux, puis Bussigny en 2026. Est-ce juste ?

### Emploi et lettre d'information

5. Les postes affichés sont-ils ouverts : vétérinaire 80 à 100 % à Payerne dès le 1er février 2027 ; assistante ou assistant en médecine vétérinaire 60 à 80 % à Saint-Légier ; places d'apprentissage pour août 2027 ?
6. Les conditions affichées : cinq jours de formation continue par an pour un vétérinaire à plein temps, trois pour une assistante ; réponse à une candidature sous dix jours ouvrables ; questions au 077 497 28 83 ?
7. La lettre d'information : quatre envois par an (mars, juin, septembre, décembre), inscription par e-mail à newsletter@vetmint.ch ?

### Les prix

8. Les huit cliniques ont-elles la même grille de prix, valable dès le 29 avril 2025 ? Les prix sont-ils toutes taxes comprises ?
9. Le plan de prévention chiot ou chaton : 515 francs, ou 490 ? Avec stérilisation ou castration : 925 et 1 240 francs pour le chiot, 615 et 755 pour le chaton, ou 880, 1 180, 585 et 718 ? Paiement possible en quatre fois par Swissbilling ?
10. Les abonnements mensuels sont-ils proposés dans les huit cliniques, ou seulement à Bussigny et Saint-Légier ? Les conditions générales de Vetmint Saint-Légier SA valent-elles pour toutes ?
11. Ces prix sont affichés sur les pages de service, mais ne figurent dans aucune grille. Lesquels sont justes, lesquels passer en « sur devis » ?
    - Radiographie de deux clichés 150 CHF, cliché supplémentaire 45 CHF, sédation 60 à 120 CHF.
    - Dépistage officiel des hanches et des coudes : 390 CHF sur une page, 320 sur une autre.
    - Radiographie de comptage des chiots 90 CHF, échographie de gestation 50 CHF.
    - Échographie abdominale 221 CHF, échocardiographie 260 CHF.
    - Bilan sanguin complet 145 CHF, prise de sang avant anesthésie 85 CHF, urine 45 CHF, selles 40 CHF, cytologie 55 CHF, biopsie 180 à 280 CHF.
    - Hospitalisation 95 à 140 CHF la journée, 60 CHF de jour, perfusion 65 CHF par jour.
    - Puce avec inscription 65 CHF, puce miniature ou thermochip 85 CHF, passeport 25 CHF.
    - Séance de laser 62 CHF ; première consultation douleur à Fribourg Ouest 130 CHF pour 60 minutes.
    - Déplacement à domicile 55 CHF dans un rayon de 15 kilomètres.
12. Le paiement : carte de débit, carte de crédit et TWINT dans toutes les cliniques ? Un rendez-vous non annulé 24 heures avant est-il facturé ?

### Les urgences et la garde

13. Les numéros de garde, hors des heures d'ouverture :
    - Domdidier et Payerne : 0900 904 904, ou 026 466 34 35 ?
    - Fribourg Ouest : 0900 80 70 60, à 2 francs la minute, le même qu'à Saint-Blaise ?
    - Saint-Légier : 0900 906 906, à 2 francs la minute de 8 h à 22 h et 5 francs de 22 h à 8 h ?
    - Lac-de-Joux : Médi-Vet au 0900 022 022, à 2 francs la minute ?
14. La nuit, les animaux hospitalisés sont-ils seuls, avec un contrôle le soir et le matin et un transfert vers une clinique de garde si besoin, partout sauf à Fribourg Ouest ?

### Les horaires

15. Payerne : lundi et mercredi à vendredi 8 h à 12 h et 14 h à 18 h, mardi jusqu'à 19 h, samedi fermé ? Ou 8 h à 18 h sans pause, et certains samedis 8 h 30 à 15 h ?
16. Domdidier : lundi, mardi, mercredi et vendredi 8 h à 12 h et 14 h à 18 h, jeudi jusqu'à 20 h, samedi 8 h 30 à 12 h 30 ? Fribourg Ouest : lundi à vendredi 8 h à 12 h et 14 h à 18 h ?
17. La Chaux-de-Fonds, Fribourg Ouest, Lac-de-Joux, Payerne, Saint-Blaise et Saint-Légier sont-elles fermées le samedi et le dimanche ?

### Les services de chaque clinique

18. Le toilettage : à Payerne et à Domdidier, et le défeutrage sous anesthésie à La Chaux-de-Fonds ? Aussi à Bussigny, au Lac-de-Joux, à Saint-Blaise ?
19. L'échographie : Domdidier et Payerne envoient-elles leurs échographies à Fribourg Ouest ? Saint-Blaise a-t-elle un échographe ?
20. Les animaux : oiseaux, reptiles, poissons et amphibiens orientés vers Fribourg Ouest ; furets, lapins, cochons d'Inde et rats reçus dans les huit cliniques ?
21. Les visites à domicile : par les sept cliniques sauf Fribourg Ouest, euthanasie à domicile comprise ? La pose de puce se fait-elle aussi au Lac-de-Joux ?
22. Les délais de résultat : prise de sang sur place en 20 à 30 minutes, laboratoire externe en deux à cinq jours ouvrables, biopsie en cinq à sept jours ?

### Payerne

23. L'équipe : qui parle allemand (le site dit Claire-Lise Tinguely et Jessy Dizerens), qui parle anglais ? Le parcours de Tiago Capelo ? Annie Pasquier est-elle arrivée à l'été 2025 ?
24. L'accès : places de parc gratuites, sortie A1 à cinq minutes, gare à vingt minutes à pied, tout au rez-de-chaussée ?
25. L'organisation : opérations le matin du lundi au vendredi, animal déposé à 8 h et repris entre 16 h et 18 h (19 h le mardi) ; rendez-vous sous deux à trois jours ouvrables ; vaccins contre la leishmaniose et la piroplasmose sur demande ; supplément d'urgence de 99 CHF pendant les heures d'ouverture ?

### Les sept autres cliniques

26. Pour chaque clinique, demande ce que sa fiche ne sait pas encore : les langues de chaque personne de l'équipe ; le parking, l'arrêt de bus et l'accès de plain-pied ; les communes d'où viennent les clients ; les motifs du module de rendez-vous. En plus :
    - Bussigny : une photo du Dr Wicki ; six places de parc gratuites devant l'entrée ?
    - La Chaux-de-Fonds : le titre suisse de Lorena Geronazzo ; les furets reçus ?
    - Fribourg Ouest : Léo Munné porte-t-il le titre de docteur ?
    - Saint-Blaise, Saint-Légier, Lac-de-Joux : la position de la clinique sur la carte est-elle juste ?
