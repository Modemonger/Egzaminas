const jwt = require("jsonwebtoken");
const { randomBytes, scryptSync, timingSafeEqual } = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const throwCustomError = require("../utils/throwCustomError");
const {
  findUserByName,
  findUserByEmail,

} = require('../services/userServices');
require("dotenv").config({ path: __dirname + "/../.env" });

// function to create a token
const generateToken = (id, status) => {
  switch (status) {
    case 'learner':
      return jwt.sign({ id }, process.env.USER_SECRET, {
        expiresIn: "30d",
      });
    case 'lecturer':
      return jwt.sign({ id }, process.env.CREATOR_SECRET, {
        expiresIn: "30d",
      });
    case 'admin':
      return jwt.sign({ id }, process.env.ADMIN_SECRET, {
        expiresIn: "30d",
      });
  
    default:
      return jwt.sign({ id }, process.env.USER_SECRET, {
        expiresIn: "30d",
      });
  }
  
};

function checkPwd(str) {
  if (str.length < 6) {
    const error = throwCustomError("Password is too short", 400);
    res.status(error.status).json(error);
  }
  if (str.length > 24) {
    const error = throwCustomError("Password is too long", 400);
    res.status(error.status).json(error);
  }
  if (str.search(/\d/) == -1) {
    const error = throwCustomError("Password must contain a number", 400);
    res.status(error.status).json(error);
  }
  if (str.search(/[a-zA-Z]/) == -1) {
    const error = throwCustomError("Password must contain letters", 400);
    res.status(error.status).json(error);
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, status } = req.body;
  

  if (!username || !email || !password || !status) {
    const error = throwCustomError("Please add all fields", 400);
    res.status(error.status).json(error);
  }
  console.log(username, email, password, status);
  //checkPwd(password);
  
  const userExists = await findUserByEmail(email);
  
  const userNameTaken = await findUserByName(username);

  if (userExists) {
    const error = throwCustomError("Email already exists", 400);
    res.status(error.status).json(error);
  }

  if (userNameTaken) {
    const error = throwCustomError("Username is taken", 400);
    res.status(error.status).json(error);
  }

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");

  const user = await User.create({
    username: username,
    email: email,
    password: `${salt}:${hashedPassword}`,
    status: status,
  });

  if (user) {

    res.status(201).json({
      status: "success",
      message: "User registered",
      responseBody:{
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
        token: generateToken(user._id, user.status),
      },
    });
  } else {
    const error = throwCustomError("Invalid user data", 400);
    res.status(error.status).json(error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByName(username);

  if (user) {
    const [salt, key] = user.password.split(":");
    const hashedByffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    const match = timingSafeEqual(hashedByffer, keyBuffer);

    if (match) {
      res.status(201).json({
        status: "success",
        message: "User loged in",
        responseBody:{
          id: user._id,
          username: user.username,
          email: user.email,
          status: user.status,
          token: generateToken(user._id, user.status),
        },
      });
    } else {
      const error = throwCustomError("Wrong password", 400);
      res.status(error.status).json(error);
    }
  } else {
    const error = throwCustomError("User was not found", 400);
    res.status(error.status).json(error);
  }
});

const getUser = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.decodedId);
  const decodedUsersIdFromJwt = req.user.decodedId;

  if (!userId) {
    throw throwCustomError("Please provide userID", 400);
  }

  if (getReqId(req) !== decodedUsersIdFromJwt) {
    throw throwCustomError("You're trying to get a different user!", 400);
  }
  // finds user by id
  const user = await User.findById(userId);

  if (user) {
    res.status(200).json({
      status: "success",
      responseBody:{
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } else {
    throw throwCustomError("User not found", 400);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  // get the user we will be updating
  const userId = mongoose.Types.ObjectId(req.user.decodedId);

  const decodedUsersIdFromJwt = req.user.decodedId;

  if (!userId) {
    throw throwCustomError("Please provide userID", 400);
  }

  if (getReqId(req) !== decodedUsersIdFromJwt) {
    throw throwCustomError("You're trying to upadte a different user!", 400);
  }

  const { username, email, password } = req.body;
  if(!username && !email && !password) throw throwCustomError('Nothing to update', 400);
  
  // we update the user based on what information we get
  if (password) {
    // make sure the password is right
    checkPwd(password);
    // password needs to be hashed again
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64).toString("hex");
    await User.findByIdAndUpdate(userId, { password: `${salt}:${hashedPassword}` });
  }
  if (username) {
    const userNameTaken = await User.findOne({ username: username });
    // simply change the name if thats requested
    if(!userNameTaken)
      await User.findByIdAndUpdate(userId, { username: username });
    else throw throwCustomError("User name is taken", 400);
  }
  if (email) {
    const user = await User.findOne({ email: email });
    // change email
    if(!user)
      await User.findByIdAndUpdate(userId, { email: email });
    else throw throwCustomError("Email is in use", 400);
  }
  // get updated user
  const updatedUser = await User.findById(userId);
  // show updated user data
  res.status(200).json({
    status: "success",
    responseBody:{
      message: "User data updated at user id",
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    },
  });
});

const deleteUserHandler = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const decodedUsersIdFromJwt = req.user.decodedId;

  if (!userId) {
    throw throwCustomError("Please provide userID", 400);
  }

  if (userId !== decodedUsersIdFromJwt) {
    throw throwCustomError("You're trying to delete other user!", 400);
  }

  await EventModel.deleteMany({user: userId});
  let existingUser = await UserModel.findByIdAndDelete(userId);

  const deletedUser = existingUser._doc;

  res.json({
    status: "success",
    responseBody:{
      message: "User data deleted at user id",
      id: deletedUser._id,
      username: deletedUser.username,
      email: deletedUser.email,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUserHandler,
};