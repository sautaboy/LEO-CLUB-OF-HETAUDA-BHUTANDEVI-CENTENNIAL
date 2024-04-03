var express = require('express');
var router = express.Router();

var userModel = require("../Models/user")
var activityModel = require("../Models/activities")

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index")
})


// creating user
router.post("/newMember", async (req, res) => {
  try {
    const { name, address, age, email, number } = req.body;
    const user = await userModel.create({
      name: name,
      email: email,
      address: address,
      age: age,
      number: number
    });
    console.log(user);
    res.redirect("/join");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create new member" });
  }
});

























router.get("/join", (req, res) => {
  res.render("join")
})
router.get("/aboutus", (req, res) => {
  res.render("aboutus")
})

router.get("/donate", (req, res) => {
  res.render("donate")
})

router.get("/members", (req, res) => {
  res.render("members")
})

module.exports = router;
