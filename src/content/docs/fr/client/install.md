---
title: 'Installation et premier lancement'
description: 'L''ouvrir la première fois (macOS s''ouvre simplement ; Windows demande Exécuter quand même), se connecter avec Google, créer un personnage et entrer en jeu.'
---

## L'ouvrir la première fois

### macOS — il s'ouvre simplement

**La version macOS est signée avec un Apple Developer ID, notariée par Apple, et le ticket est agrafé à l'application.** Décompressez, double-cliquez, et elle se lance sans avertissement de Gatekeeper.

Vous n'avez pas besoin de clic droit → Ouvrir, ni de `xattr -cr` : le conseil que l'on trouve en ligne pour les applications non signées ne s'applique pas à cette version.

### Windows — un clic de plus

**La version Windows n'est pas signée**, donc SmartScreen affiche « Windows a protégé votre ordinateur ». Cliquez sur **Informations complémentaires** → **Exécuter quand même**.

Les certificats de signature de code coûtent de l'argent chaque année et il n'y en a actuellement qu'un, pour macOS. Si le projet vous est utile, [le soutenir](https://ko-fi.com/dakywang) aide à mettre un certificat Windows à portée.

### Linux — mettez le bit d'exécution

Les AppImage n'ont pas de signature à proprement parler ; il leur faut juste être exécutables :

```bash
chmod +x openmmo-agent-*linux-x64.AppImage
./openmmo-agent-*linux-x64.AppImage
```

## Premier lancement

Quatre écrans dans l'ordre et vous êtes en jeu. **Il n'y a pas d'étape « Jouer » séparée** : choisir un personnage entre en jeu immédiatement.

### 1. Serveur — choisissez un profil de connexion

Le profil intégré `openmmo.to.nexus` est figé, et c'est celui que veut la plupart des joueurs.

Un profil lie trois choses : l'URL du serveur, l'origine des ressources de terrain, et un identifiant/secret client Google. Ils doivent voyager ensemble, car un serveur n'accepte que les jetons émis par un identifiant client figurant sur sa propre liste. Si vous gérez votre propre serveur, vous pouvez créer, modifier, dupliquer et supprimer des profils, et tester la connexion avant de l'utiliser.

### 2. Connexion — flux par appareil de Google

Appuyez sur le bouton et un code apparaît ; saisissez-le dans votre navigateur. Un identifiant en cache passe directement à l'étape suivante.

### 3. Personnage — choisir ou créer

Deux onglets :

- **Choisissez votre personnage** — jusqu'à 3 par compte (imposé par le serveur). Cliquez pour entrer en jeu, ou supprimez.
- **Créer un nouveau personnage** — nom, classe, genre. Masqué une fois la limite atteinte.

### 4. Jeu

Le mode est décidé pour vous à l'entrée : **automatique si un backend LLM est configuré et passe la validation, manuel sinon**. Si l'automatique ne démarre pas, il retombe en manuel. Vous pouvez changer à tout moment depuis l'en-tête.

## Les deux modes de jeu

Le serveur n'autorise qu'une seule session de contrôle par personnage, donc les deux modes y parviennent différemment.

**Le jeu manuel** est une connexion directe : le client web OpenMMO intégré se connecte avec votre propre compte Google et parle directement au serveur, exactement comme en navigateur. Pas de relais, pas d'`agent-client`.

**Le jeu automatique** lance `agent-client`, qui a besoin de cette unique session pour lui — donc le regarder ne peut pas vouloir dire se connecter à côté de lui. À la place, un relais s'installe en loopback :

```
agent-client <--ws--> proxy (127.0.0.1) <--wss--> openmmo.to.nexus
                        |
                        +--> spectateurs (/mirror)
```

Le serveur n'a aucune idée qu'il y a quelque chose derrière l'agent. Être au milieu permet au relais de dupliquer chaque message du serveur vers une vue spectateur en lecture seule. **Le relais n'écoute que sur `127.0.0.1`, donc rien ne quitte votre machine.**

## L'écran de jeu

L'en-tête affiche l'état de la connexion, les constantes, la mémoire utilisée par le spectateur, un bouton pour recharger la vue 3D, le commutateur manuel/IA, et des boutons pour changer de personnage ou de serveur. Modifiez un réglage pendant que l'agent tourne et un bouton **Appliquer et redémarrer** apparaît.

Le rail de gauche ouvre six tiroirs :

| Tiroir | Ce qu'il montre |
|---|---|
| Équipement | Ce qui est porté, emplacement par emplacement |
| Sac | Ce qui est transporté, et quels objets l'agent peut vendre ou jeter |
| Personnalité et mémoire | Le prompt propre à ce personnage (modifiable) et ce que l'agent a noté (lecture seule) |
| Coordonnées | Des repères de lieux, dont « utiliser la position actuelle » |
| Consignes enregistrées | Les instructions fréquentes enregistrées en boutons à un clic |
| Activité | Deux onglets : Pensées (chaque prompt et réponse) et Journal (la sortie du processus de l'agent) |

Chaque tiroir est détaillé dans la [référence du panneau](../panel/).

**Consigne**, ancrée sous la vue de jeu, est le seul contrôle qui atteint un agent en marche : tapez une instruction et elle arrive comme le prochain tour du personnage, **au mieux — aucune garantie qu'elle soit suivie.**

## Où vivent vos clés

Les clés d'API et les secrets des profils de connexion sont chiffrés avec le trousseau du système (le `safeStorage` d'Electron, avec AES-GCM en secours) et transmis à l'agent comme variables d'environnement — **jamais écrits dans `config.toml`.** Une configuration collée dans un rapport de bug ne contient aucun identifiant.

## Dépannage

**Version de protocole incompatible** — le serveur a été mis à jour. Prenez une nouvelle version sur la [page de téléchargement](../download/).

**J'ai changé un réglage et rien ne s'est passé** — l'agent lit sa configuration une seule fois au démarrage. Appuyez sur **Appliquer et redémarrer** dans l'en-tête.

**Lancé depuis un terminal VS Code et il ne s'ouvre jamais** — VS Code est lui-même une application Electron et laisse fuir `ELECTRON_RUN_AS_NODE=1`, démarrant le client comme du Node simple :

```bash
env -u ELECTRON_RUN_AS_NODE npm start
```

**Quelque chose manque ou est figé dans la vue spectateur** — la vue spectateur du jeu automatique part d'un instantané, donc tout ce que l'agent connaît sans le suivre actuellement apparaît au fur et à mesure qu'il revient en vue.
