# Documentation API

## Informations générales
- Base URL : `http://ton-app.test/api`
- Format des requêtes : JSON
- Authentification : Bearer Token (obtenu via `/login`)
- Headers obligatoires :
  - `Accept: application/json`
  - `Authorization: Bearer <token>` (pour les routes protégées)

---

## 1. Obtenir tous les utilisateurs

**URL** : `/alluser`  
**Méthode** : GET  
**Headers** :
    Accept: application/json
    Authorization: Bearer <token>

**reponse** : `/alluser` 
[
  {"id":1,"name":"Faniry","email":"faniry@example.com"},
  {"id":2,"name":"Navalona","email":"navalona@example.com"}
]
## 2. Obtenir tous les Obtenir tous les utilisateurs

**URL** : `/alluser`  
**Méthode** : GET  
**Headers** :
    Accept: application/json
    Authorization: Bearer <token>

**reponse** : `/alluser` 
[
  {"id":1,"name":"Faniry","email":"faniry@example.com"},
  {"id":2,"name":"Navalona","email":"navalona@example.com"}
]
## 3. S’inscrire

**URL** : `/register`  
**Méthode** : POST  
**Headers** :
    Accept: application/json

**reponse** : `/register` 
[
  {"id":1,"name":"Faniry","email":"faniry@example.com"},
  {"id":2,"name":"Navalona","email":"navalona@example.com"}
]

# Documentation premier deployement

php artisan db:seed --class=AdminSeeder

'firstName' => 'Admin'
'password' => 12345678
