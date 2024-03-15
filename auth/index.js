const prisma = require("../prisma");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const router = require("express").Router();
module.exports = router;

router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; //"Bearer <token>"
  if (!authHeader || !token) {
    return next();
  }
  try {
    const { id } = jwt.verify(token);
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    res.locals.user = user;
    next();
  } catch (e) {
    next({
      status: 401,
      message: "Invalid token.",
    });
  }
});

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });
    if (userExists) {
      return next({
        status: 400,
        message: `User ${username} already exists. Please log in, instead.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return next({
        status: 400,
        message: `User ${username} doesn't exist. Please register an account.`,
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return next({
        status: 401,
        message: "Invalid password. Please, try again.",
      });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});
