const mongoose = require('mongoose');
require('dotenv').config();

const Reader = require("./models/reader.js")
const User = require("./models/user.js")

async function seed() {
    console.log('Seeding has begun! 🌱')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connection successful! 🚀')

    const user = await User.create({
        username: "Jasmine3",
        password: "Password123"
    })

    const student = await Reader.create({
        name: "Jasmine",
        title: "To Kill a Mocking Bird",
        level: 3,
        createdBy: user._id
    })
    console.log(student)

    mongoose.disconnect()
}

seed()
