const mongoose = require("mongoose");

const readerSchema = new mongoose.Schema({
    Name: { type: String, required: true},
    Title: {type: String, required: true},
    Level:{type: Number, required: true},
});

module.exports = mongoose.model("Reader", readerSchema)