const mongoose = require("mongoose");

const readerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    level: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Reader", readerSchema)