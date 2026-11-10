# Twist Validation Tests: Three at a Time

## Requirement Overview
- **Rule**: A player can hold at most **3 active reservations**.
- The 4th attempt gets HTTP **409 Conflict** and the exact message: `"Limit of 3 reached"`.
- Returning / deleting / cancelling one reservation frees a place, allowing a new reservation to succeed with **201 Created**.

---

## Test Scenarios & Results

### Player Under Test
- **Player**: Asha (ID: `1`, Email: `asha@sunnycourts.club`)
- **Initial State**: 0 active reservations for Asha.

---

### Test 1: Create 3 reservations for Asha $\rightarrow$ `201, 201, 201`
- **Request 1.1**: `POST /api/reservations`
  - Payload: `{"player_id": 1, "court_id": 1, "slot_time": "2026-11-06 09:00"}`
  - **Expected Status**: `201 Created`
  - **Actual Status**: `201 Created`
  - **Result**: Reservation ID generated.

- **Request 1.2**: `POST /api/reservations`
  - Payload: `{"player_id": 1, "court_id": 2, "slot_time": "2026-11-06 10:00"}`
  - **Expected Status**: `201 Created`
  - **Actual Status**: `201 Created`
  - **Result**: Reservation ID generated.

- **Request 1.3**: `POST /api/reservations`
  - Payload: `{"player_id": 1, "court_id": 3, "slot_time": "2026-11-06 11:00"}`
  - **Expected Status**: `201 Created`
  - **Actual Status**: `201 Created`
  - **Result**: Reservation ID generated. Asha now holds 3 active reservations.

---

### Test 2: Create a 4th reservation for Asha $\rightarrow$ `409 Conflict`
- **Request 2.1**: `POST /api/reservations`
  - Payload: `{"player_id": 1, "court_id": 4, "slot_time": "2026-11-06 12:00"}`
  - **Expected Status**: `409 Conflict`
  - **Expected Body**: `{"message": "Limit of 3 reached"}`
  - **Actual Status**: `409 Conflict`
  - **Actual Body**: `{"message": "Limit of 3 reached"}`
  - **Result**: PASSED. 4th attempt blocked accurately according to the twist rule.

---

### Test 3: Return one reservation, then create a new one $\rightarrow$ `200 OK`, `201 Created`
- **Request 3.1 (Return/Cancel one)**: `DELETE /api/reservations/<reservation_id>`
  - Action: Asha cancels/frees one of her earlier reservations.
  - **Expected Status**: `200 OK`
  - **Actual Status**: `200 OK`
  - **Result**: Active count drops from 3 to 2.

- **Request 3.2 (Create new)**: `POST /api/reservations`
  - Payload: `{"player_id": 1, "court_id": 4, "slot_time": "2026-11-06 14:00"}`
  - **Expected Status**: `201 Created`
  - **Actual Status**: `201 Created`
  - **Result**: PASSED. Place was freed and new reservation created successfully.

---

## Query Search & Validation Checks

- **Search by query parameter**:
  - `GET /api/courts?sport=Tennis` $\rightarrow$ Returns only tennis courts (`Court 1`, `Court 2`, `Court 3`).
  - `GET /api/courts?sport=Squash` $\rightarrow$ Returns only squash courts (`Court 4`).
- **Input Validation**:
  - `POST /api/courts` with missing `name` or `sport` $\rightarrow$ Returns `400 Bad Request` with clear error message.
  - `POST /api/reservations` with nonexistent player or court $\rightarrow$ Returns `404 Not Found`.
