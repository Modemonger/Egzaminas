import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import qs from 'qs'
import { useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        const tmp = JSON.parse(window.localStorage.getItem('user'));
        // console.log(tmp);
        if(tmp){
            setUser(tmp);
            navigate('/');
        }
            
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(user);

        if(user.password === user.confirmPassword){
            var data = qs.stringify({
                'username': user.username,
                'email': user.email,
                'password': user.password,
                'status': user.status,
            });
            var config = {
                method: 'post',
                url: 'http://localhost:3001/api/users/register',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data,
            };
            
            axios(config)
            .then(function (response) {
                // console.log(response.data);
                window.localStorage.setItem('user', JSON.stringify(response.data.responseBody));
                navigate('/');
            })
            .catch(function (error) {
                console.log(error);
            });
            return 
        }
        setUser({
            ...user,
            password: '',
            confirmPassword: '',
        })
        throw new Error('passwords dont match, try again');
    }
    
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setUser({
            ...user,
            [name]: value
        });
        // console.log(user);
    }

  return (
    <div className='signup'>
        <div className='signupCard'>
            <form className='signupForm' onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type={'text'} name='username' id='username' value={user ? user.username : ''} onChange={handleChange} />
                </label>

                <label>
                    Email:
                    <input type={'email'} name='email' id='email' value={user ? user.email : ''} onChange={handleChange} />
                </label>
                
                <label>
                    Password:
                    <input type={'password'} name='password' id='password' value={user ? user.password : ''} onChange={handleChange} />
                </label>
                
                <label>
                    Confirm password:
                    <input type={'password'} name='confirmPassword' id='confirmPassword' value={user ? user.confirmPassword : ''} onChange={handleChange} />
                </label>

                <label>
                    I am a:
                    <div className='radio' onChange={handleChange}>
                        Learner<input type='radio' name='status' id='learner' value='Learner' />
                        Lecturer<input type='radio' name='status' id='lecturer' value='Lecturer' />
                    </div>
                    
                </label>
                
                <input className='signupBtn' type={'submit'} value='SIGNUP'/>
            </form>
        </div>
    </div>
  )
}
