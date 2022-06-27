import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import UserPage from './UserPage';
import CreatorPage from './CreatorPage';
import { Signup } from './Signup';
export const HomePage = () => {

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const tmp = JSON.parse(window.localStorage.getItem('user'));
    // console.log(tmp);
    if(tmp)
      setUser(tmp);
  }, [])
  if(!!user && user.status)
    switch (user.status) {
        case 'Learner':
            return(
                <UserPage>

                </UserPage>
            );
            break;
        case 'Lecturer':
            return(
                <CreatorPage> 

                </CreatorPage>
            );
            break;

        default:
            return(
                <Signup>
                
                </Signup>
            );
            break;
    }
    return(
        <Signup>
        
        </Signup>
    );
    
}

