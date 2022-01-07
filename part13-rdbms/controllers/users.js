const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res, next) => {
  const where = {};
  if (req.query.read) {
    where.read = req.query.read === "true";
  }

  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          as: "readings",
          nested: true,
          attributes: {
            exclude: ["userId", "createdAt", "updatedAt"],
          },
          through: {
            attributes: ["id", "read"],
            where,
          },
        },
      ],
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
    });
    return res.json(user);
  } catch (error) {
    next(error);
  }
  return res.status(400).end();
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:username", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    user.username = body.username;
    await user.save();
    return res.json(user);
  }
  res.status(400).end();
});

module.exports = router;
