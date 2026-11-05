# Hotel Booking System — Architecture

## 1. Architecture overview

The project uses a three-layer client-server architecture.

```text
Customer / Staff / Admin
          |
          v
Frontend (React / HTML / CSS / JavaScript)
          |
          | HTTPS + JSON REST API
          v
Backend (Node.js + Express)
  |       |         |
  |       |         +--> Security middleware
  |       |              - JWT authentication
  |       |              - Role-based authorization
  |       |              - Rate limiting
  |       |              - Helmet security headers
  |       |
  |       +------------> Business logic
  |                      - Room search
  |                      - Booking management
  |                      - User accounts
  |
  v
PostgreSQL Database
  - Users
  - Rooms
  - Bookings
```

## 2. Main components

| Component | Responsibility |
|---|---|
| Frontend | Displays rooms, forms, and booking status |
| REST API | Receives and validates client requests |
| Authentication | Verifies user identity using JWT |
| Authorization | Restricts admin/staff actions by role |
| Business logic | Applies booking rules |
| PostgreSQL | Persists users, rooms, and reservations |

## 3. Main data flow

1. The customer opens the website and requests available rooms.
2. The frontend sends a request to the backend API.
3. The backend reads room data from PostgreSQL.
4. The frontend displays the room list.
5. The customer submits a booking request.
6. The backend validates the request and checks booking rules.
7. PostgreSQL stores the booking and prevents overlapping reservations.
8. The backend returns success or an error to the frontend.

## 4. Design decisions

- Separate frontend, backend, and database responsibilities.
- Use REST endpoints with JSON for communication.
- Keep database credentials in environment variables.
- Use parameterized SQL queries to reduce SQL injection risk.
- Use JWT for API authentication and roles for authorization.
- Keep the backend as a modular monolith for a manageable university project.

## 5. Deployment view

For the project demonstration, the frontend, API, and PostgreSQL can run locally on separate ports/services. In production, use HTTPS, managed secrets, database backups, restricted database network access, and centralized logging.
