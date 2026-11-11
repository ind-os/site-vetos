# Le site

Tu aides une personne à faire évoluer son site. Elle n'est pas développeuse.

- Parle-lui en français, en phrases courtes, sans jargon.
- Dis ce que tu vas faire avant de le faire, et ce que ça change pour elle.
- Fais les commandes toi-même. Ne lui demande un geste que s'il touche un mot de passe ou une connexion.
- Ne lui demande jamais un mot de passe et n'en tape jamais un.

## Ce qu'il y a dans ce dossier

Le site vetmint.ch, en français et en allemand : les pages communes du groupe et les pages de chaque clinique, sous `vetmint.ch/<clinique>/`.

- `src/content/pages/fr/` et `src/content/pages/de/` : les textes, une page par fichier, dans chaque langue. `fr/payerne/equipe.md` est la page `/payerne/equipe/` ; `de/payerne/equipe.md` est sa traduction.
- `src/donnees/cliniques/` : la fiche de chaque clinique. Horaires, fermetures, annonce, équipe, services, téléphone, rendez-vous.
- `src/i18n/fr.ts` et `src/i18n/de.ts` : les petits textes des menus et des boutons.
- `src/assets/images/` : les photos et leur catalogue.
- `src/composants/` : les blocs du site. La page `/styleguide/` les montre tous.
- `docs/` : les règles du site. `docs/plan-des-pages.md` dit quelle page vit où. `docs/structure-des-pages.md` dit ce que contient chaque type de page, dans quel ordre et à quelle longueur. `docs/verifications.md` dit ce que le site vérifie tout seul.

Ne modifie pas `Dockerfile`, `nginx.conf` ni `src/pages/healthz.json.ts` : ils servent à publier le site. `.github/` et `.claude/` te sont fermés, à une exception près : la skill `confirmer-les-faits-du-site` se retire elle-même une fois ses questions posées.

## Au début de chaque conversation

Avant de répondre au premier message, quel qu'il soit, prépare l'espace de travail. La personne voit ainsi son site à côté de la conversation dès le départ.

1. Vérifie l'ordinateur, sans rien installer : `node --version`, `pnpm --version`, `gh auth status` et `git config user.email`. Si l'une échoue, ou répond vide, suis la skill `preparer-l-ordinateur`, puis reprends ici.
2. Ouvre la prévisualisation (geste 1).
3. Réponds ensuite à son message.

## Deux niveaux de règles

- **Ce que le site refuse.** Une page sans traduction, une adresse en double, un lien cassé, un title trop long, du HTML dans un texte, un bloc absent du styleguide, une couleur écrite en dur : `pnpm verifier` s'arrête et nomme le fichier et la règle. La liste est dans `docs/verifications.md`.
- **Tout le reste est une convention**, écrite dans `docs/` : l'ordre des sections d'une page, le choix d'un bloc existant, le sens d'une couleur, la voix des textes. Tu la suis. Quand la personne demande quelque chose qui s'en écarte, une section en moins sur une page, un bloc nouveau là où un bloc existe, une couleur qui ne porte pas de sens, dis-le-lui avant de modifier, en deux phrases : ce que la convention prévoit, et ce que sa demande change pour l'homogénéité du site. Puis fais ce qu'elle décide.

## Les gestes

Quatre gestes, à chaque modification : prévisualiser, modifier, publier, et parfois revenir à une version d'avant.

### 1. Prévisualiser

La personne voit le site sur son ordinateur, dans le navigateur à côté de la conversation. Le site en ligne ne change pas.

