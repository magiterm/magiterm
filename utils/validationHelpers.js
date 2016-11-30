const axios = require('axios');

const isValidEmail = function(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

const isValidPassword = function(password) {
	if (password.length >= 6) {
		return true;
	}
	return false;
}
 
const isValidName = function(string) {
	if (string.length > 0) {
		return true;
	}

	return false;
}

const isValidUsername = function(username, callback) {
		axios.get('/infodashboard', {
		  params: {
		    username: username
		  }
		})
		.then(function(response) {
			if (username.length > 2) {
				console.log('this is the length of the username: ', username.length);
				if (typeof response.data === 'string') {
					console.log('valid username')
					callback(null, 'valid username')
				} else {
					console.log('found user');
					callback(null, 'found user');
				}
			} else {
				return false;
			}
		});
}

module.exports = {
	isValidName: isValidName,
	isValidPassword: isValidPassword,
	isValidEmail: isValidEmail,
	isValidUsername: isValidUsername
}