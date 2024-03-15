const express = require("express");
const app = express();

require("dotenv").config();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("./auth", require("./auth"));
app.get("/protected", (req, res) => {
  if (!res.locals.user) {
    next({
      status: 401,
      message: "You are not allowed to access this information.",
    });
  }
  res.json(`Here is some private user information. Your username: ${res.locals.user.username}. Your id: #${res.locals.user.id}.`);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/reviews", require("./prisma/reviews.js"));

app.use((err, req, res, next) => {
  const status = err?.status ?? 500;
  const message = err?.message ?? "Internal server error.";
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log("Listening on port ${PORT}.");
});
