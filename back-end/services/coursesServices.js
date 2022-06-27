const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Course = require('../models/coursesModel');
const mongoose = require('mongoose');
const throwCustomError = require('../utils/throwCustomError');

const getAllCourses = asyncHandler ( async () => {
    const courses = await Course.find({});
    return courses;
});

module.exports = {
    getAllCourses,
    
}