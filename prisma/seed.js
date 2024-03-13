const prisma = require("../prisma"); //this is tantamount to ../prisma/index.js

const seed = async () => {
  for (let i = 1; i <= 10; i++) {
    await prisma.review.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Review ${i}`,
        product: `Product ${i % 3}`, //create some reviews of the same product
      },
    });
  }
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch();
