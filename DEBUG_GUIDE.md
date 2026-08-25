# Guide de débogage – Duels de l'IA

## Si le bouton flottant n'apparaît pas

L'extension s'affiche sur tout le site `comparia.beta.gouv.fr`, y compris ses
sous-domaines. L'arène se trouve à la racine : `https://comparia.beta.gouv.fr/`.

### 1. Vérifier l'installation

1. Ouvrez `chrome://extensions/`.
2. Vérifiez que l'extension est installée et activée.
3. Après une modification locale, cliquez sur l'icône de rechargement de
   l'extension, puis rechargez l'onglet compar:IA.

### 2. Ouvrir la console

Ouvrez les outils de développement avec F12, Ctrl+Maj+I sous Windows et Linux,
ou Cmd+Option+I sous macOS, puis choisissez l'onglet « Console ».

Au chargement, le script journalise notamment :

```text
🎯 Duels de l'IA - Script chargé
📍 URL complète: https://comparia.beta.gouv.fr/...
🌐 Hostname: comparia.beta.gouv.fr
📄 Pathname: /...
✅ Hôte compar:IA ? true
```

Si le message `Script chargé` est absent, rechargez l'extension et contrôlez
son accès au site. Si `Hôte compar:IA ?` vaut `false`, vérifiez le domaine
ouvert.

### 3. Vérifier l'initialisation

Les messages suivants permettent de localiser l'échec :

- `🔨 Création du FAB...`, puis `✅ FAB créé avec succès` : le bouton a
  été injecté ;
- `📚 Chargement des données JSON...`, puis `✅ Données JSON chargées` :
  le contenu embarqué est disponible ;
- `🎉 Initialisation terminée avec succès!` : le panneau est prêt.

Une erreur `document.body n'existe pas` signale une initialisation trop tôt.
Une erreur de chargement JSON concerne la ressource embarquée
`data/content-data.json`.

### 4. Si le bouton existe mais reste invisible

Le journal `🎨 Styles du FAB` affiche ses styles calculés. Contrôlez surtout
que `display` n'est pas `none`, que `visibility` vaut `visible`, que `position`
vaut `fixed` et que le `zIndex` est suffisamment élevé.

### 5. Si le panneau s'ouvre mais que son contenu manque

Le panneau actuel contient une liste d'étapes, quatre entrées (prompts, cartes
débat, ressources et FAQ), une conclusion et une rubrique de retours. Il ne
comporte pas d'onglets thématiques. Cherchez une erreur `Erreur de chargement
des données` ou `Données invalides` dans la console.

### 6. Derniers essais

1. Rechargez la page.
2. Rechargez l'extension depuis `chrome://extensions/`.
3. Testez dans une fenêtre privée après y avoir autorisé l'extension.
4. Désactivez temporairement les extensions susceptibles de modifier la page.

Si le problème persiste, transmettez les messages d'erreur utiles de la console,
sans inclure de données personnelles.
