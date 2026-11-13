---
name: confirmer-les-faits-du-site
description: "À suivre quand la personne veut relire un cabinet pas encore en ligne, ou confirmer les faits du site : lui montrer le cabinet, lui poser les questions qui restent (équipe, accès, prix, langues), corriger le site selon ses réponses, puis passer le cabinet en ligne. Se retire quand chaque cabinet écrit est en ligne et que les questions ont une réponse."
---

# Confirmer les faits du site

Deux cabinets sont écrits sans que Vetmint ait confirmé tous leurs faits : Domdidier et Bussigny. Leur fiche dit `"en_ligne": false` : leurs pages se voient en prévisualisation, pas sur le site en ligne. Les faits viennent de la fiche du cabinet, des textes du Legacy et des sites actuels ; quand deux sources se contredisaient, la valeur la plus sûre a été écrite, et la question est ci-dessous. Cette skill pose ces questions à la personne, corrige le site, puis passe le cabinet en ligne. Fribourg Ouest, Saint-Blaise, Lac-de-Joux, Saint-Légier et La Chaux-de-Fonds n'ont pas encore leurs pages : ils gardent leur fiche, figurent sur la carte, et leurs liens mènent à leur site actuel.

## 1. Choisir

1. Si la personne nomme un cabinet, commence par lui. Sinon, liste ceux qui restent hors ligne (`grep -l '"en_ligne": false' src/donnees/cliniques/*.json`) et demande-lui par lequel commencer, ou si elle préfère les questions de tout le groupe.
2. Dis-lui en deux phrases : tu lui montres le cabinet dans le navigateur, puis tu lui poses ses questions, quatre ou cinq à la fois. Pour chacune, elle confirme, corrige ou répond « je ne sais pas » ; une question sans réponse ne change rien au site. Elle peut s'arrêter à tout moment et reprendre plus tard.

## 2. Montrer le cabinet

Ouvre l'accueil du cabinet dans le navigateur (geste « Prévisualiser » de `CLAUDE.md`), puis sa page Équipe et sa page Tarifs. Ce qu'elle corrige en lisant compte comme une réponse.

## 3. Poser les questions

Pose les questions du cabinet, dans l'ordre de la section « Les questions ». Pour chacune, donne la valeur que le site affiche aujourd'hui, lue dans la fiche, la grille ou la page, pour qu'elle n'ait qu'à dire oui ou à corriger. Une question à laquelle le site répond déjà autrement a été tranchée : passe-la. Note ses réponses au fil de l'eau.

## 4. Corriger le site

Après chaque série de questions, applique les réponses :

1. Un prix se change dans la grille du cabinet (`docs/grille-des-prix.md`) ; un horaire, un numéro de garde, un service, une personne de l'équipe, l'accès ou les communes dans la fiche du cabinet (`docs/fiche-du-cabinet.md`). Les pages suivent.
2. Pour un autre fait, trouve chaque endroit où il apparaît, dans les deux langues : `grep -rn "<valeur>" src/content/pages src/donnees`. Cherche un téléphone sans espaces et avec espaces. Corrige chaque endroit, en français et en allemand.
3. Si la personne ne veut pas d'un prix sur le site, retire son jeton de la page et écris « sur devis » à sa place. Si un fait est faux et qu'elle n'a pas la bonne valeur, retire la phrase.
4. Retire de cette skill chaque question qui a sa réponse.

## 5. Passer le cabinet en ligne

Quand la personne valide les pages du cabinet, suis la skill `mettre-un-cabinet-en-ligne`, étape 6 « Passer en ligne » : la fiche passe à `"en_ligne": true`, `pnpm verifier`, puis la publication quand elle la demande (geste « Publier »).

## 6. Retirer cette skill

Quand chaque cabinet écrit est en ligne et que les questions du groupe ont une réponse, ou que la personne dit qu'elle n'en a plus, retire cette skill : `git rm -r .claude/skills/confirmer-les-faits-du-site`, puis publie.

## Les questions

### Tout le groupe

