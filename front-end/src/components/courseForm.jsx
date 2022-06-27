import axios from 'axios'
import qs from 'qs'
import React, { useContext, useState } from 'react'
import { CourseContext } from '../contexts/CoursesContext'
import { UserContext } from '../contexts/UserContext'

const CourseForm = () => {

    const { user } = useContext(UserContext);
    const {courses, setCourses} = useContext(CourseContext);

    const [formFilled, setFormFilled] = useState(false);

    const [courseForm, setCourseForm] = useState({
      category: 'technology',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!user.id && !courseForm.coursename && !courseForm.category && !courseForm.video){
          console.log('fill the required fields')
        }
        setFormFilled(false);
        var data = qs.stringify({
            'owner': user.id,
            'coursename': courseForm.coursename,
            'courseDescription': courseForm.courseDescription,
            'category': courseForm.category,
            'video': courseForm.video,
          });
          var config = {
            method: 'post',
            url: 'http://localhost:3001/api/courses/create-course',
            data : data
          };
          // console.log(config);
          axios(config)
          .then(function (response) {
            let newArr = [...courses];
            newArr.unshift(response.data.responseBody);
            setCourses(newArr);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        setCourseForm({
            ...courseForm,
            [name]: value
        });

        if(!!courseForm.coursename && !!courseForm.category && !!courseForm.video){
          setFormFilled(true);
        } else{
          setFormFilled(false);
        }
        // console.log(user);
    }

    return (
        <form method='post' onSubmit={handleSubmit}>
          <label>
            Course name<span>* <span className='hide'>Required</span></span>:
            <input type='text'
                    name='coursename' 
                    id='coursename' 
                    required='true'
                    value={courseForm.coursename ? courseForm.coursename : ''} 
                    onChange={handleChange} />
          </label>
          <label>
            Course description:
            <textarea name='courseDescription' 
                      id='description' 
                      cols='30' rows='10' 
                      value={courseForm.courseDescription ? courseForm.courseDescription : ''} 
                      onChange={handleChange}></textarea>
          </label>
          <label>
            Course category<span>* <span className='hide'>Required</span></span>:
            <select name='category' 
                    id='categoriesSelector' 
                    required='true'
                    value={courseForm.category ? courseForm.category : 'technology'}
                    onChange={handleChange}>
                <option value='technology'>Technology</option>
                <option value='music'>Music</option>
                <option value='sience'>Sience</option>
            </select> 
          </label>

          <label>
            Video<span>* <span className='hide'>Required</span></span>:
            <input type='url' 
                  name='video' 
                  id='video' 
                  required='true'
                  value={courseForm.video ? courseForm.video : ''} 
                  onChange={handleChange}/>
          </label>
            
            <input className={formFilled ? 'submit green' : 'submit'} 
                    type='submit' 
                    value='Create'

            />
        </form>
    )
}

export default CourseForm