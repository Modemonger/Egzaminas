import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import qs from 'qs'
import { useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export const Signin = () => {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        const storage = JSON.parse(window.localStorage.getItem('user'));
        // console.log(storage);
        if(storage){
            setUser(storage);
            navigate('/');
        }
            
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(user);

        var data = qs.stringify({
            'username': user.username,
            'password': user.password, 
        });
        var config = {
            method: 'post',
            url: 'http://localhost:3001/api/users/login',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
            
        axios(config)
        .then(function (response) {
            // console.log(response.data.responseBody);
            window.localStorage.setItem('user', JSON.stringify(response.data.responseBody));
            navigate('/');
        })
        .catch(function (error) {
            console.log(error);
            setUser({
                ...user,
                password: '',
            });
        });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setUser({
            ...user,
            [name]: value
        });
        
    }

  return (
    <div className='signup'>
        <div className="signupCard">
            <form className='signupForm' onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type={'text'} 
                        name="username" 
                        id="username" 
                        value={user ? user.username : ''} 
                        onChange={handleChange}/>
                </label>
                
                <label>
                    Password:
                    <input type={'password'}
                        name="password" 
                        id="password" 
                        value={user ? user.password : ''} 
                        onChange={handleChange}/>
                </label>
                
                <input className='signupBtn' type={'submit'} value="SIGNIN" />
            </form>
        </div>
    </div>
  )
}
