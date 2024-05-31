require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const session = require("express-session");

const morgan = require('morgan')
const mongoose = require('mongoose');
const authRouter = require('./controllers/authController');
const Reader = require("./models/reader.js");


const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);


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
        const reader = await Reader.find().populate("createdBy");

        res.render("reader.ejs", {
            reader: reader,
        });
    } catch (error) {
        res.render("error.ejs", { error: error.message });
    }
});

app.get('/reader/:readerId', async (req, res) => {
    try {
        const reader = await Reader.findById(req.params.readerId);

        res.render('show.ejs', {
            reader
        });
    } catch (error) {
        res.render("error.ejs", { error: error.message })
    }
});

app.post('/reader', async (req, res) => {
    if (req.session.user) {
        try {
            req.body.createdBy = req.session.user.userId
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

app.delete('/reader/:reader_id', async (req, res) => {
    if (req.session.user) {
        try {
            const reader = await Reader.findById(req.params.reader_id);
            if (reader && reader.createdBy.equals(req.session.user.userId)) {
                await Reader.findByIdAndDelete(req.params.reader_id);
                res.redirect('/reader');
            } else {
                res.render("error.ejs", {
                    error: 'Delete your Selection Only'
                });
            };
        } catch (error) {
            res.render('error.ejs', { error: error.message });
        }
    } else {
        res.redirect("/reader")
    };
});


app.get("/reader/:readerId/edit", async (req, res) => {
    if (req.session.user) {
        try {
            const foundReader = await Reader.findById(req.params.readerId);
            if (foundReader && foundReader.createdBy.equals(req.session.user.userId)) {
                res.render('edit.ejs', { reader: foundReader });
            } else {
                res.render("error.ejs", {
                    error: 'You can only edit your own reader entries'
                });
            }
        } catch (error) {
            console.error(error);
            res.render("error.ejs", { error: error.message });
        }
    } else {
        res.redirect('/auth/sign-in');
    }
});

app.put('/reader/:readerId', async (req, res) => {
    if (req.session.user) {
        try {
            await Reader.findByIdAndUpdate(req.params.readerId, req.body);
            res.redirect(`/reader/${req.params.readerId}`);
        } catch (error) {
            res.render('error.ejs', { error: error.message });
            res.redirect('/auth/sign-in');
        }
    }
});


const port = process.env.PORT || 3001;

app.listen(port, () => {
});