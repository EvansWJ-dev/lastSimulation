const prisma = require("./prisma");
const router = require("express").Router();
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (e) {
    console.error(e);
    next({
      message: "The server failed to reach the database.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
  } catch {
    next({
      message: "The server failed to reach the database.",
    });
  }
});
