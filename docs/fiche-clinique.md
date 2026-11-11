# Fiche d'une clinique

Chaque clinique a sa fiche, `src/donnees/cliniques/<clinique>.json`. Elle porte les faits que les gabarits affichent sur toutes ses pages : en-tête, pied de page, accueil, contact, équipe, carte des cliniques, module de rendez-vous, balisage pour les moteurs de recherche. Astro la vérifie à chaque construction (`src/content.config.ts`).

Les horaires, le statut d'ouverture, les fermetures, le bandeau et le numéro de garde s'affichent par un seul fichier, `src/lib/donnees-de-la-clinique.ts` ; `src/lib/balisage.ts` lit aussi les horaires de la fiche pour les moteurs de recherche.

## Les champs

| Champ | Contenu |
|---|---|
| `id` | l'identifiant, qui donne l'adresse : `payerne` pour `/payerne/` |
| `en_ligne` | `true` quand les pages de la clinique sont écrites dans les deux langues |
| `adresse_hors_ligne` | l'adresse où mènent les liens vers la clinique tant que ses pages ne sont pas en ligne |
| `nom`, `lieu`, `canton`, `raison_sociale` | « Vetmint Payerne », « Payerne », « VD », « Vetmint Payerne SA » |
| `adresse`, `coordonnees` | la rue, le NPA, la localité, affichés en entier sous le titre de l'accueil ; la latitude et la longitude à quatre décimales |
| `telephone`, `whatsapp` | `{ "affiche": "026 660 16 16", "international": "+41266601616" }` ; `whatsapp` seulement si la clinique en a un |
| `email` | l'adresse de la clinique |
| `especes` | `chien`, `chat`, `nac` |
| `services` | les services pratiqués sur place, par le nom de leur page commune : chacun a sa page `/<clinique>/services/<service>/`, reprise de la page commune, et son lien dans le menu Services de la clinique |
| `urgences` | `true` si la clinique reçoit les urgences : elle a alors sa page Urgences |
| `equipe` | une entrée par personne : `nom`, `titre`, `fonction` (dans les deux langues), `langues` (`fr`, `de`, `en`…), `domaines` |
| `acces` | `repere`, `parking`, `transports`, `accessibilite`, dans les deux langues ; les trois premiers s'affichent sur l'accueil et le contact, `accessibilite` sert à écrire l'accès de plain-pied de la page Contact |
| `communes` | les communes d'où viennent les clients ; aucun gabarit ne les affiche, elles servent à écrire « D'où viennent nos clients » sur l'accueil et le contact |
| `horaires` | les plages de chaque jour, `"lundi": ["08:00-12:00", "14:00-18:00"]`, heures de 00 à 24, début avant fin, dans l'ordre qu'on veut ; un jour vide est fermé |
| `alternance` | un jour ouvert environ une semaine sur deux, à tour de rôle avec une autre clinique : `{ "jour": "samedi", "plages": ["08:30-15:00"], "avec": "Domdidier" }`. La ligne des horaires dit d'appeler avant de venir ; ce jour-là, le statut aussi |
| `fermetures` | `{ "du": "2026-12-24", "au": "2026-12-26", "motif": { "fr": "…", "de": "…" } }`, `du` avant ou égal à `au` ; une fermeture passée ne s'affiche plus |
| `bandeau` | `{ "texte": { "fr": "…", "de": "…" }, "niveau": "info", "jusqu_au": "2026-12-24" }`, ou `null` ; `urgent` le pose en rouge |
| `garde` | le numéro de garde et son tarif, dans les deux langues ; `autre`, s'il y a lieu, un second service de garde de la région : `{ "nom": "Vet'Urgence Neuchâtel", "telephone": {…}, "tarif": { "fr": "…", "de": "…" } }`, affiché sous le premier |
| `rendez_vous` | `{ "outil": "calendly", "adresse": "https://calendly.com/…" }` ; `vetlink` pour Saint-Légier |

Un texte affiché s'écrit dans les deux langues : `{ "fr": "…", "de": "…" }`.

## Les gestes courants

- **Changer un horaire** : modifier les plages du jour dans `horaires`. L'accueil, le contact, le pied de page, la carte des cliniques et le statut « Ouvert maintenant » suivent.
- **Annoncer une fermeture** : ajouter une entrée dans `fermetures`. Elle s'affiche sous les horaires jusqu'à son dernier jour.
- **Poser une annonce** : remplir `bandeau` avec sa date de fin. Elle s'affiche en haut de chaque page de la clinique jusqu'à cette date. La remettre à `null` pour la retirer.
- **Ajouter une personne** : ajouter une entrée dans `equipe`, puis sa photo au catalogue, sujet `<clinique>:equipe:<nom>` ([charte-graphique.md](charte-graphique.md), « Le catalogue des photos »). Son portrait s'écrit sur la page Équipe, dans les deux langues.
- **Retirer une personne** : retirer son entrée de `equipe`, sa photo du catalogue et du dossier des images, puis son portrait de la page Équipe, dans les deux langues.
- **Ajouter un service** : l'ajouter à `services`, par le nom de sa page commune. Sa page dans la clinique et son lien dans le menu apparaissent seuls, avec le texte de la page commune.
- **Retirer un service** : le retirer de `services`. Sa page dans la clinique disparaît ; `pnpm verifier` signale les liens des autres pages qui y menaient.
