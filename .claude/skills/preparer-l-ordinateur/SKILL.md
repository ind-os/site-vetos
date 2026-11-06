---
name: preparer-l-ordinateur
description: "À suivre quand un outil du site manque sur l'ordinateur (node, pnpm, git, gh), quand la connexion à GitHub ou le nom Git manque, ou sur un ordinateur neuf. Vérifie, installe ce qui manque sur Mac ou Windows, connecte GitHub, puis installe les dépendances du site."
---

# Préparer l'ordinateur

## 1. Vérifier

Lance, sans rien installer :

    node --version        # 22.23.4 ou plus récent
    pnpm --version        # 12 ou plus récent
    git --version
    gh --version
    gh auth status
    git config user.name
    git config user.email

Dis à la personne, en une courte liste, ce qui manque. S'il ne manque qu'une connexion ou un nom, passe à l'étape 3.

## 2. Installer ce qui manque

**Sur un Mac**, par Homebrew.

1. Si `brew --version` échoue, Homebrew manque. Donne à la personne cette ligne, à coller dans l'app Terminal :

       /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   Dis-lui que le Mac va lui demander le mot de passe de sa session, qu'elle le tape elle-même, et que rien ne s'affiche pendant qu'elle tape. À la fin, Homebrew affiche deux ou trois lignes « Next steps » : elle les colle aussi dans le Terminal. Attends qu'elle te dise que c'est fini.
2. Installe toi-même ce qui manque : `brew install node pnpm git gh`. Un outil trop ancien se met à jour par `brew upgrade <outil>`.

**Sur Windows** :

1. Installe toi-même ce qui manque : `winget install --exact --accept-package-agreements --accept-source-agreements OpenJS.NodeJS.LTS Git.Git GitHub.cli`. Si Windows demande une autorisation, c'est la personne qui l'accepte.
2. L'app Claude ne voit un outil installé qu'après avoir été relancée. Demande à la personne de quitter complètement l'app Claude (clic droit sur son icône près de l'horloge, puis « Quitter »), de la rouvrir et de revenir dans cette conversation.
3. Installe pnpm : `npm install --global pnpm@12`.

## 3. Connecter GitHub et Git

1. Si `gh auth status` dit qu'elle n'est pas connectée, donne-lui cette ligne, à taper dans le Terminal :

       gh auth login --hostname github.com --git-protocol https --web

   Elle répond « Yes » à la question sur Git, puis copie le code affiché dans la page de GitHub qui s'ouvre.
2. Si `git config user.name` ou `git config user.email` est vide, demande-lui son nom et l'adresse mail de son compte GitHub, puis pose-les :

       git config --global user.name "<son nom>"
       git config --global user.email "<son adresse>"

## 4. Installer le site et vérifier

1. `pnpm install`.
2. Relance les commandes de l'étape 1 : chacune répond, et `gh auth status` dit qu'elle est connectée.
3. Dis-lui que l'ordinateur est prêt.
