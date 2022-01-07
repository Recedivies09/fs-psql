const router = require("express").Router();
const { Blog, User } = require("../models/index");
const { Op } = require("sequelize");
const { tokenExtractor } = require("../utils/middleware");

router.get("/", async (req, res, next) => {
  const where = {};
  if (req.query.search) {
    where[Op.or] = [];
    where[Op.or].push({
      title: {
        [Op.iLike]: req.query.search + "%",
      },
    });
    where[Op.or].push({
      author: {
        [Op.iLike]: req.query.search + "%",
      },
    });
  }
  try {
    const blogs = await Blog.findAll({
      attributes: {
        exclude: ["userId"],
      },
      include: {
        model: User,
        attributes: ["name"],
      },
      where,
      order: [["likes", "DESC"]],
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  const body = req.body;
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...body, userId: user.id });
    return res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, error) => {
  const id = req.params.id;
  const blog = await Blog.findByPk(id);
  if (blog) {
    blog.likes++;
    await blog.save();
    return res.status(204).end();
  }
  next(error);
});

router.delete("/:id", tokenExtractor, async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.findByPk(id);
    if (user.id === blog.userId) {
      await Blog.destroy({
        where: { id },
      });
      return res.status(204).end();
    }
    return res.status(400).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
