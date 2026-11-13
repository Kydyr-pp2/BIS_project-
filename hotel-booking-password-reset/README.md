# Hotel Booking System — Password Reset

Starter module: Node.js + Express + PostgreSQL + bcrypt + Nodemailer.

## Structure
- `database/reset-password.sql` — adds reset-token columns to existing users table.
- `src/db.js` — PostgreSQL connection.
- `src/routes/passwordReset.js` — forgot-password and reset-password endpoints.
- `src/server.example.js` — standalone example server; integrate the route into your existing server instead if you already have one.
- `frontend/` — browser request examples, not complete React/Angular pages.
- `.env.example` — configuration template.

## Assumptions
Your existing `users` table has `id`, `email`, and `password_hash`. If your password column has another name, update the SQL in `passwordReset.js`.

## Setup
1. Copy `.env.example` to `.env` and fill in your PostgreSQL and SMTP credentials.
2. Install dependencies: `npm install`.
3. Run the migration against your existing database:
   `psql "$DATABASE_URL" -f database/reset-password.sql`
4. Integrate into your existing Express app:
   ```js
   const passwordResetRoutes = require("./routes/passwordReset");
   app.use(express.json());
   app.use("/api/auth", passwordResetRoutes);
   ```
5. For standalone testing, run `npm start`.

## API
`POST /api/auth/forgot-password`
```json
{"email":"user@example.com"}
```

`POST /api/auth/reset-password`
```json
{"token":"token-from-email-link","newPassword":"new-secure-password"}
```

The token is random, stored as a SHA-256 hash, expires in 15 minutes, and is consumed after one successful password update. The API returns a generic response for forgot-password requests to reduce account enumeration.

## Gmail
Enable 2-Step Verification and create a Google App Password. Put that value in `SMTP_PASS`, not your normal Gmail password. Never commit `.env`.

## Before production
Add rate limiting, use HTTPS, keep tokens out of logs/analytics, configure CORS and trusted frontend URLs, and consider revoking existing sessions/JWTs after password changes. Use the same password hashing policy as your registration/login code. The standalone server is an example and should not replace your existing server.
