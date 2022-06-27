import { createContext, useReducer } from "react";
import UserReducer from "../reducers/UserReducer";

const initialState = {
    user: {
        username: '',
        email: '',
        password: '',
        status: '',
    },
    transactions:[

    ],
    saved:[

    ]
}

export const UserContext = createContext(initialState);

export const UserProvider = ({children}) => {
    const [state, dispatch] = useReducer(UserReducer,initialState);

    function setUser(id) {
        dispatch({
            type: 'USER',
            payload: id
        });
    }

    function deleteTransaction(id) {
        dispatch({
            type: 'DELETE_TRANSACTION',
            payload: id 
        });
    }

    function addTransaction(id){
        dispatch({
            type: 'ADD_TRANSACTION',
            payload: id
        });
    }

    function deleteSaved(id) {
        dispatch({
            type: 'DELETE_SAVED',
            payload: id 
        });
    }

    function addSaved(id){
        dispatch({
            type: 'ADD_SAVED',
            payload: id
        });
    }

    return(
        <UserContext.Provider value={{
            transactions: state.transactions,
            user: state.user,
            deleteTransaction,
            addTransaction,
            deleteSaved,
            addSaved,
            setUser,
        }}>
            {children}
        </UserContext.Provider>
    )
}