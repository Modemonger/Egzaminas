import axios from 'axios'
import qs from 'qs'
import {useLocation, useNavigate} from 'react-router-dom';
import React, { useContext, useState } from 'react'
import { CourseContext } from '../contexts/CoursesContext'
import { UserContext } from '../contexts/UserContext'

const EditPage = () => {

    const { user } = useContext(UserContext);
    const {courses, setCourses} = useContext(CourseContext);
    const location = useLocation();
    const [params, setSetParams] = useState(location);
    const [formFilled, setFormFilled] = useState(false);
    const navigate = useNavigate();
    const [courseForm, setCourseForm] = useState({
        coursename: params.state.id.coursename,
        courseDescription: params.state.id.courseDescription,
        category: params.state.id.category,
        video: params.state.id.video,
    });
    // console.log(location.state.id._id);
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(!user.id && !courseForm.coursename && !courseForm.category && !courseForm.video){
          console.log('fill the required fields')
        }
        
        setFormFilled(false);
        var data = qs.stringify({
            'coursename': courseForm.coursename,
            'courseDescription': courseForm.courseDescription,
            'category': courseForm.category,
            'video': courseForm.video,
          });
          var config = {
            method: 'post',
            url: `http://localhost:3001/api/courses/update-course/${params.state.id._id}`,
            data : data,
            // headers: { Authorization: `Bearer ${user.token}` },
          };
        //   console.log(config);
          axios(config)
          .then(function (response) {
            console.log(response.data.responseBody);
            // let newArr = [...courses];
            setCourses(response.data.responseBody)
            
            navigate('/my-courses')
            
            
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
                    value={courseForm.coursename} 
                    onChange={handleChange} />
          </label>
          <label>
            Course description:
            <textarea name='courseDescription' 
                      id='description' 
                      cols='30' rows='10' 
                      value={courseForm.courseDescription} 
                      onChange={handleChange}></textarea>
          </label>
          <label>
            Course category<span>* <span className='hide'>Required</span></span>:
            <select name='category' 
                    id='categoriesSelector' 
                    required='true'
                    value={courseForm.category}
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
                  value={courseForm.video} 
                  onChange={handleChange}/>
          </label>
            
            <input className={formFilled ? 'submit green' : 'submit'} 
                    type='submit' 
                    value='Update'

            />
        </form>
    )
}

export default EditPage;