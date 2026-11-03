# Le site

Tu aides une personne à faire évoluer son site. Elle n'est pas développeuse.

- Parle-lui en français, en phrases courtes, sans jargon.
- Dis ce que tu vas faire avant de le faire, et ce que ça change pour elle.
- Fais les commandes toi-même. Ne lui demande un geste que s'il touche un mot de passe ou une connexion.
- Ne lui demande jamais un mot de passe et n'en tape jamais un.

## Ce qu'il y a dans ce dossier

Le site vetmint.ch, en français et en allemand : les pages communes du groupe et les pages de chaque clinique, sous `vetmint.ch/<clinique>/`.

- `src/content/pages/fr/` et `src/content/pages/de/` : les textes, une page par fichier, dans chaque langue. `fr/payerne/equipe.md` est la page `/payerne/equipe/` ; `de/payerne/equipe.md` est sa traduction.
- `src/donnees/cliniques/` : la fiche de chaque clinique. Horaires, fermetures, annonce, équipe, téléphone, rendez-vous.
- `src/i18n/fr.ts` et `src/i18n/de.ts` : les petits textes des menus et des boutons.
- `src/assets/images/` : les photos et leur catalogue.
- `src/composants/` : les blocs du site. La page `/styleguide/` les montre tous.
- `docs/` : les règles du site. `docs/plan-des-pages.md` dit quelle page vit où.

Ne modifie pas `Dockerfile`, `nginx.conf` ni `src/pages/healthz.json.ts` : ils servent à publier le site. `.github/` et `.claude/` te sont fermés.

## Les gestes

Cinq gestes : préparer l'ordinateur, une fois ; puis, à chaque modification, prévisualiser, modifier, publier, et parfois revenir à une version d'avant.

### 1. Préparer l'ordinateur

À faire une fois, et chaque fois qu'une commande ci-dessous manque.

1. Vérifie les outils, sans rien installer :

       node --version        # 22.23.4 ou plus récent
       pnpm --version        # 12 ou plus récent
       git --version
       gh --version
       gh auth status
       git config user.name
       git config user.email

2. Dis à la personne, en une courte liste, ce qui manque. S'il ne manque rien, passe à l'étape 6.
3. Sur un Mac, installe ce qui manque par Homebrew.
   - Si `brew --version` échoue, Homebrew manque. Donne à la personne cette ligne, à coller dans l'app Terminal :

         /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

     Dis-lui que le Mac va lui demander le mot de passe de sa session, qu'elle le tape elle-même, et que rien ne s'affiche pendant qu'elle tape. À la fin, Homebrew affiche deux ou trois lignes « Next steps » : elle les colle aussi dans le Terminal. Attends qu'elle te dise que c'est fini.
   - Puis installe toi-même ce qui manque : `brew install node pnpm git gh`. Un outil trop ancien se met à jour par `brew upgrade <outil>`.
4. Sur Windows, installe ce qui manque par `winget install OpenJS.NodeJS.LTS Git.Git GitHub.cli`, puis `npm install --global pnpm@12`. Si Windows demande une autorisation, c'est la personne qui l'accepte. Rouvre ensuite le terminal pour que les commandes soient trouvées.
5. Si `gh auth status` dit qu'elle n'est pas connectée, donne-lui cette ligne, à taper dans le Terminal :

       gh auth login --hostname github.com --git-protocol https --web

   Elle répond « Yes » à la question sur Git, puis copie le code affiché dans la page de GitHub qui s'ouvre. Vérifie ensuite par `gh auth status`.
6. Si `git config user.name` ou `git config user.email` est vide, demande-lui son nom et l'adresse mail de son compte GitHub, puis pose-les :

       git config --global user.name "<son nom>"
       git config --global user.email "<son adresse>"

7. Installe les dépendances du site : `pnpm install`.

### 2. Prévisualiser

La personne voit sa modification sur son ordinateur avant de la publier. Le site en ligne ne change pas.

1. Si `node_modules/` manque, ou si `package.json` a changé, lance `pnpm install`.
2. Lance `pnpm dev`. Le serveur de prévisualisation démarre en arrière-plan et la commande rend la main.
3. Donne-lui l'adresse à ouvrir dans son navigateur : `http://localhost:4321`. Chaque fichier enregistré s'y voit aussitôt.
4. `pnpm astro dev status` dit s'il tourne ; `pnpm astro dev stop` l'arrête.

Fais la modification qu'elle demande (geste 3), puis dis-lui où la regarder.

### 3. Modifier le site

Chaque modification se fait dans les deux langues : le français d'abord, puis la même chose en allemand. Les règles sont dans `docs/` ; lis le document du cas avant de modifier.

- **Un horaire, une fermeture, une annonce en haut des pages d'une clinique** : la fiche de la clinique, `src/donnees/cliniques/<clinique>.json` (`docs/fiche-clinique.md`, « Les gestes courants »). Toutes les pages de la clinique suivent.
- **Un texte d'une page** : son fichier dans `src/content/pages/fr/`, puis le même dans `src/content/pages/de/`. Suis la skill `rediger-une-page`.
- **Une nouvelle page** : un nouveau fichier dans chaque langue, au chemin que donne `docs/plan-des-pages.md`. Suis la skill `rediger-une-page`.
- **Un texte d'un menu ou d'un bouton** : `src/i18n/fr.ts` et la même clé dans `src/i18n/de.ts`.
- **Une clinique entière** : la skill `mettre-une-clinique-en-ligne`.
- **La mise en page ou un bloc** : regarde d'abord `/styleguide/`. Utilise un bloc qui existe ; s'il faut en créer un, ajoute-le au styleguide le même jour (`docs/charte-graphique.md`).

Après chaque modification, montre à la personne la page en français et en allemand. Le lien « DE » de l'en-tête passe d'une langue à l'autre.

### 4. Publier

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

### 5. Revenir à une version d'avant

Quand la personne veut retrouver le site d'avant une modification.

1. Montre les dernières modifications : `git log --oneline -10`. Dis chacune en mots simples, avec sa date (`git log -10 --format="%h %ad %s" --date=short`).
2. Demande-lui laquelle annuler.
3. Annule-la par un nouveau commit : `git revert --no-edit <commit>`. Pour en annuler plusieurs, annule-les une par une, de la plus récente à la plus ancienne.
4. Montre-lui le résultat en local (geste 2), puis publie (geste 4).

L'historique ne se réécrit jamais : ni `git reset` sur une modification déjà publiée, ni poussée forcée.

## Les règles

- Aucun mot de passe, jeton ou clé dans les fichiers du site : tout ce qui est dans ce dossier peut être lu par tous.
- Une modification se voit en local avant d'être publiée, en français et en allemand.
- En cas de doute sur ce que veut la personne, demande-lui avant de modifier.
