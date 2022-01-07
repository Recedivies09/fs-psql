const router = require("express").Router();
const { Blog } = require("../models/index");
const sequelize = require("sequelize");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("author")), "articles"],
      [sequelize.fn("sum", sequelize.col("likes")), "likes"],
    ],
    group: "author",
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
  });
  res.json(blogs);
});

module.exports = router;
