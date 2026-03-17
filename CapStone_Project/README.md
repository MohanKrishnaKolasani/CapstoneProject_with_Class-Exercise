# Music Library — Capstone Project

This is my capstone project for the Full Stack Programming course at Great Learning. I built a music library web application using the MERN stack where users can browse songs, create playlists, and play music, while admins can manage the entire content library.

---

## What the App Does

There are two types of users in this application.

**Regular users** can register and log in, browse all available songs, search by song name, artist, album, or music director, view song details, create and manage their own playlists, add or remove songs from playlists, play songs with a built-in audio player with prev/next controls, and explore the library organized by albums, artists, and directors.

**Admins** can log in to a dedicated dashboard, add, edit, delete, and hide songs from users, manage artists, music directors, and albums including uploading photos and cover images, manage registered users, and send notifications when new songs are added.

---

## Tech Stack

- **Frontend** — React 19, React Router v7, Bootstrap 5
- **Backend** — Node.js, Express 5, MongoDB, Mongoose
- **Authentication** — JWT stored in localStorage
- **File Uploads** — Multer (songs, cover images, profile pictures)
- **Testing** — Jest + React Testing Library (unit & component), Cypress (end-to-end)

---

## Getting Started

You need Node.js (v18 or above) and MongoDB installed before running this project.

### 1. Clone the repository

```bash
git clone https://github.com/MohanKrishnaKolasani/Music_Library.git
cd Music_Library
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open the `.env` file and fill in your MongoDB connection string and a JWT secret key.

```bash
npm start
```

The backend runs on `http://localhost:5000`. The upload folders are created automatically on first start so you don't need to create them manually.

### 3. Seed the database (optional but recommended)

```bash
node seedRoles.js    # creates the admin and user roles
node seedData.js     # adds sample songs, artists, and albums
```

### 4. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`.

---

## Default Login Credentials

After seeding, you can log in with these accounts:

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@musiclibrary.com | Admin@1234 |
| User  | testuser@music.com | test123 |

---

## Running the Tests

### Unit and Component Tests (Jest)

```bash
cd frontend
npm test -- --watchAll=false
```

This runs 19 test suites covering validation logic, custom hooks, React components, and all service functions.

### End-to-End Tests (Cypress)

Make sure both the backend and frontend servers are running first, then:

```bash
cd frontend
npm run cy:open    # opens the interactive Cypress test runner
# or
x     # runs all tests headlessly in the terminal
```

The Cypress tests cover login, registration, the songs page, and playlist management.

---

## Project Structure

```
KolasaniMohanKrishna_Capstone_Project/
│
├── backend/
│   ├── models/        — Mongoose schemas (User, Song, Playlist, Album, Artist, etc.)
│   ├── routes/        — Express route handlers
│   ├── services/      — Business logic layer
│   ├── middleware/    — JWT auth and file upload (Multer)
│   ├── test/          — Backend tests (Mocha + Chai + Supertest)
│   └── server.js      — Entry point
│
└── frontend/
    ├── src/
    │   ├── pages/         — Login, Register, Songs, Playlists, Admin pages
    │   ├── components/    — Reusable UI components
    │   ├── hooks/         — Custom React hooks
    │   ├── context/       — Auth and Player context providers
    │   ├── services/      — Axios API calls
    │   ├── __tests__/     — Jest test files
    │   └── __mocks__/     — Manual mocks for axios and react-router-dom
    └── cypress/           — End-to-end test files
```

---

## Notes

- The `uploads/` folder in the backend is not included in the repository because it contains user-uploaded files. It is created automatically when the server starts.
- The `.env` file is not included for security reasons. Use `.env.example` as a template.
- All ESLint warnings have been resolved and the project compiles cleanly.