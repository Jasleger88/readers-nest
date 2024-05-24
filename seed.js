const mongoose = require('mongoose');
require('dotenv').config();

const Reader = require("./models/reader.js")

async function seed() {
    console.log('Seeding has begun! 🌱')
    mongoose.connect(process.env.MONGODB_URI)
    console.log('Connection successful! 🚀')

    const student = await Reader.create({
        Name: "Jasmine",
        Title: "To Kill a Mocking Bird",
        Level: 3,
    })
    console.log(student)

    mongoose.disconnect()
}


seed()
