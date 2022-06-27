const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Course = require('../models/coursesModel');
const mongoose = require('mongoose');
const throwCustomError = require('../utils/throwCustomError');
const {
    getAllCourses,

} = require('../services/coursesServices');
require('dotenv').config({ path: __dirname + '/../.env' });

const createCourse = asyncHandler(async (req, res) => {
    const { owner, coursename, courseDescription, category, video } = req.body;
    
    const courseExists = await Course.findOne({ video: video });

    if(courseExists){
        const error = throwCustomError("Course already exists", 400);
        res.status(error.status).json(error);
        return
    }

    const course = await Course.create({
        owner: owner,
        coursename: coursename,
        courseDescription: courseDescription,
        category: category,
        video: video,
    });

    if (course) {
        // console.log(course);
        res.status(201).json({
            status: "success",
            message: "Course created",
            responseBody:{
            _id: course._id,
            owner: course.owner,
            coursename: course.coursename,
            courseDescription: course.courseDescription,
            category: course.category,
            video: course.video,
            },
        });
    } else {
        const error = throwCustomError("Invalid course data", 400);
        res.status(error.status).json(error);
    }

});

const getCourses = asyncHandler(async (req, res) => {

    const courses = await getAllCourses();
  
    if (courses) {
        // console.log(courses)
      res.status(201).send(courses);
    } else {
        const error = throwCustomError('Course not found', 400);
        res.status(error.status).json(error);
    }

});

const getCourse = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const courses = await Course.find({_id: id}, '-__v');
  
    if (courses) {
      res.status(201).send(courses[0]);
    } else {
        const error = throwCustomError('Courses not found', 400);
        res.status(error.status).json(error);
    }

});

const getUserCourses = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const courses = await Course.find({owner: id}, '-__v');
  
    if (courses) {
      res.status(201).send(courses);
    } else {
        const error = throwCustomError('Course not found', 400);
        res.status(error.status).json(error);
    }

});

const deleteCourse = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const courseDelete = await Course.findByIdAndDelete(id);

    res.status(201).send(courseDelete);

});

const addLike = asyncHandler(async (req, res) => {

    const { userId, courseId } = req.params;

    const course = await Course.findOne({_id: courseId}, '-__v');

    let response;
    // console.log(course.likes.filter(e => e.userId.toString() == mongoose.Types.ObjectId(userId).toString()));


    if(course.likes.filter(e => e.userId.toString() == mongoose.Types.ObjectId(userId).toString()).length <= 0){
        course.likes.push({userId: userId});

        await course.save(function (err) {
            if (err) {
                const error = throwCustomError('Course not found', 400);
                res.status(error.status).json(error);
                response = error;
                
                // return
            }
        });
        // response = course;
        // console.log('add', course.likes.filter(e => e.userId.toString() == mongoose.Types.ObjectId(userId).toString()));
        
        res.status(201).send(course);
        return
    }

    if(course.likes.filter(e => e.userId.toString() == mongoose.Types.ObjectId(userId).toString()).length > 0){
        const like = course.likes.filter(e => e.userId.toString() === mongoose.Types.ObjectId(userId).toString());

        const index = course.likes.indexOf(like[0]);

        course.likes.splice(index, 1);
        // console.log(index, course);
        await course.save(function (err) {
            if (err) {
                const error = throwCustomError('Course not found', 400);
                res.status(error.status).json(error);
                response = error;
                // return
            }
        });
        // response = course;
        // console.log('remove', course.likes.filter(e => e.userId.toString() == mongoose.Types.ObjectId(userId).toString()));
        res.status(201).send(course);
        return
    }

    // const error = throwCustomError('Encountered an issue', 400);
    // res.status(response.status || 201).json(response);

});

function compareRecent( a, b ) {
    if ( a.createdAt < b.createdAt ){
      return 1;
    }
    if ( a.createdAt > b.createdAt ){
      return -1;
    }
    return 0;
  }

const getRecent = asyncHandler(async (req, res) => {
    
    const courses = await getAllCourses();

    if (courses) {
        // console.log(courses, 'courses');
        const sortedCourses = courses.sort(compareRecent);
        // console.log(sortedCourses, 'sorted');
        res.status(201).send(sortedCourses);
    } else {
        const error = throwCustomError('Course not found', 400);
        res.status(error.status).json(error);
    }

});

function compareLikes( a, b ) {
    if ( a.likes.length < b.likes.length ){
      return 1;
    }
    if ( a.likes.length > b.likes.length ){
      return -1;
    }
    return 0;
  }

const getPopular = asyncHandler(async (req, res) => {
    
    const courses = await getAllCourses();

    if (courses) {
        // console.log(courses, 'courses');
        const sortedCourses = courses.sort(compareLikes);
        // console.log(sortedCourses, 'sorted');
        res.status(201).send(sortedCourses);
    } else {
        const error = throwCustomError('Course not found', 400);
        res.status(error.status).json(error);
    }

});

const getLikedCourses = asyncHandler(async (req, res) => {
    
    const { userId } = req.params;

    const courses = await getAllCourses();
    // console.log(courses);
    let newArr = [];
    courses.forEach(course => {

        if(course.likes.filter(e => e.userId.toString() == mongoose.Types.ObjectId(userId).toString()).length > 0){
            // console.log(course);
            newArr.push(course);
        }
    });

    // console.log(newArr);
    res.status(201).json(newArr);

});

module.exports = {
    createCourse,
    getCourses,
    getCourse,
    getUserCourses,
    deleteCourse,
    addLike,
    getRecent,
    getPopular,
    getLikedCourses,

}