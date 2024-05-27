require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const session = require("express-session");

const morgan = require('morgan')
const mongoose = require('mongoose');
const authRouter = require('./controllers/authController');
const Reader = require("./models/reader.js");
// const User = require("./models/user.js");

const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);

// app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SECRET_PASSWORD,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
)

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
})
app.use('/auth', authRouter);

app.get("/", (req, res) => {
    res.render("home.ejs")
});

app.get("/new-reader", async (req, res) => {
    res.render("new.ejs");
});

app.get("/reader", async (req, res) => {
    try {
        const reader = await Reader.find();
        res.render("reader.ejs", {
            reader: reader,
        });
    } catch (error) {
        res.render("error.ejs", { error: error.message });
    }
});

app.get('/reader/:readerId', async (req, res) => {
    try {
        const reader = await Readers.findById(req.params.readerId);

        res.render('show.ejs', {
            reader
        });
    } catch (error) {
        res.render("error.ejs", { error: error.message })
    }
});

app.post('/reader', async (req, res) => {
    if (req.session.user) {
        console.log("Received form data:", req.body); 
        try {
            const reader = await Reader.create(req.body);
            res.redirect("/reader");
        } catch (error) {
            console.error("Error creating reader:", error); 
            res.render("error.ejs", { error: error.message });
        }
    } else {
        res.redirect("/auth/sign-in");
    }
});


app.delete('/reader/:readerId', async (req, res) => {
    if (req.session.user) {
        try {
            const deletedReader = await Readers.findByIdAndDelete(req.params.readerId);
            res.send(deletedReader);
        } catch (error) {
            res.render("error.ejs", { erorr: error.message })
        }
    } else {
        res.redirect("/auth/sign-in");
    }
});



app.get("/reader/:readerId/edit", async (req, res) => {
    try {
      const reader = await Reader.findById(req.params.readerId);
      res.render("edit.ejs", {reader});
    } catch (error) {
      res.render("error.ejs", { error: error.message })
    }
  });


app.put('/reader/:readerId', async (req, res) => {
    if (req.session.user) {
        try {
            const updatedReader = await Readers.findByAndUpdate(
                req.params.readerId,
                req.body,
                { new: true }
            );
            res.send(UpdatedReader)
        } catch (error) {
            res.render('error.ejs', { error: error.message });
        }
    } else {
        res.redirect('/auth/sign-in');
    }
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`My mongo db url is ${process.env.MONGODB_URI}`);
});