var express = require('express');
var router = express.Router();
var multer = require('multer');
require("dotenv").config();
const nodemailer = require('nodemailer');
const moment = require('moment');

var userModel = require("../Models/user");
const Activity = require('../Models/activities');
const Admin = require('../Models/admin');
const messageModel = require('../Models/messages');





// FOR SECURITY
function security() {
  // security
  const bcrypt = require('bcryptjs');
  const session = require('express-session');
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;


  // all about admin
  router.use(express.urlencoded({ extended: false }));
  router.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
  }));
  router.use(passport.initialize());
  router.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, admin);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await Admin.findById(id);
      done(null, admin);
    } catch (err) {
      done(err);
    }
  });


  // Middleware to ensure the admin is authenticated
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }



  // Route to create an admin (one-time setup)
  // Create-admin route
  router.get('/create-admin', async (req, res) => {
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.send('Admin already exists.');
    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Create Admin</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f0f0f0;
        }
        .form-container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 300px;
          text-align: center;
        }
        .form-container h2 {
          margin-bottom: 20px;
        }
        .form-input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }
        .form-btn {
          width: 100%;
          padding: 10px;
          background: #007bff;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .form-btn:hover {
          background: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <h2>Create Admin</h2>
        <form method="post" action="/create-admin">
          <input type="text" name="username" class="form-input" placeholder="Username" required />
          <input type="password" name="password" class="form-input" placeholder="Password" required />
          <button type="submit" class="form-btn">Create Admin</button>
        </form>
      </div>
    </body>
    </html>
  `);
  });


  // Create-admin route
  router.post('/create-admin', async (req, res) => {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.send('<div class="message">Admin already exists.</div>');
    }

    const admin = new Admin({ username, password });
    await admin.save();
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Created</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f0f0f0;
        }
        .message-container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .message {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .login-link {
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .login-link:hover {
          color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="message-container">
        <div class="message">Admin created successfully.</div>
        <p>You can now <a href="/login" class="login-link">login</a>.</p>
      </div>
    </body>
    </html>
  `);
  });

  // Login route
  router.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Login</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background: #000;
          color:#fff;
        }
        .login-container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 300px;
          text-align: center;
           background: #111;
        }
        .login-container h2 {
          margin-bottom: 20px;
        }
        .form-input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
          background: #000;
           outline: none;
          border: none;
          color:#fff;

        }
        .form-btn {
          width: 100%;
          padding: 10px;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
            background: hsl(348, 60%, 40%);
        }
        .form-btn:hover {
 background: hsl(348, 60%, 30%);
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h2>Admin Login</h2>
        <form method="post" action="/login">
          <input type="text" name="username" class="form-input" placeholder="Username" required />
          <input type="password" name="password" class="form-input" placeholder="Password" required />
          <button type="submit" class="form-btn">Login</button>
        </form>
      </div>
    </body>
    </html>
  `);
  });

  // login
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));


  // Logout route
  router.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  router.post('/admin-update', ensureAuthenticated, async (req, res) => {
    const { username, password } = req.body;

    try {
      const admin = await Admin.findById(req.user._id);

      if (username) {
        admin.username = username;
      }

      if (password) {
        admin.password = password; // Only set the password, pre-save hook will hash it
      }

      await admin.save();
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error updating admin information.');
    }
  });
}
security();


/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    const messages = await messageModel.find()
    // Format timestamps
    const formattedMessages = messages.map(message => ({
      ...message._doc, // Spread the original message data
      createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
    }));

    res.render("index", { activities, isAuthenticated: req.isAuthenticated(), messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).send("Internal Server Error");
  }
});


// delete
router.delete("/activities/:id", async (req, res) => {
  try {
    const messages = await messageModel.find()
    const formattedMessages = messages.map(message => ({
      ...message._doc, // Spread the original message data
      createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
    }));

    const { id } = req.params;
    await Activity.findByIdAndDelete(id);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete
router.delete("/member/:id", async (req, res) => {
  try {
    const messages = await messageModel.find()
    const formattedMessages = messages.map(message => ({
      ...message._doc, // Spread the original message data
      createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
    }));

    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// route to admin panel 
router.get("/admin", async (req, res) => {
  const members = await userModel.find();
  const activities = await Activity.find();
  res.render("admin", { members, activities });
})


router.get("/activities", async (req, res) => {
  try {
    const messages = await messageModel.find()
    const formattedMessages = messages.map(message => ({
      ...message._doc, // Spread the original message data
      createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
    }));

    const activities = await Activity.find();
    res.render("activities", { activities, isAuthenticated: req.isAuthenticated(), messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).send("Internal Server Error");
  }
})

router.get("/activities/:id", async (req, res) => {
  const messages = await messageModel.find()
  const formattedMessages = messages.map(message => ({
    ...message._doc, // Spread the original message data
    createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
  }));
  const activity = await Activity.findById(req.params.id);
  res.render("one", { activity, isAuthenticated: req.isAuthenticated(), messages: formattedMessages });
})


router.get("/join", async (req, res) => {
  const messages = await messageModel.find()
  const formattedMessages = messages.map(message => ({
    ...message._doc, // Spread the original message data
    createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
  }));

  res.render("join", { isAuthenticated: req.isAuthenticated(), messages: formattedMessages })
})
router.get("/aboutus", async (req, res) => {
  const messages = await messageModel.find()
  const formattedMessages = messages.map(message => ({
    ...message._doc, // Spread the original message data
    createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
  }));
  res.render("aboutus", { isAuthenticated: req.isAuthenticated(), messages: formattedMessages })
})

router.get("/donate", async (req, res) => {
  const messages = await messageModel.find()
  const formattedMessages = messages.map(message => ({
    ...message._doc, // Spread the original message data
    createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
  }));

  res.render("donate", { isAuthenticated: req.isAuthenticated(), messages: formattedMessages })
})

router.get("/members", async (req, res) => {
  const messages = await messageModel.find()
  const formattedMessages = messages.map(message => ({
    ...message._doc, // Spread the original message data
    createdAt: moment(message.createdAt).fromNow() // Format the createdAt timestamp
  }));
  const users = await userModel.find();
  res.render("members", { users: users, isAuthenticated: req.isAuthenticated(), messages: formattedMessages })
})



// MULTER FOR ADDING NEW MEMBER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()} - ${file.originalname}`)
  }
})
uploadnewmember = multer({ storage: storage })
// THIS WILL SEND EMAIL AS WELL AS MAKE A NEW USER MODEL T
router.post("/newMember", uploadnewmember.single("photo"), async (req, res) => {
  const formData = await userModel.create({
    fullname: req.body.fullname,
    email: req.body.email,
    address: req.body.address,
    age: req.body.age,
    number: req.body.number,
    photo: req.file.filename
  })
  console.log(req.file)
  if (formData) {
    await formData.save();
    //   var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASSWORD
    //     }
    //   });
    //   var mailOptions = {
    //     from: process.env.EMAIL,
    //     to: 'sautaboy@gmail.com',
    //     subject: 'Got Mail from Sautaboy Website',
    //     html: `
    //   <h1>Name: ${req.body.name}</h1>
    //   <h3>Address: ${req.body.address}</h3>
    //   <h4>Email: ${req.body.email}</h4>
    //   <h4>Email: ${req.body.age}</h4>
    // `
    //   };


    //   transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });

    // after 
    res.redirect("back");
  }
})


