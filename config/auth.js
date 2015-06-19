// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	'googleAuth' : {
		'clientID' 		: '27049612063-duht4qaoccc6m54m353odppi93hmepqq.apps.googleusercontent.com',
		'clientSecret' 	: 'KoNAwdLOuvYw3_tw1XCKmC0R',
		'callbackURL' 	: 'http://localhost:3000/auth/google/callback'
	}

};