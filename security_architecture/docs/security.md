# Hotel Booking System — Security Plan

## Security controls

| Threat | Protection |
|---|---|
| Plain-text password exposure | Hash passwords with bcrypt |
| Unauthorized API access | JWT authentication |
| Customer accessing admin functions | Role-based access control |
| SQL injection | Parameterized SQL queries |
| Excessive requests / brute force | API and login rate limits |
| Common browser-based attacks | Helmet security headers |
| Oversized request payloads | JSON body size limit |
| Accidental credential leaks | `.env` excluded from Git |

## Roles

- `customer`: can manage their own bookings (ownership checks must be added to booking endpoints).
- `staff`: intended for authorized hotel staff workflows.
- `admin`: can access administrative endpoints.

## Important implementation notes

- Registration always creates a `customer`; never accept a role from public registration input.
- Keep `JWT_SECRET` private and use a strong random value.
- Use HTTPS outside local development.
- Add ownership checks before allowing users to view, update, or cancel a booking.
- Validate every request body and query parameter.
- Do not return password hashes or secrets in API responses.
- Back up the database and restrict database access to the backend service.

This is a starter security implementation for a student project, not a complete production security audit.
