var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index")
})



router.get("/header", (req, res) => {
  res.render("header")
});
module.exports = router;
