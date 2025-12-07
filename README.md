# eComAppMicroServices - Architecture Microservices avec Spring Cloud

## 📋 Description du Projet

Ce projet implémente une application de gestion de factures basée sur une architecture microservices utilisant l'écosystème **Spring Boot** et **Spring Cloud**. L'application permet de gérer les clients, les produits et les factures, avec une architecture distribuée et découplée.

### Objectif

Créer une application basée sur une architecture microservices qui permet de gérer les factures contenant des produits et appartenant à un client.

## 🏗️ Architecture Microservices

L'architecture est composée de **microservices fonctionnels** et **microservices techniques** :

### Microservices Fonctionnels

1. **Customer-Service** (Port: 8081)
   - Gestion des clients
   - Entité : `Customer` (id, nom, email)
   - Base de données : H2 (en mémoire)
   - API REST exposée via Spring Data REST

2. **InventoryService** (Port: 8082)
   - Gestion des produits
   - Entité : `Product` (id, nom, prix, quantité)
   - Base de données : H2 (en mémoire)
   - API REST exposée via Spring Data REST

3. **BillingService** (Port: 8083)
   - Gestion des factures
   - Entités : `Bill` (facture) et `ProductItem` (ligne de facture)
   - Communication inter-services via **Open Feign**
   - Enrichissement des données en appelant Customer-Service et InventoryService

### Microservices Techniques

4. **DiscoveryService** (Port: 8761)
   - Annuaire de services **Eureka Server**
   - Enregistrement et découverte automatique des microservices
   - Dashboard disponible sur `http://localhost:8761`

5. **GatewayService** (Port: 8888)
   - **Spring Cloud Gateway** (basé sur WebFlux/Netty)
   - Point d'entrée unique pour toutes les requêtes
   - Routage dynamique basé sur Eureka Discovery
   - Configuration statique et dynamique des routes

6. **ConfigService** (Port: 9999)
   - **Spring Cloud Config Server**
   - Configuration centralisée via dépôt Git
   - Support des profils (dev, prod)
   - Refresh à chaud via Actuator

## 🛠️ Technologies Utilisées

### Backend
- **Java 21**
- **Spring Boot 3.x**
- **Spring Cloud** (Gateway, Eureka, Config Server, Open Feign)
- **Spring Data JPA**
- **Spring Data REST**
- **H2 Database** (base de données en mémoire)
- **Lombok**
- **Spring Actuator** (monitoring)

### Frontend
- **Angular** (client web)

## 📁 Structure du Projet

```
eComApMicroServices/
├── CustomerService/          # Microservice de gestion des clients
├── InventoryService/         # Microservice de gestion des produits
├── BillingService/           # Microservice de facturation
├── DiscoveryService/         # Serveur Eureka
├── GatewayService/           # Spring Cloud Gateway
├── ConfigService/            # Serveur de configuration
├── config-repo/              # Dépôt Git de configuration
│   ├── application.properties
│   ├── CustomerService.properties
│   ├── InventoryService.properties
│   ├── BillingService.properties
│   └── [service]-[profile].properties
└── pom.xml                   # POM parent
```

## ⚙️ Configuration

### 1. Customer-Service

**Port:** 8081

**Configuration:**
- Base de données H2 en mémoire
- Spring Data REST avec base-path `/api`
- Enregistrement auprès d'Eureka
- Client Config Server

**Endpoints REST générés automatiquement:**
- `GET /api/customers` - Liste tous les clients
- `GET /api/customers/{id}` - Récupère un client par ID
- `POST /api/customers` - Crée un nouveau client
- `PUT /api/customers/{id}` - Met à jour un client
- `DELETE /api/customers/{id}` - Supprime un client

### 2. InventoryService

**Port:** 8082

**Configuration:**
- Base de données H2 en mémoire
- Spring Data REST avec base-path `/api`
- Enregistrement auprès d'Eureka
- Client Config Server
- Actuator configuré pour exposer tous les endpoints

**Endpoints REST générés automatiquement:**
- `GET /api/products` - Liste tous les produits
- `GET /api/products/{id}` - Récupère un produit par ID
- `POST /api/products` - Crée un nouveau produit
- `PUT /api/products/{id}` - Met à jour un produit
- `DELETE /api/products/{id}` - Supprime un produit

### 3. BillingService

**Port:** 8083

**Configuration:**
- Base de données H2 en mémoire
- Open Feign activé pour la communication inter-services
- Enregistrement auprès d'Eureka
- Client Config Server

**Clients Feign:**
- `CustomerRestClient` - Communication avec Customer-Service
- `ProductRestClient` - Communication avec InventoryService

**Endpoints personnalisés:**
- `GET /bills/{id}` - Récupère une facture avec enrichissement des données (client et produits)

