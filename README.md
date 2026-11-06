# SunnyCourts Club - Court Booking System

> **Backend Development Fundamentals (BDF)** | Theme 7 of 30: Court Booking | Group ST-CSE2D-G07

## Client Brief
> *"Players book courts on a whiteboard. Names get rubbed out and the 6 pm slot always starts a fight. Please build us a system that fixes this."*

---

## Team Members & Responsibilities (4 Members)

| Branch | Team Member | Email | Responsibility |
|---|---|---|---|
| `feature/server-routes` | **P Shalini** | `pasupuletishalini19@gmail.com` | Express server setup, middleware, and modular routes |
| `feature/database` | **P Rohan** | `rohan9uchiha@gmail.com` | SQLite database connection, schema (`schema.sql`), and seed data (`seed.sql`) |
| `feature/rest-endpoints` | **R Sathyanarayana** | `sathyanarayanarao2020@gmail.com` | CRUD endpoints for courts, players, reservations, and the JOIN endpoint |
| `feature/validation-twist` | **K Puneeth Sai** | `puneethsaik25@gmail.com` | Input validation on add/update, sport query search, and the "Three at a time" reservation limit twist |
| `main` | **All Members** | — | Final integrated project, documentation, and Postman collection |

---

## The Twist Rule: "Three at a time"
- **Rule**: A player can hold at most **3 active reservations**.
- **4th Attempt**: Returns HTTP status **`409 Conflict`** with response body:
  ```json
  {
    "message": "Limit of 3 reached"
  }
  ```
- **Frees a Place**: Cancelling/returning any active reservation frees up a slot, enabling the player to make another reservation (`201 Created`).

---

## Project Structure
```
sunnycourts-booking-system/
│
├── src/
│   ├── config/
│   │   └── database.js              # SQLite connection & initialization
│   ├── controllers/
│   │   ├── courtController.js       # Court CRUD & sport filter
│   │   ├── playerController.js      # Player CRUD
│   │   └── reservationController.js # Reservation CRUD & JOIN endpoint
│   ├── middleware/
│   │   └── validation.js            # Input validation & Twist logic
│   ├── routes/
│   │   ├── courtRoutes.js           # /api/courts routes
│   │   ├── playerRoutes.js          # /api/players routes
│   │   └── reservationRoutes.js     # /api/reservations routes
│   └── server.js                    # Express application entrypoint
│
├── database/
│   ├── schema.sql                   # Tables: players, courts, reservations
│   └── seed.sql                     # Seed records (Asha, courts, sample bookings)
│
├── tests/
│   └── twist-tests.md               # Step-by-step verification of Twist Tests 1-3
│
├── postman/
│   └── sunnycourts-collection.json  # Complete Postman Collection
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/snr2005/sunnycourts-booking-system-LG07.git
cd sunnycourts-booking-system-LG07
npm install
```

### 2. Database Initialization
The database initializes automatically when running the application. To manually reset or seed:
```bash
npm run seed
```

### 3. Run the Server
- Development mode (with auto-reload):
  ```bash
  npm run dev
  ```
- Production / Normal mode:
  ```bash
  npm start
  ```
The API is available at: `http://localhost:3000`

---

## Postman Collection

Import `postman/sunnycourts-collection.json` into Postman.
- Environment variable `baseUrl` is pre-configured to `http://localhost:3000`.
- The collection contains pre-configured requests for:
  - **Courts**: Get all, search by sport, get one, create, update, delete.
  - **Players**: Get all, get one, create.
  - **Reservations & JOIN**: Get all, get details with player and court names, get one.
  - **Twist Tests**: Complete automated flow for Test 1, Test 2, and Test 3.

---

## API Endpoints Reference

### 1. Courts (`/api/courts`)
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/courts` | Get all courts (supports `?sport=<sport>` query param) | `200 OK` |
| `GET` | `/api/courts/:id` | Get court by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/courts` | Add a new court (body: `name`, `sport`) | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/courts/:id` | Update court by ID (body: `name`, `sport`) | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/courts/:id` | Delete court by ID | `200 OK` / `404 Not Found` |

### 2. Players (`/api/players`)
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/players` | Get all registered players | `200 OK` |
| `GET` | `/api/players/:id` | Get player by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/players` | Register a new player (body: `name`, `email`) | `201 Created` / `400 Bad Request` |

### 3. Reservations & JOIN Endpoint (`/api/reservations`)
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/reservations` | Get all reservations | `200 OK` |
| `GET` | `/api/reservations/details` | **JOIN Endpoint**: reservations with player name and court name | `200 OK` |
| `GET` | `/api/reservations/:id` | Get reservation by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/reservations` | Create reservation (body: `player_id`, `court_id`, `slot_time`) | `201 Created` / `400` / `404` / `409 Conflict` |
| `DELETE` | `/api/reservations/:id` | Return/Cancel reservation (frees up player slot) | `200 OK` / `404 Not Found` |

---

## Testing the Twist Rule ("Three at a time")

Refer to [`tests/twist-tests.md`](./tests/twist-tests.md) for full test run documentation.

- **Test 1**: Create 3 reservations for Asha (`player_id: 1`):
  - Request 1: `POST /api/reservations` $\rightarrow$ `201 Created`
  - Request 2: `POST /api/reservations` $\rightarrow$ `201 Created`
  - Request 3: `POST /api/reservations` $\rightarrow$ `201 Created`
- **Test 2**: Create a 4th reservation for Asha:
  - Request 4: `POST /api/reservations` $\rightarrow$ `409 Conflict` with `{"message": "Limit of 3 reached"}`
- **Test 3**: Return one reservation, then create a new one:
  - Request 5: `DELETE /api/reservations/<id>` $\rightarrow$ `200 OK` (frees place)
  - Request 6: `POST /api/reservations` $\rightarrow$ `201 Created`
