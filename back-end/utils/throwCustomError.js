module.exports = (message, statusCode) => {
    const error = { status: statusCode, error: message };
    return error;
};