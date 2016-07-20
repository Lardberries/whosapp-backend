### Lardberries backend
 * Hosted on Azure
 * Ubuntu Server 14.04
 * Node.js v4.4.7
 * MongoDB

---

### User API

#### POST /user/register
- post to this endpoint to create and authenticate a new user
- body content: username, password, name and phone
- returns the auth token
- example body: 
```javascript
{
	username: 'adwyer',
	password: 'akaburtmaclin',
	name: 'Andy Dwyer',
	phone: '1790234'
}
```
- example response: 
```javascript
{
    success: true,
    result: '6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2MywiZXhwIjoxNDY5MTAx'
}
```

#### POST /user/login
- post to this endpoint to authenticate an existing user
- body content: username and password
- returns the auth token
- example body: 
```javascript
{
	username: 'adwyer',
	password: 'akaburtmaclin'
}
```
- example response: 
```javascript
{
    success: true,
    result: '6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2MywiZXhwIjoxNDY5MTAx'
}
```
- example response: 
```javascript
{
	success: false,
	result: 'Invalid credentials.'
}
```

#### GET /user/info
- returns the necessary user info
- Required headers: `x-access-token: 6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2Myw`
- example response
```javascript
{
    username: 'adwyer',
    name: 'Andy Dwyer',
    phone: '7908456'
}
```


### Chat API

#### POST /chat/
- creates a new chat
- Required headers: `x-access-token: 6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2Myw, Content-Type: application/json`
- body content: name and users
- returns success result
- example body:
```javascript
{
	name: 'The Cool Kids',
	users: [
		'adwyer',
		'rebecca'
	]
}
```
- example response:
```javascript
{
    success: true
}
```
- example response:
```javascript
{
    success: false,
    message: 'Unauthorized'
}
```

#### GET /chat/
- gets all the authenticated user's chats
- Required headers: `x-access-token: 6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2Myw`
- example response
```javascript
{
	success: true,
    result: [
        {
            name: 'The Sanchezes',
            _id: '578f90a82c1c59400431fff7'
        },
        {
            name: 'Internz',
            _id: '578f912a2c1c59400431fff8'
        }
    ]
}
```
