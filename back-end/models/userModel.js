const mongoose = require("mongoose");
// user has a name, email and password
// we can add more later
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please write name"],
    },
    email: {
      type: String,
      required: [true, "Please add email"],
    },
    password: {
      type: String,
      required: [true, "Please write password"],
      minLength: [6, "Password is too short"],
    },
    status: {
        type: String,
        required: [true, "Please provide a type"],
    },
    admin: {
        type: Boolean,
        default: false,
    }
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", userSchema);