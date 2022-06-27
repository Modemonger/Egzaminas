const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const findUserByName = asyncHandler( async (user) => {
    const foundUser = await User.findOne({ username: user });

    return foundUser;
});

const findUserByEmail = asyncHandler( async (user) => {
    const foundUser = await User.findOne({ email: user });

    return foundUser;
});

module.exports = {
    findUserByName,
    findUserByEmail,
}