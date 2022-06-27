import axios from "axios";

const submitLike = async (event, course, index, user, courses) => {
    event.preventDefault();
    // console.log(user.id, course._id);
    let config = {
        method: 'post',
        url: `http://localhost:3001/api/courses/like/${user.id}/${course._id}`,
        autherization: { 
            'Authorization': `Bearer ${user.token}`,
        },
    };
      
    let response = await axios(config)
    .then(response => {
        // console.log(response.data);
        let newArr = [...courses];
        newArr[index] = response.data;
        return newArr;
    })
    .catch(function (error) {
        console.log(error);
        throw new Error(error.message);
        return
    });
    return response;
}

export default submitLike;