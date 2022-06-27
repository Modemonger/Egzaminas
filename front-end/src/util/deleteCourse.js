import axios from "axios";

const deleteCourse = async (event, course, index, user, courses) => {
    event.preventDefault();

    let config = {
        method: 'delete',
        url: `http://localhost:3001/api/courses/delete-course/${course._id}`,
    };
    let newArr = [...courses];

    let response = axios(config)
    .then(function (response) {        
        newArr.splice(index, 1);
        // console.log(courses);
        return newArr;
    })
    .catch(function (error) {
        console.log(error);
    });
    return response;
}

export default deleteCourse;