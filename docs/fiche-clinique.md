# Fiche d'une clinique

Chaque clinique a sa fiche, `src/donnees/cliniques/<clinique>.json`. Elle porte les faits que les gabarits affichent sur toutes ses pages : en-tête, pied de page, accueil, contact, équipe, carte des cliniques, module de rendez-vous, balisage pour les moteurs de recherche. Astro la vérifie à chaque construction (`src/content.config.ts`).

Les horaires, les fermetures et le bandeau d'annonce sont pour l'instant dans la fiche. Ils passeront ensuite par l'API des données en direct (`api.vetmint.ch`) : seule la lecture des données changera (`src/lib/donnees-de-la-clinique.ts`), pas les pages.

## Les champs

| Champ | Contenu |
|---|---|
| `id` | l'identifiant, qui donne l'adresse : `payerne` pour `/payerne/` |
| `en_ligne` | `true` quand les pages de la clinique sont écrites dans les deux langues |
| `site_actuel` | l'adresse de son site actuel, où mènent ses liens tant qu'elle n'est pas en ligne |
| `nom`, `lieu`, `canton`, `raison_sociale` | « Vetmint Payerne », « Payerne », « VD », « Vetmint Payerne SA » |
| `adresse`, `coordonnees` | la rue, le NPA, la localité ; la latitude et la longitude à quatre décimales |
| `telephone`, `whatsapp` | `{ "affiche": "026 660 16 16", "international": "+41266601616" }` ; `whatsapp` seulement si la clinique en a un |
| `email` | l'adresse de la clinique |
| `accroche` | une phrase sous le titre de l'accueil, dans les deux langues |
| `especes` | `chien`, `chat`, `nac` |
| `services` | les services pratiqués sur place, par le nom de leur page commune : chacun a sa page `/<clinique>/services/<service>/` |
| `urgences` | `true` si la clinique reçoit les urgences : elle a alors sa page Urgences |
| `equipe` | une entrée par personne : `nom`, `titre`, `fonction` (dans les deux langues), `langues` (`fr`, `de`, `en`…), `domaines` |
| `acces` | `repere`, `parking`, `transports`, `accessibilite`, dans les deux langues |
| `communes` | les communes d'où viennent les clients |
| `horaires` | les plages de chaque jour, `"lundi": ["08:00-12:00", "14:00-18:00"]` ; un jour vide est fermé |
| `fermetures` | `{ "du": "2026-12-24", "au": "2026-12-26", "motif": { "fr": "…", "de": "…" } }` ; une fermeture passée ne s'affiche plus |
| `bandeau` | `{ "texte": { "fr": "…", "de": "…" }, "niveau": "info", "jusqu_au": "2026-12-24" }`, ou `null` ; `urgent` le pose en rouge |
| `garde` | le numéro de garde et son tarif, dans les deux langues |
| `rendez_vous` | `{ "outil": "calendly", "adresse": "https://calendly.com/…" }` ; `vetlink` pour Saint-Légier |
| `sources`, `a_remplacer` | d'où viennent les faits, ce qui reste à confirmer ; notes de travail |

Un texte affiché s'écrit dans les deux langues : `{ "fr": "…", "de": "…" }`.

## Les gestes courants

- **Changer un horaire** : modifier les plages du jour dans `horaires`. L'accueil, le contact, le pied de page, la carte des cliniques et le statut « Ouvert maintenant » suivent.
- **Annoncer une fermeture** : ajouter une entrée dans `fermetures`. Elle s'affiche sous les horaires jusqu'à son dernier jour.
- **Poser une annonce** : remplir `bandeau` avec sa date de fin. Elle s'affiche en haut de chaque page de la clinique jusqu'à cette date. La remettre à `null` pour la retirer.
- **Ajouter une personne** : ajouter une entrée dans `equipe`. Son portrait vient du catalogue des photos, sujet `<clinique>:equipe:<nom>`.
