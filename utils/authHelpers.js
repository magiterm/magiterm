const requireAuth = function(nextState, replace, callback) {
  const token = localStorage['jwtToken'];

  if (token) {
    axios.get('/decode', {
      params: {
        token: token
      }
    })
    .then(function(response) {
      if (!response) {
        callback(null, response);
      } 
    })
    .catch(function(err) {
      callback(err, null);
    })
  } else {
    window.location = '/';
  }
}

module.exports = requireAuth;