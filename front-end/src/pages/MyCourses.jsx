import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import submitLike from '../util/submitLike';
import deleteCourse from '../util/deleteCourse';
import { compareRecent } from '../util/compare';

export const MyCourses = () => {

    const {user, setUser} = useContext(UserContext);
    const [myCourses, setMyCourses] = useState([])

    myCourses.sort(compareRecent);

  
    const handleLike = async (event, course, index) => {
        // console.log(course);
        let response = await submitLike(event, course, index, user, myCourses);
        // console.log(response);
        setMyCourses(response);
    }

    const handledelete = async (event, course, index) => {
        let response = await deleteCourse(event, course, index, user, myCourses);
        // console.log(response);
        setMyCourses(response);
    }

    useEffect(() => {
        const tmp = JSON.parse(window.localStorage.getItem('user'));
        // console.log(tmp);
        if(tmp != user)
            setUser(tmp);  
        // console.log(user);
    }, [])
    

    useEffect(() => {
        var config = {
            method: 'get',
            url: `http://localhost:3001/api/courses/get-user-courses/${user.id}`,
        };
        if(!!user.id)
            axios(config)
            .then(function (response) {
                // console.log(response.data);
                setMyCourses(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
      
    }, [user])
    

    

  return (
    <div className='myCourses'>
        {
            myCourses.map ? myCourses.map((course, index) => {
                return <div key={course._id} className="course">
                            <h3>{course.coursename}</h3>
                            <input className='delete' type="button" name='delete' value="X" onClick={event => handledelete(event, course, index)} />
                            <p>{course.courseDescription}</p>
                            <iframe width="420" height='250' src={course.video}>
                            </iframe>
                            <p className='likes'>
                                {course.likes ? course.likes.length : 0} 
                                <span><input className='likeButton' type="button" name='like' value="<3" onClick={event => handleLike(event, course, index)} /></span>
                            </p>
                        </div>
            }) : 'Loading...'
        }
    </div>
  )
}
