# Guide de Déploiement du Portfolio de Souleymane

Ce projet utilise **Vite** pour le développement et la compilation, et **Firebase Hosting** pour le déploiement.

## 📦 Installation
Si les dépendances ne sont pas encore installées, exécutez :
```bash
npm install
```

## 🚀 Développement local
Pour lancer le site en mode développement :
```bash
npm run dev
```

## 🏗️ Compilation et Déploiement
Pour compiler le projet et le déployer sur Firebase Hosting en une seule commande :
```bash
npm run deploy
```

### Étapes de déploiement manuelles (si nécessaire) :
1. **Connexion à Firebase** :
   ```bash
   firebase login
   ```
2. **Initialisation** (Déjà fait, mais au cas où) :
   ```bash
   firebase init
   ```
3. **Déploiement** :
   ```bash
   firebase deploy --only hosting
   ```

## 📁 Structure du Projet
- `index.html` : Fichier principal (racine).
- `style.css` : Styles du site.
- `script.js` : Logique JavaScript (utilisant des modules npm).
- `firebase-config.js` : Configuration Firebase (apiKey, etc.).
- `dist/` : Dossier généré après `npm run build` (c'est ce dossier qui est envoyé sur Firebase).

---
**Note** : Vos identifiants Firebase ont déjà été intégrés dans `firebase-config.js`.
