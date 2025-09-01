# NOLIMIT Server (Node.js)

Express + MongoDB backend for the NOLIMIT storefront. This API powers the React + Vite frontend and exposes simple endpoints for newsletter subscriptions and a minimal cart.

## Backend repositories

This project is one of two interchangeable backends for the frontend. Choose the backend based on the branch in the frontend project:

- Master branch (Node.js backend)
  - Backend repository: https://github.com/KovinthKrishna/NOLIMIT_Server
- spring-boot branch (Spring Boot backend)
  - Backend repository: https://github.com/KovinthKrishna/NolimitServer

Notes:
- Both backends should expose the same REST API contract (see API section).
- The frontend should point to the chosen backend via its VITE_URL setting.

---

## Environment variables (.env)

Create a `.env` file in this repository root. The server uses dotenv to load variables.

- URL
  - Description: MongoDB connection string used by Mongoose.
  - Default when not set: `mongodb://localhost:27017/nolimit`
  - Example values:
    - Local MongoDB: `mongodb://localhost:27017/nolimit`
    - MongoDB Atlas: `mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority&appName=<app>`

- WEBSITE_URL
  - Description: Allowed origin for CORS when `URL` is set (i.e., when you explicitly configure the DB connection string). If `URL` is NOT set, CORS will default to `"*"` (allow all).
  - Default when not set:
    - If `URL` is not set: origin will be `"*"`
    - If `URL` is set: origin will be `undefined` (not recommended). Set `WEBSITE_URL` to your frontend origin to enable CORS.
  - Example values:
    - Local frontend (Vite): `http://localhost:5173`
    - Production site: `https://your-frontend.example.com`

Important behavior from code:
- Database connection: `mongoose.connect(process.env.URL ?? "mongodb://localhost:27017/nolimit")`
- CORS origin: `origin: process.env.URL ? process.env.WEBSITE_URL : "*"`

Example `.env` (local development with explicit values):
```
# MongoDB (explicitly set; otherwise defaults to local)
URL=mongodb://localhost:27017/nolimit

# Frontend origin for CORS when URL is set
WEBSITE_URL=http://localhost:5173
```

If you omit `.env` entirely:
- DB will default to `mongodb://localhost:27017/nolimit`
- CORS will allow all origins (`*`)
- Server runs on port 3000 (hardcoded)

---

## Getting started

Prerequisites:
- Node.js 18+ recommended (mongodb driver requires >= 16.20.1)
- MongoDB running locally or a MongoDB Atlas cluster

Install dependencies:
```
npm install
```

Run the server (with auto-reload via nodemon):
```
npm start
```

Alternatively (no nodemon):
```
node index.js
```

The server listens on:
- Port: 3000 (hardcoded in `index.js`)
- Health check: `GET /` → returns `"Server is running"`

---

## API reference

Base URL: `http://localhost:3000` (or your deployed host)

- GET `/`
  - Returns `"Server is running"` for basic health checks.

- POST `/add/users`
  - Description: Subscribe a user by email.
  - Body: `{ "email": "user@example.com" }`
  - Responses: `"Subscribed"` or error JSON.

- GET `/fetch/items`
  - Description: Fetch all cart items.
  - Response: Array of items: `[{ _id, id, count }, ...]`

- POST `/add/items`
  - Description: Add an item to the cart. Prevents duplicates by `id`.
  - Body: `{ "id": number, "count": number }`
  - Responses: `"Item added successfully."` or `"Already in cart!"` or error JSON.

- PUT `/update/items/:id`
  - Description: Update an item’s count by Mongo `_id`.
  - Body: `{ "count": number }`
  - Responses: `"Item updated successfully."` or error JSON.

- DELETE `/delete/items/:id`
  - Description: Delete an item by Mongo `_id`.
  - Responses: `"Item deleted successfully."` or error JSON.

Data models (Mongoose):
- `users`: `{ email: String }`
- `items`: `{ id: Number, count: Number }`

CORS:
- If `URL` (Mongo connection string) is set, allowed origin is `WEBSITE_URL`.
- If `URL` is not set, allowed origin is `"*"`.

---

## Project structure

```
.
├─ index.js               # Express app, Mongo connection, routes
├─ models
│  ├─ Items.js            # Mongoose model for cart items
│  └─ Users.js            # Mongoose model for subscribers
├─ package.json
├─ package-lock.json
└─ .env                   # Not committed; see Environment variables
```

---

## Technologies used

- Node.js
- Express 4
- Mongoose 8 (MongoDB driver 6)
- CORS
- dotenv
- nodemon (development)

---

## Pairing with the frontend

Frontend repository:
- https://github.com/KovinthKrishna/NOLIMIT

Frontend setup:
- Set `VITE_URL` in the frontend to this server’s base URL.
  - Default in frontend (if not set) is `http://localhost:3000`
  - Example: `VITE_URL=http://localhost:3000` for local dev

Branch mapping:
- frontend `master` → Node.js backend (this repository)
- frontend `spring-boot` → Spring Boot backend (https://github.com/KovinthKrishna/NolimitServer)

---

## Notes

- The server port is currently hardcoded to `3000`. To make it configurable, update `index.js` to read `process.env.PORT` with a fallback.
- When deploying with a managed MongoDB (e.g., Atlas), always set both `URL` and `WEBSITE_URL` to ensure proper CORS behavior.
- Models are intentionally minimal for demo purposes.
