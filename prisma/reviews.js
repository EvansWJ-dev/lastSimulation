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
    const id = +req.params.id;
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return next({
        status: 404,
        message: "Review #${id} doesn't exist.",
      });
    }

    res.json(review);
  } catch {
    next({
      message: "The server failed to reach the database.",
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, product } = req.body;
    const review = await prisma.review.create({
      data: {
        name,
        product,
      },
    });

    res.status(201).json(review);
  } catch {
    next({
      message: "The server failed to reach the database.",
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return next({
        status: 404,
        message: "Review #${id} doesn't exist.",
      });
    }

    await prisma.review.delete({
      where: { id },
    });

    res.sendStatus(204);
  } catch {}
});