// Configure multer
const upload = multer({
  storage: storage,
}).fields([
  { name: 'activitiesPhotos', maxCount: 10 } // Adjust maxCount as needed
  // { name: 'activitiesVideos', maxCount: 5 }   // Adjust maxCount as needed
]);



// Upload endpoint for GALLERY
router.post('/admin/postactivities', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(`Error: ${err.message}`);
    }

    const activitiesPhotos = req.files['activitiesPhotos'] || [];
    // const activitiesVideos = req.files['activitiesVideos'] || [];

    const imageDocuments = activitiesPhotos.map(image => ({
      imageUrl: `/uploads/${image.filename}`,
      originalFilename: image.originalname
    }));

    // const videoDocuments = activitiesVideos.map(video => ({
    //   videoUrl: `/uploads/${video.filename}`,
    //   originalFilename: video.originalname
    // }));

    const activities = new Activity({
      activitiyTitle: req.body.activitiyTitle,
      activityParagraph: req.body.activityParagraph,
      images: imageDocuments,
      // videos: videoDocuments
    });

    try {
      await activities.save();
      res.redirect('back');
    } catch (error) {
      res.status(500).send(`Error saving to database: ${error.message}`);
    }
  });
});





// THIS IS FOR ACTIVITIES UPLOAD















































module.exports = router;