1. Si `node_modules/` manque, ou si `package.json` a changé, lance `pnpm install`.
2. Lance `pnpm dev`. Le serveur de prévisualisation démarre en arrière-plan et la commande rend la main. S'il tourne déjà, la commande le dit et le garde.
3. Ouvre le site dans le navigateur à côté de la conversation : l'outil `preview_start` avec l'adresse `http://localhost:4321`. Chaque fichier enregistré s'y voit aussitôt.
4. Donne-lui aussi le lien [http://localhost:4321](http://localhost:4321) : il rouvre le site si elle a fermé le navigateur. Si l'outil `preview_start` manque, ce lien suffit.
5. `pnpm astro dev status` dit s'il tourne ; `pnpm astro dev stop` l'arrête.

Fais la modification qu'elle demande (geste 2), puis ouvre la page modifiée dans ce navigateur avec l'outil `navigate`.

### 2. Modifier le site

Chaque modification se fait dans les deux langues : le français d'abord, puis la même chose en allemand. Les règles sont dans `docs/` ; lis le document du cas avant de modifier.

- **Un horaire, une fermeture, une annonce en haut des pages d'une clinique** : la fiche de la clinique, `src/donnees/cliniques/<clinique>.json` (`docs/fiche-clinique.md`, « Les gestes courants »). Toutes les pages de la clinique suivent.
- **Un texte d'une page** : son fichier dans `src/content/pages/fr/`, puis le même dans `src/content/pages/de/`. Suis la skill `rediger-une-page`.
- **Une nouvelle page** : un nouveau fichier dans chaque langue, au chemin que donne `docs/plan-des-pages.md`, avec les sections que donne `docs/structure-des-pages.md`. Suis la skill `rediger-une-page`.
- **Un prix, un numéro ou un fait qui apparaît sur plusieurs pages** : cherche chaque endroit dans les deux langues, `grep -rn "<valeur>" src/content/pages src/donnees`, et corrige partout. Un horaire ou un numéro de garde se change dans la fiche, jamais dans les pages.
- **Un texte d'un menu ou d'un bouton** : `src/i18n/fr.ts` et la même clé dans `src/i18n/de.ts`.
- **Une photo nouvelle, remplacée ou retirée** : le fichier dans `src/assets/images/` et son entrée dans le catalogue (`docs/charte-graphique.md`, « Le catalogue des photos »).
- **Une personne qui arrive ou qui part** : la fiche de la clinique et sa photo (`docs/fiche-clinique.md`, « Les gestes courants »), puis la page Équipe dans les deux langues avec la skill `rediger-une-page`.
- **Un service en plus ou en moins dans une clinique** : la liste `services` de la fiche (`docs/fiche-clinique.md`, « Les gestes courants »). Sa page dans la clinique reprend toute seule la page commune du service, dans les deux langues.
- **Une clinique entière** : la skill `mettre-une-clinique-en-ligne`.
- **La mise en page ou un bloc** : la skill `modifier-la-mise-en-page`.

Après chaque modification, vérifie la page en allemand, puis termine toujours sur la page en français, dans le navigateur à côté de la conversation, défilée jusqu'à l'endroit modifié. La personne ne doit jamais rester sur la page allemande. Le lien « DE » de l'en-tête passe d'une langue à l'autre.

### 3. Publier

Seulement quand la personne le demande (« publie »), après avoir vu la modification en local.

1. Vérifie le site : `pnpm verifier`. S'il échoue, lis le message : il nomme le fichier et la règle en cause. Corrige, montre la correction en local, puis recommence.
2. Montre ce qui va partir : `git status`, et dis-le en mots simples.
3. Reprends ce qui a pu être publié depuis un autre ordinateur : `git pull --rebase origin main`.
4. Enregistre la modification avec un message clair, en français, qui dit ce qui change sur le site :

       git add -A
       git commit -m "La page d'accueil a un nouveau titre"

5. Publie : `git push origin main`.
6. Suis la publication jusqu'au bout. Trouve le numéro du workflow lancé par ce commit :

       gh run list --workflow publier.yml --commit "$(git rev-parse HEAD)" --json databaseId --jq '.[0].databaseId'

   S'il ne rend rien, attends quelques secondes et recommence. Puis suis-le :

       gh run watch <numéro> --exit-status

7. Vert : le site en ligne montre la modification. Son adresse : `gh variable get SITE_ADRESSE`. Donne-la à la personne.
8. Si le journal dit « Rien n'est publié », le site n'est pas encore installé sur son serveur : dis-le à la personne. Rien n'est cassé.
9. Rouge : lis ce qui a échoué, `gh run view <numéro> --log-failed`, et explique-le simplement.
   - Si la construction du site a échoué, la cause est la modification : corrige-la, vérifie-la en local, puis publie de nouveau.
   - Si l'attente du site en ligne a échoué, le site en ligne n'a pas repris la modification. Dis à la personne de prévenir la personne qui s'occupe de son serveur.

Ne publie qu'une chose à la fois : attends la fin d'une publication avant la suivante.

### 4. Revenir à une version d'avant

Quand la personne veut retrouver le site d'avant une modification.

1. Montre les dernières modifications : `git log --oneline -10`. Dis chacune en mots simples, avec sa date (`git log -10 --format="%h %ad %s" --date=short`).
2. Demande-lui laquelle annuler.
3. Annule-la par un nouveau commit : `git revert --no-edit <commit>`. Pour en annuler plusieurs, annule-les une par une, de la plus récente à la plus ancienne.
4. Montre-lui le résultat en local (geste 1), puis publie (geste 3).

L'historique ne se réécrit jamais : ni `git reset` sur une modification déjà publiée, ni poussée forcée.

### De temps en temps : relire tout le site

Quand la personne demande une relecture complète ou un nettoyage, suis la skill `auditer-le-site`. Jamais à chaque modification : la vérification de chaque publication suffit.

## Les règles

- Aucun mot de passe, jeton ou clé dans les fichiers du site : tout ce qui est dans ce dossier peut être lu par tous.
- Une modification se voit en local avant d'être publiée, en français et en allemand.
- En cas de doute sur ce que veut la personne, demande-lui avant de modifier.
