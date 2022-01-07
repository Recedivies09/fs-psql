const router = require("express").Router();

router.delete("/", async (req, res) => {
  return res.status(400).end();
});

module.exports = router;
