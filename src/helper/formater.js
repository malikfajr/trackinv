const wrapSuccess = (data, message) => {
  const body = {
    success: true,
    message,
    data,
  };

  return body;
};

const wrapError = (message, errors) => {
  const body = {
    success: false,
    message,
  };

  if (errors) {
    body.errors = errors;
  }

  return body;
};

module.exports = { wrapSuccess, wrapError };
