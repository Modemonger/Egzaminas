import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SearchBar } from './searchBar';
import { UserContext } from '../contexts/UserContext';

const NavBar = () => {

    const { user, setUser } = useContext(UserContext);

    const handleSingout = (e) => {
        // e.preventDefault();
        // console.log('bro wtf')
        localStorage.removeItem('user');
        setUser({});
        
    }
    if(!!user)
        switch (user.status) {
            case 'Learner':
                return(
                    <div id='sideBar' className="navbar">
                        <Link to='/'>Home</Link>
                        <Link to='/courses'>Courses</Link>
                        <Link to='/' onClick={handleSingout}>Singout</Link>
                        <a href='#'><span className='backdrop'>X</span></a>
                        <SearchBar />
                        
                    </div>
                );
                break;
            case 'Lecturer':
                return(
                    <div id='sideBar' className="navbar">
                        
                        <Link to='/'>Home</Link>
                        <Link to='/courses'>Courses</Link>
                        <Link to='/my-courses'>My courses</Link>
                        <Link to='/' onClick={handleSingout}>Singout</Link>
                        <a href='#'><span className='backdrop'>X</span></a>
                        <SearchBar />
                    </div>
                );
                break;
        
            default:
                return(
                    <div id='sideBar' className="navbar">
                        
                        <Link to='/'>Home</Link>
                        <Link to='/courses'>Courses</Link>
                        <Link to='/signup'>Signup</Link>
                        <Link to='/login'>Login</Link> 
                        <a href='#'><span className='backdrop'>X</span></a>
                    </div>
                );
                break;
        }

    return(
        <div id='sideBar' className="navbar">
           
            <Link to='/'>Home</Link>
            <Link to='/courses'>Courses</Link>
            <Link to='/signup'>Signup</Link>
            <Link to='/login'>Login</Link> 
            <a href='#'><span className='backdrop'>X</span></a>
        </div>
    );
};

export default NavBar;