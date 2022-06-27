import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contexts/UserContext';
import axios from 'axios'
import { CourseContext } from '../contexts/CoursesContext';
import submitLike from '../util/submitLike';
import { compareLikes, compareRecent } from '../util/compare';

export const Courses = () => {
    const { user, setUser } = useContext(UserContext);
    const { courses, setCourses } = useContext(CourseContext);
    const [categoryCourses, setCategoryCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);

    useEffect(() => {
        const tmp = JSON.parse(window.localStorage.getItem('user'));
        // console.log(tmp);
        if(tmp != user)
            setUser(tmp);  
        // console.log(user);
    }, [])

    useEffect(() => {
        let config = {
            method: 'get',
            url: 'http://localhost:3001/api/courses/get-courses',
        };
            
        axios(config)
        .then(function (response) {
            // console.log(response.data);
            setCourses(response.data);
            let sorted = [...response.data].sort(compareRecent);
            setCategoryCourses(sorted);
            // setCategoryCourses(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }, [])
    
    useEffect(() => {
        let config = {
            method: 'get',
            url: 'http://localhost:3001/api/users/get-lecturers',
        };
            
        axios(config)
        .then(function (response) {
            // console.log(response.data);
            setLecturers(response.data.responseBody);
        })
        .catch(function (error) {
            console.log(error);
        });
    }, [])

    const handleLike = async (event, course, index) => {
        // let courseIndex = courses.indexOf(course);
        let response = await submitLike(event, course, index, user, categoryCourses);
        setCategoryCourses(response);
    }

    const handleCategory = (event) => {
        // console.log(event.target.value);
        let lecturer;
        let value = event.target.value;
        if(event.target.value.includes('lecturer')){
            lecturer = event.target.value.split(" ")[1];
            value = event.target.value.split(" ")[0];
            // console.log(lecturer, value);
        }
        switch (value) {
            case 'recent':
                let recent = [...courses].sort(compareRecent);
                setCategoryCourses(recent);
                break;
            
            case 'popular':
                let popular = [...courses].sort(compareLikes);
                setCategoryCourses(popular);
                break;

            case 'lecturer':
                let config = {
                    method: 'get',
                    url: `http://localhost:3001/api/courses/get-user-courses/${lecturer}`,
                };
                    axios(config)
                    .then(function (response) {
                        // console.log(response.data);
                        setCategoryCourses(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                break;

            default:
                let technology = [...courses].filter(course => course.category == event.target.value);
                setCategoryCourses(technology);
                break;
        }
    }

  return (
    <div className='courses'>
        <select defaultValue='recent' name="categories" id="categoriesSelector" onChange={event => handleCategory(event)}>
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
            <option value="technology">Technology</option>
            <option value="music">Music</option>
            <option value="sience">Sience</option>
            {
               lecturers.map((user)=>{
                    return <option value={'lecturer ' + user._id}>Lecturer {user.username}</option>
               })
            }
        </select> 
        {
            categoryCourses.map((course, index) => {
                return <div key={course._id} className="course">
                            <h3>{course.coursename}</h3>
                            <p>{course.courseDescription}</p>
                            <iframe width="420" height='250' src={course.video}>
                            </iframe>
                            <p className='likes'>
                                {course.likes ? course.likes.length + ' ' : 0 + ' '} 
                                liked it
                                {user ? <span><input className='likeButton' type="button" name='like' value="<3" onClick={event => handleLike(event, course, index)} /></span> : ''}
                            </p>
                        </div>
            })
        }
    </div>
  )
}