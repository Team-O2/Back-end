const dataResponse = (res, status, message, data) => {
    res.status(status)
        .json({
            'status': status,
            'message': message,
            'data': data
        });
};

const response = (res, status, message) => {
    res.status(status)
        .json({
            'status': status,
            'message': message
        });
}

module.exports = {
    response,
    dataResponse
}