**Entités:**
- `Bill` : Facture avec `customerId` (clé étrangère) et `customer` (@Transient)
- `ProductItem` : Ligne de facture avec `productId` (clé étrangère) et `product` (@Transient)

### 4. DiscoveryService (Eureka)

**Port:** 8761

**Configuration:**
- Serveur Eureka activé avec `@EnableEurekaServer`
- Ne s'enregistre pas lui-même (`register-with-eureka=false`)
- Ne récupère pas sa propre configuration (`fetch-registry=false`)

**Dashboard:** `http://localhost:8761`

### 5. GatewayService

**Port:** 8888

**Configuration:**
- Spring Cloud Gateway Reactive (WebFlux)
- Routage dynamique via `DiscoveryClientRouteDefinitionLocator`
- Support des noms de services en minuscules (`lower-case-service-id=true`)

**Routes configurées:**
- `/api/customers/**` → `lb://CUSTOMERSERVICE` (Customer-Service)
- `/api/products/**` → `lb://INVENTORYSERVICE` (InventoryService)

**Accès via Gateway:**
- `http://localhost:8888/api/customers` → Customer-Service
- `http://localhost:8888/api/products` → InventoryService

### 6. ConfigService

**Port:** 9999

**Configuration:**
- Config Server activé avec `@EnableConfigServer`
- Dépôt Git : `https://github.com/MohamedBOULAALAM/eCommerceApp_RepoConfiguration.git`
- Support des profils (dev, prod)

**Structure du dépôt de configuration:**
- `application.properties` - Propriétés globales
- `[ServiceName].properties` - Propriétés spécifiques au service
- `[ServiceName]-dev.properties` - Propriétés pour l'environnement de développement
- `[ServiceName]-prod.properties` - Propriétés pour l'environnement de production

**Refresh à chaud:**
- Ajouter `@RefreshScope` aux composants concernés
- Envoyer `POST /actuator/refresh` pour actualiser la configuration sans redémarrage

## 🚀 Ordre de Démarrage

Pour tester l'architecture en local, les services doivent être démarrés dans l'ordre suivant :

1. **DiscoveryService** (Eureka)
   ```bash
   cd DiscoveryService
   mvn spring-boot:run
   ```
   Vérifier : `http://localhost:8761`

2. **ConfigService**
   ```bash
   cd ConfigService
   mvn spring-boot:run
   ```
   Vérifier : `http://localhost:9999`

