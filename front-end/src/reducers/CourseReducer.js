export default (state, action) => {
    switch (action.type) {
        case 'COURSE':
            return {
                courses: action.payload
            }
        default:
            return state;
    }
}