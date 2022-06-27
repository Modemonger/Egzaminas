const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const throwCustomError = require("../utils/throwCustomError");

///////////// Protect for all ///////////////////

const protect = asyncHandler(async (secret ,req, res, next) => {
  let token;
  console.log(req.headers.authorization, 'middleware');
  // check for token in the headers (Using Bearer for use with postman)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // split the Bearer part from the token
      token = req.headers.authorization.split(" ")[1];
      // decode
      
      const decoded = jwt.verify(token, secret);

      // because we use the user id to make a token we can ger id from decoded string
      req.user = await User.findById(decoded.id).select("-password");

      req.user.decodedId = decoded.id;
      // move on in case something it gets stuck
      next();
    } catch (error) {
      // error if wrong token or bad token
      throw throwCustomError("Not authorized", 400);
    }
  }
  if (!token) {
    // error if no token
    throw throwCustomError("Not autherized, no token found", 400);
  }
});

////////// Middleware object //////////////

const middleware ={
  userAuthentication: (req, res, next) => {
    protect(process.env.USER_SECRET, req, res, next);
    next();
  },
  creatorAuthentication: (req, res, next) => {
    protect(process.env.CREATOR_SECRET, req, res, next);
    next();
  },
  adminAuthentication: (req, res, next) => {
    protect(process.env.ADMIN_SECRET, req, res, next);
    next();
  },
}

module.exports = { 
  middleware
 };