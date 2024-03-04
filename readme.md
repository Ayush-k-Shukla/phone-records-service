# Phone records Service

## Using Node.js + Sqlite (sequelize)

This Project provides users to register, login and search by name and phone-number

## Database Schema

### Users

```sh

User {
	name
	email
	phone
	password
}

```

### Contact

```sh

Contact {
	name
	phone
	userId -> link to the user
}

```

### Spam

```sh

Spam {
	phone
	userId -> link to the user
}

```

# API Documentation

## Authentication Routes

### 1. Register User

- **Endpoint:** `POST /register`
- **Description:** Registers a new user and returns auth token
- **Request Body:**
  - `name` (string): New user's name.
  - `password` (string): New user's password.
  - `phone` (string): New user's phone
  - `email` (string): New user's email

### 2. User Login

- **Endpoint:** `POST /login`
- **Description:** Logs in a user and returns an auth token.
- **Request Body:**
  - `phone` (string): User's phone.
  - `password` (string): User's password.

## Spam and Search Routes

### 3. Mark Phone as Spam

- **Endpoint:** `POST /mark-spam`
- **Description:** Marks phone as spam. (Requires auth)
- **Request Header:** `Authorization` (string): Bearer token.
- **Request Body:**
  - `phone` (string): Phone number

### 4. Search by Name

- **Endpoint:** `GET /search/name`
- **Description:** Searches phone number by name. (Requires auth)
- **Request Header:** `Authorization` (string): Bearer token.
- **Query Parameter:** `name` (string): Name to search.

### 5. Search by Phone

- **Endpoint:** `GET /search/phone`
- **Description:** Searches by phone number. (Requires auth)
- **Request Header:** `Authorization` (string): Bearer token.
- **Query Parameter:** `phone` (string): Phone number to search.

### 6. Get user details by Phone

- **Endpoint:** `GET /search/:phone`
- **Description:** Searches by phone. (Requires auth)
- **Request Header:** `Authorization` (string): Bearer token.

### Authentication Middleware

All routes under **Spam and Search** require authentication. Include the `Authorization` header with a valid bearer token.

---

## Running the project

    ``$ npm install``

    ``$ npm run dev``

## Testing With Postman

Download `Phone records.postman_collection.json` file and import it

variables will be auto populated.
