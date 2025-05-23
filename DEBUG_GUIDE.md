# Guide de débogage - Duels de l'IA

## Si le FAB n'apparaît pas sur comparia.beta.gouv.fr/arene/

### 1. Ouvrir la console du navigateur
- Appuyez sur **F12** ou **Ctrl+Shift+I** (Cmd+Option+I sur Mac)
- Cliquez sur l'onglet **Console**

### 2. Vérifier les logs
Vous devriez voir une série de messages commençant par des emojis :

```
====================================
🎯 Duels de l'IA - Script chargé
⏰ Timestamp: 2025-01-23T10:30:00.000Z
🔧 Extension ID: [id de l'extension]
====================================
📍 URL complète: https://comparia.beta.gouv.fr/arene/...
🌐 Hostname: comparia.beta.gouv.fr
📄 Pathname: /arene/...
====================================
```

### 3. Points de vérification

#### ✅ Le script se charge-t-il ?
- Si vous ne voyez pas "🎯 Duels de l'IA - Script chargé", l'extension n'est pas active
- Vérifiez que l'extension est bien installée et activée

#### ✅ L'URL est-elle correcte ?
- Vérifiez que l'URL contient bien "comparia.beta.gouv.fr/arene/"
- Si vous voyez "⚠️ Pas sur la page arène", l'URL ne correspond pas

#### ✅ Le FAB est-il créé ?
- Cherchez "🔨 Création du FAB..."
- Si vous voyez "✅ FAB créé avec succès", vérifiez les styles affichés
- Si vous voyez "❌ document.body n'existe pas", la page n'est pas prête

#### ✅ Les données se chargent-elles ?
- Cherchez "📚 Chargement des données JSON..."
- Si vous voyez "❌ Erreur de chargement", il y a un problème avec les ressources

### 4. Problèmes courants

#### Le FAB est créé mais invisible
Vérifiez les styles du FAB dans les logs :
```
🎨 Styles du FAB: {
  display: "block",     // Doit être "block" ou "flex"
  visibility: "visible", // Doit être "visible"
  position: "fixed",     // Doit être "fixed"
  zIndex: "9999",       // Doit être un nombre élevé
}
```

#### Erreur de chargement des ressources
- L'extension pourrait être corrompue
- Essayez de la désinstaller et réinstaller

### 5. Partager les logs
Si le problème persiste, copiez tous les logs de la console et partagez-les avec le support technique.

### 6. Solutions rapides à essayer

1. **Rafraîchir la page** (F5)
2. **Vider le cache** (Ctrl+Shift+R)
3. **Désactiver d'autres extensions** qui pourraient interférer
4. **Tester en mode incognito** (en autorisant l'extension)
5. **Vérifier les permissions** de l'extension sur chrome://extensions/