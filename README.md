<img width="1440" alt="Readers Nest Home Page" src="https://github.com/Jasleger88/readers-nest-app/assets/166673099/f5eba9a6-d5e6-4e42-922a-22ca2658f827">

## Readers Nest App Overview

<p> Readers Nest is a dynamic reading app designed to foster a vibrant community of readers who share their reading experiences. <br> 
<p> With Readers Nest, users can effortlessly add books they have read, specify their reading level, and manage their reading list with ease. <br>
<br> Additionally, Readers Nest provides features for users to connect with others who share their interests and discover new titles. </p>

## Link to Readers Nest
**https://reader-nest-app.netlify.app

## Inspiration

The idea for Readers Nest was born out of a passion for reading and a desire to create a space where readers could come together to share their love for books. 
I wanted to build a platform that not only helps users keep track of their reading but also facilitate 
meaningful interactions and recommendations within the reading community.

## Planning Process

![Planning Process of Readers Nest](https://github.com/Jasleger88/readers-nest-app/assets/166673099/b187d0d6-aa13-4af4-b7d3-28053e8e3bf1)


## Features

**Sign In/Sign Out:** Users can create an account, sign in, and securely sign out of their account.
Add Books: Users can add books they have read to their personal library within the app.

**Specify Reading Level:** Users can specify the reading level of each book they add, making it easier for others to find recommendations tailored to their reading proficiency.

**Edit and Delete:** Users have the ability to edit or delete books from their library at any time.
Bulk Add: Users can add multiple books to their library in one go, streamlining the process for avid readers.

**Readers Page:** A dedicated page listing readers and the books they have read, fostering community engagement and connections.



## Challenges and Solutions

**Challenge:** Implementing a robust authentication system to ensure user data security. <br>
**Solution:** Utilized JSON for secure authentication and authorization.

**Challenge:** Designing an intuitive user interface that is both aesthetically pleasing and user-friendly. <br>
**Solution:** Conducted user testing and feedback sessions to iterate on the UI/UX design and improve user satisfaction.

**Challenge:** Managing and scaling the database to handle a growing number of users and book entries. <br>
**Solution:** Implemented MongoDB as the database solution and optimized database queries for performance.

## Future Enhancements

**Review System:** Implement a review system to allow users to share their thoughts and recommendations on books.

**Recommendation System:** Introduce a recommendation system based on user preferences and reading history.

**Social Sharing:** Enable users to share their favorite books and reading lists on social media platforms.

**Book Clubs:** Introduce features for users to join or create book clubs, facilitating discussions and group readings.

## To get started with Readers Nest, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies by running npm install.
4. Set up a MongoDB database and configure the connection in config.js.
5. Run the server by executing npm start.
6. Access the app through your preferred web browser at http://localhost:3000.

## Technology Included:

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: JSON 
* API Testing: Postman
* Middleware: { Method-override, Morgan, Dotenv }
* Package Management: package.json

## Full-Stack Integration 

# Middleware
```
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
```

# Frontend (HTML)

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="/stylesheets/style.css">
</head>

<body id="readers-selection">
  <%- include('./partials/nav') %>
    <div class="readers-container">
      <div class="readers-content">
      <h1 class="hello-reader highlight">Hello Reader</h1>
      <p class="readers-message highlight"> "Embark on a Journey through the pages of your adventure so far. Behold, the treasury of takes you've
        traversed!"</p>
    
      <% if (reader && reader.length> 0 ) { %>
        <div class="books-container">
          <% reader.forEach(function(book) { %>
            <div class="book">
              <a href="/reader/<%= book._id%>">
              <p><%= book.name %> - <%= book.title %> - Level <%= book.level %></p>
            </a>
            </div>
              <% }); %>
            <% } else { %>
              <p> No Books Available</p>
              <% } %>
        </div>
</div>

</body>
</html>

```
# Backend (Server.JS)

```
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
```







