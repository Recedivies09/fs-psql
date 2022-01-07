const router = require("express").Router();
const { User, Blog, ReadingList } = require("../models/index");
const { tokenExtractor } = require("../utils/middleware");

router.post("/", async (req, res, next) => {
  const body = req.body;
  const blog_id = body.blog_id;
  const user_id = body.user_id;
  if (!blog_id || !user_id) {
    return res.status(400).end();
  }
  const blog = await Blog.findByPk(blog_id);
  const user = await User.findByPk(user_id);
  if (!blog && !user) {
    return res.status(400).end();
  }
  try {
    const createdBlog = await ReadingList.create({
      userId: user_id,
      blogId: blog_id,
    });
    return res.json(createdBlog);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  const id = req.params.id;
  const body = req.body.read;
  try {
    const readingList = await ReadingList.findByPk(id);
    readingList.read = body;
    await readingList.save();
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});
module.exports = router;
