# Fiche d'un cabinet

Chaque cabinet a sa fiche, `src/donnees/cliniques/<cabinet>.json`. Elle porte les faits que les gabarits affichent sur toutes ses pages : en-tête, pied de page, accueil, contact, équipe, carte des cabinets, module de rendez-vous, balisage pour les moteurs de recherche. Astro la vérifie à chaque construction (`src/content.config.ts`).

Les horaires, le statut d'ouverture, les fermetures, le bandeau et le numéro de garde s'affichent par un seul fichier, `src/lib/donnees-de-la-clinique.ts` ; `src/lib/balisage.ts` lit aussi les horaires de la fiche pour les moteurs de recherche.

Les prix ne sont pas dans la fiche : ils vivent dans la grille des prix, `src/donnees/tarifs/<cabinet>.json` ([grille-des-prix.md](grille-des-prix.md)). Seul le coût à la minute d'un numéro de garde en 0900 s'écrit dans la fiche, dans le champ `garde`.

## Les champs

| Champ | Contenu |
|---|---|
| `id` | l'identifiant, qui donne l'adresse : `payerne` pour `/payerne/` |
| `nom`, `lieu`, `canton`, `raison_sociale` | « Vetmint Payerne », « Payerne », « VD », « Vetmint Payerne SA » |
| `lieu_en_phrase` | facultatif : le lieu dans une phrase, quand « à {lieu} », « de {lieu} » et « in {lieu} » ne se disent pas. `{ "fr": { "a": "au Lac-de-Joux", "de": "du Lac-de-Joux" }, "de": { "a": "am Lac-de-Joux" } }`. Les phrases fabriquées par le site s'en servent : le H1 et le title des pages de soin, « Le prix au Lac-de-Joux », « Infos pratiques au Lac-de-Joux », « Accueil du cabinet du Lac-de-Joux » ; les textes écrits suivent la même tournure |
| `adresse`, `coordonnees` | la rue, le NPA, la localité, affichés en entier sous le titre de l'accueil ; la latitude et la longitude à quatre décimales |
| `telephone`, `whatsapp` | `{ "affiche": "026 660 16 16", "international": "+41266601616" }` ; `whatsapp` seulement si le cabinet en a un |
| `email` | l'adresse du cabinet |
| `especes` | `chien`, `chat`, `nac` |
| `services` | les services pratiqués sur place, par le nom de leur page commune : chacun a sa page `/<cabinet>/services/<service>/` et son lien dans le menu Services du cabinet ; le site fabrique la page ([structure-des-pages.md](structure-des-pages.md), « Un service dans le cabinet ») |
| `urgences` | `true` si le cabinet reçoit les urgences : il a alors sa page Urgences |
| `equipe` | une entrée par personne : `nom`, `titre`, `fonction` (dans les deux langues), `langues` (`fr`, `de`, `en`…), `domaines`. La page de chaque service nomme les personnes dont la fonction commence par « Vétérinaire » |
| `acces` | `repere`, `parking`, `transports`, `accessibilite`, dans les deux langues. `repere` s'affiche sur le contact ; `parking` et `transports` sur l'accueil et dans les infos pratiques de la page de chaque soin du cabinet ; `accessibilite` dans ces mêmes infos pratiques, et il sert à écrire l'accès de plain-pied de la page Contact |
| `communes` | les communes d'où viennent les clients. Les infos pratiques de la page de chaque soin du cabinet les citent ; elles servent aussi à écrire « D'où viennent nos clients » sur l'accueil et le contact. Chaque commune de la liste est publiée : aucune ne se devine |
| `horaires` | les plages de chaque jour, `"lundi": ["08:00-12:00", "14:00-18:00"]`, heures de 00 à 24, début avant fin, dans l'ordre qu'on veut ; un jour vide est fermé |
| `alternance` | un jour ouvert environ une semaine sur deux, à tour de rôle avec un autre cabinet : `{ "jour": "samedi", "plages": ["08:30-15:00"], "avec": "Domdidier" }`. La ligne des horaires dit d'appeler avant de venir ; ce jour-là, le statut aussi |
| `fermetures` | `{ "du": "2026-12-24", "au": "2026-12-26", "motif": { "fr": "…", "de": "…" } }`, `du` avant ou égal à `au` ; une fermeture passée ne s'affiche plus |
| `bandeau` | `{ "texte": { "fr": "…", "de": "…" }, "niveau": "info", "jusqu_au": "2026-12-24" }`, ou `null` ; `urgent` le pose en rouge |
| `garde` | le numéro de garde et son tarif, dans les deux langues ; `autre`, s'il y a lieu, un second service de garde de la région : `{ "nom": "Vet'Urgence Neuchâtel", "telephone": {…}, "tarif": { "fr": "…", "de": "…" } }`, affiché sous le premier |
| `avis_google` | facultatif : la note de la fiche Google du cabinet, relevée à la main. `{ "note": 4.9, "nombre": 49, "lien": "https://maps.google.com/?cid=…", "releve_le": "2026-11-20" }`. L'accueil du cabinet l'affiche sous les horaires, avec le lien « Lire nos avis sur Google » ; sans ce champ, rien ne s'affiche |
| `rendez_vous` | `{ "outil": "calendly", "adresse": "https://calendly.com/…" }` ; `vetlink` pour Saint-Légier |

Un texte affiché s'écrit dans les deux langues : `{ "fr": "…", "de": "…" }`.

## Les gestes courants

- **Changer un horaire** : modifier les plages du jour dans `horaires`. L'accueil, le contact, le pied de page, la carte des cabinets et le statut « Ouvert maintenant » suivent.
- **Annoncer une fermeture** : ajouter une entrée dans `fermetures`. Elle s'affiche sous les horaires jusqu'à son dernier jour.
- **Poser une annonce** : remplir `bandeau` avec sa date de fin. Elle s'affiche en haut de chaque page du cabinet jusqu'à cette date. La remettre à `null` pour la retirer.
- **Ajouter une personne** : ajouter une entrée dans `equipe`, puis sa photo au catalogue, sujet `<cabinet>:equipe:<nom>` ([charte-graphique.md](charte-graphique.md), « Le catalogue des photos »). Son portrait s'écrit sur la page Équipe, dans les deux langues.
- **Retirer une personne** : retirer son entrée de `equipe`, sa photo du catalogue et du dossier des images, puis son portrait de la page Équipe, dans les deux langues.
- **Ajouter un service** : l'ajouter à `services`, par le nom de sa page commune. Sa page dans le cabinet et son lien dans le menu apparaissent seuls. Ses prix sont ceux de la grille qui portent ce `service` ([grille-des-prix.md](grille-des-prix.md)).
- **Mettre à jour la note Google** : relever la note et le nombre d'avis sur la fiche Google Maps du cabinet, les écrire dans `avis_google` avec la date du jour dans `releve_le`. Le lien est l'adresse `https://maps.google.com/?cid=…` de la fiche.
- **Retirer un service** : le retirer de `services`. Sa page dans le cabinet disparaît ; `pnpm verifier` signale les liens des autres pages qui y menaient.
