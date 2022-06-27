const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Course = require('../models/coursesModel');
const mongoose = require('mongoose');
const throwCustomError = require('../utils/throwCustomError');

const getAllCourses = asyncHandler ( async () => {
    const courses = await Course.find({});
    return courses;
});

const updateEventById = async (eventId, coursename, courseDescription, category, video) => {
    // we do it seperatly so we dont change something we dont want to 
    // owner, coursename, courseDescription, category, video
    if (coursename) {
      await Course.findByIdAndUpdate(eventId, { coursename: coursename });
    }
    if (courseDescription) {
      await Course.findByIdAndUpdate(eventId, { courseDescription: courseDescription });
    }
    if (category) {
      await Course.findByIdAndUpdate(eventId, { category: category });
    }
    if (video) {
      await Course.findByIdAndUpdate(eventId, { video: video });
    }
  
    const updatedEvent = await Course.findById(eventId);
  
    return updatedEvent;
  };

module.exports = {
    getAllCourses,
    updateEventById
}