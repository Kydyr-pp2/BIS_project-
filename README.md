# Hotel Booking System — Security & Architecture

This is a companion module for the teammate responsible for **Security and System Architecture**.

## Included
- Three-layer architecture documentation and data-flow diagram
- Security plan and threat/control table
- Password hashing with bcrypt
- JWT login and authentication middleware
- Role-based access example (`customer`, `staff`, `admin`)
- Helmet security headers
- API and login rate limiting
- PostgreSQL security schema update

## Setup

1. Use the same PostgreSQL database (`hotel_booking`) as the database module.
2. Run `database/security-schema.sql` against that database.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env`, then set your PostgreSQL password and a long random `JWT_SECRET` (at least 32 characters).
5. Start the API:

   ```bash
   npm start
   ```

6. Test `GET http://localhost:3001/api/health`.

## API examples

Register:
`POST /api/auth/register`

```json
{
  "name": "Demo Customer",
  "email": "demo@example.com",
  "password": "StrongPass123"
}
```

Login:
`POST /api/auth/login`

```json
{
  "email": "demo@example.com",
  "password": "StrongPass123"
}
```

Use the returned token in protected requests:

```text
Authorization: Bearer YOUR_TOKEN
```

Protected examples:
- `GET /api/profile` — any authenticated user
- `GET /api/admin/overview` — admin role only

## Important integration note

This module is a security/architecture starter. The database module may already run an API on port 3000; this module uses port 3001 for demonstration. For the final team project, merge the middleware and auth routes into the team's agreed backend rather than running two competing APIs. Also add booking ownership checks and request validation before presenting it as production-ready.