1. Le numéro IDE de Vetmint SA ? Le site affiche `CHE-000.000.000`. Vetmint SA est-elle inscrite au registre du commerce du canton de Fribourg, avec Fribourg pour for juridique ?
2. Les raisons sociales exactes des huit sociétés des cabinets, en particulier « Vetmint La Chaux-de-Fonds SA » et « Vetmint Lac de Joux SA ». Sont-elles toutes filiales de Vetmint SA ?
3. Protection des données : Vetmint SA est-elle responsable du traitement pour le site, et chaque cabinet pour les rendez-vous et le dossier de l'animal ? Quel est le rôle de Vetplatform SA ? Les demandes vont-elles à ek@vetmint.ch ?
4. Les candidatures vont-elles à rh@vetplatform.com, avec une réponse sous dix jours ouvrables ?
5. Les prix sont-ils taxes comprises dans les huit cabinets ? Le paiement se fait-il partout par carte et par TWINT ?
6. Un rendez-vous au cabinet non annulé 24 heures avant est-il facturé, comme une visite à domicile ?
7. Les abonnements mensuels sont-ils proposés dans les huit cabinets, aux mêmes prix et conditions ? Les conditions générales de Vetmint Saint-Légier SA valent-elles pour tous ? L'abonnement Junior va jusqu'à 12 mois et l'Adulte commence à 7 mois : quelle est la limite ?

### Payerne

1. Le plan de prévention du chiot ou du chaton coûte-t-il 515 francs, payable en quatre fois par Swissbilling ?
2. Le supplément d'urgence pendant les heures d'ouverture est-il de 99 CHF ?
3. L'équipe : le parcours de Tiago Capelo ? Annie Pasquier est-elle arrivée à l'été 2025 ?
4. L'accès : places de parc gratuites, sortie A1 à cinq minutes, gare à vingt minutes à pied, tout au rez-de-chaussée ?

### Domdidier

1. La grille de Domdidier date du 1er avril 2023 (consultation 59 CHF, détartrage 345 CHF) : est-elle toujours en vigueur ?
2. L'équipe se limite-t-elle à Diana Rodrigues, Pascale Bonny et Manon Bernheim ? Y a-t-il des assistantes en médecine vétérinaire, et leurs noms ? Ewen Kerharo doit-il figurer dans l'équipe ?
3. Pascale Bonny parle-t-elle allemand ? Quelqu'un au cabinet parle-t-il allemand ou italien, comme l'annonçait l'ancien site ?
4. Le Dr Peter Kronen (anesthésiste) et le Dr Julien Michlig (médecin-dentiste) interviennent-ils toujours au cabinet ?
5. L'accès : sortie A1 Avenches, gare à 10 minutes à pied, places de parc à proximité (gratuites ?) ?
6. Les communes, publiées sur chaque page de soin : Dompierre et Russy à 5 minutes, Avenches et Saint-Aubin à 7, Gletterens, Vallon, Léchelles et Montagny à 10, Payerne à une dizaine, Fribourg Ouest à une vingtaine ?
7. La stérilisation de la lapine coûte-t-elle 353 CHF ?
8. Quel est le délai habituel pour un rendez-vous ?

### Bussigny

1. L'équipe se limite-t-elle au Dr Pascal Wicki et au Dr Philippe Boudaroua ? Y a-t-il des assistantes en médecine vétérinaire, et leurs noms ? Existe-t-il une photo du Dr Wicki ? Le site n'a pas de portrait de lui.
2. Les deux vétérinaires consultent-ils en français seulement ?
3. Le Dr Wicki est-il installé à Bussigny depuis 2000, avec les médecines complémentaires ? Le Dr Boudaroua est-il arrivé avec la reprise par Vetmint, en 2026 ?
4. L'accès : à côté de la Migros, nombreuses places de parc dans la zone d'activités, ou six places gratuites devant l'entrée ? Gare CFF et arrêt « Bussigny, gare » à trois minutes à pied ? Cabinet au rez-de-chaussée ?
5. Les communes, publiées sur chaque page de soin : Crissier, Renens, Ecublens, Villars-Sainte-Croix, Echandens, Mex, Vufflens-la-Ville, Penthaz et Sullens ?
6. La grille de Bussigny date du 29 avril 2025 (consultation 58 CHF, détartrage 320 CHF, échographie de gestation 50 CHF) : est-elle juste ?
