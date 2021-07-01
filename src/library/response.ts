const response = (res, status, message) => {
  res.status(status).json({
    status: status,
    message: message,
  });
};

const dataResponse = (res, status, message, data) => {
  res.status(status).json({
    status: status,
    message: message,
    data: data,
  });
};

const dataTokenResponse = (res, status, message, data, token) => {
  res.status(status).json({
    status: status,
    message: message,
    data: data,
    token: token,
  });
};

module.exports = {
  response,
  dataResponse,
  dataTokenResponse,
};