3. **Microservices Fonctionnels** (dans n'importe quel ordre)
   ```bash
   # Terminal 1
   cd CustomerService
   mvn spring-boot:run
   
   # Terminal 2
   cd InventoryService
   mvn spring-boot:run
   
   # Terminal 3
   cd BillingService
   mvn spring-boot:run
   ```

4. **GatewayService** (en dernier)
   ```bash
   cd GatewayService
   mvn spring-boot:run
   ```
   Vérifier : `http://localhost:8888`

## 📡 Endpoints Disponibles

### Via la Gateway (Point d'entrée unique)

Toutes les requêtes doivent passer par la Gateway sur le port **8888** :

- **Clients:**
  - `GET http://localhost:8888/api/customers` - Liste tous les clients
  - `GET http://localhost:8888/api/customers/{id}` - Récupère un client
  - `POST http://localhost:8888/api/customers` - Crée un client
  - `PUT http://localhost:8888/api/customers/{id}` - Met à jour un client
  - `DELETE http://localhost:8888/api/customers/{id}` - Supprime un client

- **Produits:**
  - `GET http://localhost:8888/api/products` - Liste tous les produits
  - `GET http://localhost:8888/api/products/{id}` - Récupère un produit
  - `POST http://localhost:8888/api/products` - Crée un produit
  - `PUT http://localhost:8888/api/products/{id}` - Met à jour un produit
  - `DELETE http://localhost:8888/api/products/{id}` - Supprime un produit

- **Factures:**
  - `GET http://localhost:8888/bills/{id}` - Récupère une facture avec enrichissement

### Accès Direct (pour tests)

- Customer-Service : `http://localhost:8081/api/customers`
- InventoryService : `http://localhost:8082/api/products`
- BillingService : `http://localhost:8083/bills/{id}`
- Eureka Dashboard : `http://localhost:8761`
- Config Server : `http://localhost:9999`

## 🔧 Configuration des Microservices

### Propriétés Communes (application.properties)

Chaque microservice utilise :
- `spring.config.import=optional:configserver:http://localhost:9999` - Connexion au Config Server
- `spring.cloud.discovery.enabled=true` - Activation d'Eureka Discovery
- `eureka.client.service-url.defaultZone=http://localhost:8761/eureka` - URL d'Eureka
- `eureka.instance.prefer-ip-address=true` - Utilisation de l'adresse IP

### Actuator

Les endpoints Actuator sont disponibles pour le monitoring :
- `GET /actuator/health` - État de santé du service
- `GET /actuator/info` - Informations sur le service
- `GET /actuator/beans` - Liste des beans Spring
- `GET /actuator/env` - Variables d'environnement
- `POST /actuator/refresh` - Actualise la configuration (nécessite `@RefreshScope`)

## 🎨 Client Angular

Le client Angular est disponible dans le dossier `frontend/` et implémente toutes les fonctionnalités requises :

### Fonctionnalités Implémentées

- **Gestion des Clients** (`/customers`)
  - Affichage de la liste des clients
  - Création d'un nouveau client
  - Modification d'un client existant
  - Suppression d'un client

- **Gestion des Produits** (`/products`)
  - Affichage de la liste des produits
  - Création d'un nouveau produit
  - Modification d'un produit existant
  - Suppression d'un produit

- **Consultation des Factures** (`/bills`)
  - Recherche d'une facture par ID
  - Affichage des détails complets avec enrichissement :
    - Informations client complètes
    - Liste des produits avec détails
    - Calcul automatique du total

### Installation et Démarrage

```bash
cd frontend
npm install
npm start
```

L'application sera accessible sur `http://localhost:4200`

**Note:** Toutes les requêtes sont envoyées vers la Gateway (port 8888) comme requis.

Pour plus de détails, consultez le [README du frontend](frontend/README.md).

## 📊 Modèle de Données

### Customer-Service
```
Customer {
  id: Long
  name: String
  email: String
}
```

### InventoryService
```
Product {
  id: Long
  name: String
  price: Float
  quantity: Integer
}
```

### BillingService
```
Bill {
  id: Long
  billingDate: Date
  customerId: Long (FK)
  customer: Customer (@Transient)
  productItems: List<ProductItem>
}

ProductItem {
  id: Long
  productId: String (FK)
  product: Product (@Transient)
  bill: Bill
  quantity: Integer
  unitPrice: Double
}
```

## 🔄 Communication Inter-Services

### Open Feign

BillingService utilise **Open Feign** pour communiquer avec les autres services :

- `CustomerRestClient` : Appelle Customer-Service pour récupérer les informations client
- `ProductRestClient` : Appelle InventoryService pour récupérer les informations produit

Lors de la consultation d'une facture, BillingService :
1. Récupère la facture depuis sa base de données
2. Appelle Customer-Service pour enrichir avec les données du client
3. Appelle InventoryService pour chaque ProductItem pour enrichir avec les données des produits

## 📝 Données de Test

### Customer-Service
Au démarrage, les clients suivants sont créés automatiquement :
- Mohamed (BoMo@gmail.com)
- Khadija (khadija@gmail.com)
- Imene (imene@gmail.com)

### InventoryService
Au démarrage, les produits suivants sont créés automatiquement :
- Laptop (100.00, quantité: 10)
- Tablet (5000.0, quantité: 500)
- Phone (2500.0, quantité: 1500)

### BillingService
Au démarrage, des factures sont générées automatiquement pour chaque client avec tous les produits disponibles.

## 🧪 Tests

Pour tester l'architecture complète :

1. Vérifier l'enregistrement des services dans Eureka : `http://localhost:8761`
2. Tester les endpoints via la Gateway : `http://localhost:8888/api/customers`
3. Consulter une facture enrichie : `http://localhost:8888/bills/1`
4. Vérifier les endpoints Actuator : `http://localhost:8081/actuator/health`

## 📚 Ressources et Documentation

- [Part 1 - Architecture Micro services avec Spring Cloud](https://www.youtube.com/watch?v=...)
- [Part 2 - Architecture Micro services avec Spring Cloud](https://www.youtube.com/watch?v=...)
- [Part 3 - Architecture Micro services avec Spring Cloud - Spring Cloud Config](https://www.youtube.com/watch?v=...)
- [Dépôt Git de Configuration](https://github.com/MohamedBOULAALAM/eCommerceApp_RepoConfiguration.git)

## 🔐 Sécurité

> **Note:** La sécurité (OAuth2/Keycloak) n'est pas implémentée dans cette version mais peut être ajoutée dans les étapes suivantes.

## 🐳 Conteneurisation

> **Note:** La conteneurisation avec Docker n'est pas implémentée dans cette version mais peut être ajoutée dans les étapes suivantes.

## 🔌 Tolérance aux Pannes

> **Note:** La gestion de la tolérance aux pannes (Circuit Breaker avec Resilience4j ou Hystrix) n'est pas implémentée dans cette version mais peut être ajoutée dans les étapes suivantes.

## 👥 Auteurs

- **Mohamed BOULAALAM**

## 📄 Licence

Ce projet est réalisé dans le cadre d'une activité pratique académique.

---

**Note:** Ce projet suit la méthodologie détaillée de développement d'une architecture microservices avec Spring Boot et Spring Cloud, conformément à l'Activité Pratique N°3.

