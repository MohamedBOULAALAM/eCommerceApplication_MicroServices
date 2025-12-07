# Frontend Angular - eComApp Microservices

Application frontend Angular pour interagir avec l'architecture microservices Spring Cloud.

## 🚀 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation des dépendances

```bash
cd frontend
npm install
```

## 🏃 Démarrage

Pour démarrer l'application en mode développement :

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 📦 Structure du Projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/          # Page d'accueil
│   │   │   ├── customers/      # Gestion des clients
│   │   │   ├── products/       # Gestion des produits
│   │   │   └── bills/          # Consultation des factures
│   │   ├── app.component.*     # Composant principal
│   │   ├── app.config.ts       # Configuration de l'application
│   │   └── app.routes.ts       # Routes de l'application
│   ├── models/                 # Modèles TypeScript
│   │   ├── customer.model.ts
│   │   ├── product.model.ts
│   │   └── bill.model.ts
│   ├── services/               # Services Angular
│   │   ├── customer.service.ts
│   │   ├── product.service.ts
│   │   └── bill.service.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

L'application est configurée pour communiquer avec la Gateway Spring Cloud sur le port **8888**.

Les URLs de l'API sont définies dans les services :
- **CustomerService** : `http://localhost:8888/api/customers`
- **ProductService** : `http://localhost:8888/api/products`
- **BillService** : `http://localhost:8888/bills`

## 📱 Fonctionnalités

### Gestion des Clients
- Liste de tous les clients
- Création d'un nouveau client
- Modification d'un client existant
- Suppression d'un client

### Gestion des Produits
- Liste de tous les produits
- Création d'un nouveau produit
- Modification d'un produit existant
- Suppression d'un produit

### Consultation des Factures
- Recherche d'une facture par ID
- Affichage des détails complets de la facture
- Informations client enrichies
- Liste des produits avec détails
- Calcul automatique du total

## 🛠️ Technologies Utilisées

- **Angular 17** (Standalone Components)
- **TypeScript**
- **RxJS** (pour les observables)
- **Angular Forms** (Template-driven forms)
- **Angular Router** (pour la navigation)
- **Angular HttpClient** (pour les appels API)

## 📝 Notes

- Assurez-vous que tous les microservices backend sont démarrés avant de lancer le frontend
- La Gateway doit être accessible sur `http://localhost:8888`
- En cas d'erreur CORS, vérifiez la configuration de la Gateway

## 🔨 Build pour Production

Pour créer une version de production :

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/ecom-app-frontend`.

