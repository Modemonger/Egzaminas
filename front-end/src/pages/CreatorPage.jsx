import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import CourseForm from '../components/courseForm';
import { CourseContext } from '../contexts/CoursesContext';
import { UserContext } from '../contexts/UserContext';
import submitLike from '../util/submitLike';
import deleteCourse from '../util/deleteCourse';
import { compareRecent } from '../util/compare';
import { MyCourses } from './MyCourses';


const CreatorPage = () => {
  const {courses, setCourses} = useContext(CourseContext);
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    const tmp = JSON.parse(window.localStorage.getItem('user'));
    // console.log(tmp);
    if(tmp != user)
        setUser(tmp);

    let config = {
        method: 'get',
        url: 'http://localhost:3001/api/courses/get-courses',
    };
    
    axios(config)
    .then(function (response) {
        // console.log(response.data);
        setCourses(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });

}, []);

  courses.sort(compareRecent);

  
  const handleLike = async (event, course, index) => {
    // console.log(course);
    let response = await submitLike(event, course, index, user, courses);
    // console.log(response);
    setCourses(response);
  }

  const handledelete = async (event, course, index) => {
    let response = await deleteCourse(event, course, index, user, courses);
    // console.log(response);
    setCourses(response);
  }

  return (
    <div className='creatorPage'>
      <CourseForm></CourseForm>
      <MyCourses></MyCourses>
    </div>
  )
}

export default CreatorPage