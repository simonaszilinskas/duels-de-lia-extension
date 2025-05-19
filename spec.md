# Duels de l'IA - extension Chrome

### 🎯 Objectif

Créer une **extension Chrome** activée **uniquement** sur l'URL `https://comparia.beta.gouv.fr/arene`, destinée à un atelier pédagogique nommé **Duel de l'IA**.

---

### ✅ Fonctionnalités principales

#### 1. **Activation contextuelle**

* L’extension n’apparaît **que sur** `comparia.beta.gouv.fr/arene`.

#### 2. **FAB (Floating Action Button)**

* Bouton flottant toujours visible en bas à droite.
* Au clic, ouvre un **panneau flottant déplaçable** (pas un modal plein écran).
* Le panneau apparaît par défaut au centre-droit de l'écran.
* L'utilisateur peut déplacer le panneau en cliquant et glissant sur l'en-tête.
* Le reste de la page reste complètement utilisable (pas de backdrop).
* L'utilisateur peut continuer à voir et interagir avec le contenu de la page principale.

#### 3. **Interface principale**

* **3 onglets thématiques (tabs)** :

  * Impact environnemental (💡 contenu prêt)
  * Biais
  * Souveraineté numérique

* Chaque tab contient :

  * **4 "carrés" (gros boutons)** :

    * Prompt
    * Cartes débat
    * Ressource pédagogique
    * FAQ

  * **Un bouton principal** :
    `Révéler la question ultime`

    * Affiche un bloc de texte (question)
    * Affiche un **lien hypertexte** vers une **conclusion** (ouvre un nouvel onglet)

---

### 🧩 Structure technique

#### Composants modulaires

* Chaque **onglet** est une section indépendante.
* Chaque **carré** ouvre un contenu riche (HTML/CSS/JS possibles).
* Tous les contenus doivent être **facilement modifiables** (via fichiers JSON, Markdown ou CMS headless si nécessaire à terme).

#### Architecture scalable

* Prévoir structure de code/extensible :

  * Composants réutilisables (React ou vanilla avec modularisation)
  * Données séparées de la logique (contenu = fichiers de config)
  * Préparer les hooks ou points d’extension pour ajouter des onglets ou des blocs de contenu facilement

---

### 🛠 Priorité de développement

1. Focus sur **Impact environnemental** uniquement pour l’instant
2. Placeholder dans les autres tabs
3. Interface propre et légère, pensée pour le scaling futur et maintenabilité - jamais de fichiers très longs et prioriser les techniques qui nécessitent pas de build ou de compilation.
