import { createContext, useReducer } from "react";
import CourseReducer from "../reducers/CourseReducer";

const initialState = {
    courses: [],
}

export const CourseContext = createContext(initialState);

export const CourseProvider = ({children}) => {
    const [state, dispatch] = useReducer(CourseReducer,initialState);

    function setCourses(id) {
        dispatch({
            type: 'COURSE',
            payload: id
        });
    }

    return(
        <CourseContext.Provider value={{
            courses: state.courses,
            setCourses,
        }}>
            {children}
        </CourseContext.Provider>
    )
}