import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import { CourseContext } from '../contexts/CoursesContext';
import submitLike from '../util/submitLike';
import { compareLikes, compareRecent } from '../util/compare';

const UserPage = () => {
    const { user, setUser } = useContext(UserContext);
    const { courses, setCourses } = useContext(CourseContext);

    const [recent, setRecent] = useState([]);
    const [popular, setPopular] = useState([]);

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

    useEffect(() => {
        let sortRecent = [...courses].sort(compareRecent);
        let sortPopular = [...courses].sort(compareLikes);
        setRecent(sortRecent);
        setPopular(sortPopular);
    }, [courses])
    
    const handleLike = async (event, course) => {
      let courseIndex = courses.indexOf(course);
      let response = await submitLike(event, course, courseIndex, user, courses);
      setCourses(response);
    }

    return (
      <div className='homepage'>
          <div className="popular">
              <h2>Popular</h2>
              {
                popular.map((course, index) => {
                    return <div key={course._id} className="course">
                              <h3>{course.coursename}</h3>
                              <p>{course.courseDescription}</p>
                              <iframe width="420" height='250' src={course.video}>
                              </iframe>
                              <p className='likes'>
                                  {course.likes ? course.likes.length : 0} 
                                  <span><input className='likeButton' type="button" name='like' value="<3" onClick={event => handleLike(event, course)} /></span>
                              </p>
                          </div>
                })
            }
          </div>
          <div className="recent">
            <h2>Recent</h2>
            {
                recent.map((course, index) => {
                    return <div key={course._id} className="course">
                              <h3>{course.coursename}</h3>
                              <p>{course.courseDescription}</p>
                              <iframe width="420" height='250' src={course.video}>
                              </iframe>
                              <p className='likes'>
                                  {course.likes ? course.likes.length : 0} 
                                  <span><input className='likeButton' type="button" name='like' value="<3" onClick={event => handleLike(event, course)} /></span>
                              </p>
                          </div>
                })
            }
          </div>
      </div>
    )
}

export default UserPage