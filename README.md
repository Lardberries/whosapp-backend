### Lardberries backend
 * Hosted on Azure
 * Ubuntu Server 14.04
 * Node.js v4.4.7
 * MongoDB


### API Guide

POST /user/register
- post to this endpoint to create and authenticate a new user
- body content: username, password, name and phone
- returns the auth token
- example body: {
	username: 'adwyer',
	password: 'akaburtmaclin',
	name: 'Andy Dwyer',
	phone: '1790234'
}
- example response: {
    success: true,
    result: '6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2MywiZXhwIjoxNDY5MTAx'
}

POST /user/login
- post to this endpoint to authenticate an existing user
- body content: username and password
- returns the auth token
- example body: {
	username: 'adwyer',
	password: 'akaburtmaclin'
}
- example response: {
    success: true,
    result: '6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2MywiZXhwIjoxNDY5MTAx'
}
- example response: {
	success: false,
	result: 'Invalid credentials.'
}