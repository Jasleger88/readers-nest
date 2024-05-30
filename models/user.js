const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
