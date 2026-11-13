require("dotenv").config();
const express = require("express");
const passwordResetRoutes = require("./routes/passwordReset");

const app = express();
app.use(express.json({ limit: "10kb" }));
// Add rate limiting to these endpoints before production deployment.
app.use("/api/auth", passwordResetRoutes);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API listening on port ${port}`));
