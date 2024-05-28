const express = require("express");
const authRouter = express.Router();
const UserModel = require("../models/user.js");
const bcrypt = require("bcrypt");

authRouter.get("/sign-up", (req, res) => {
  return res.render("auth/sign-up.ejs");
});

authRouter.post("/sign-up", async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hash;

  try {
    const usersWithUsername = await UserModel.find({ username: req.body.username });
    if(usersWithUsername.lenght > 0){
      throw new Error("Username already taken");
    }

    const newUser = await UserModel.create(req.body);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("auth/sign-up.ejs", { error: error.message });
  }
});

authRouter.get("/sign-in", (req, res) => {
  return res.render("auth/sign-in.ejs");
});

authRouter.post("/sign-in", async (req, res) => {
  console.log(req.body.password)
  
  try {
    const userFromDatabase = await UserModel.findOne({
      username: req.body.username,
    });
    if (!userFromDatabase){
      throw new Error("Login Failed")
    };
    
    const passwordsMatch = bcrypt.compareSync(
      req.body.password,
      userFromDatabase.password
    );

    console.log(userFromDatabase);

    if (passwordsMatch) {
    req.session.user = {
      username: userFromDatabase.username,
      userId: userFromDatabase._id,
    };
      res.redirect("/");
    } else {
     return res.send(`Login Failed`);
    }
  } catch (error) {
    res.render("error.ejs", { error: error.message });
  }
});

authRouter.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/sign-in');
});

module.exports = authRouter;
