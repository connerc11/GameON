# GameOn Backend

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file (already provided) and set your MongoDB URI and JWT secret.
3. Start MongoDB locally or use a cloud MongoDB service.
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register a new user. `{ username, password }`
- `POST /api/auth/signin` — Login. `{ username, password }` (returns JWT)

### Scores
- `POST /api/scores` — Save a score. `{ game, score }` (JWT required)
- `GET /api/scores/:game` — Get leaderboard for a game
