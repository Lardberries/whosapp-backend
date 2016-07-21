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
            _id: '578f90a82c1c59400431fff7',
            sequenceCounter: 9,
            emoji: '🌽',
            "users": [
                "578f9bc2b7570fcc23b9beca",
                "578f9b59b7570fcc23b9bec8",
                "578f9b98b7570fcc23b9bec9"
            ],
            "userNames": [
                "Papa Sanch",
                "Jakey Sanch",
                "Momma Sanch"
            ]
        },
        {
            name: 'Internz',
            _id: '578f912a2c1c59400431fff8',
            "sequenceCounter": 12,
            emoji: '😊',
            "users": [
                "578f9bc2b7570fcc23b9bee7",
                "578f9b59b7570fcc23b9bef2",
                "578f9b98b7570fcc23b9be7a"
            ],
            "userNames": [
                "Jordan",
                "Christine",
                "Mandy"
            ]
        }
    ]
}
```

#### GET /chat/`:id`
- gets the chat with the given id
- Required headers: `x-access-token: 6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2Myw`
- example route: `localhost:3000/chat/578f912a2c1c59400431fff8`
- example response:
```javascript
{
    _id: '578f912a2c1c59400431fff8',
    name: 'Internz',
    emoji: '😊',
    users: [
        {
            name: 'Jake Sanchez',
            username: 'bigsanch'
        },
        {
            name: 'Rebecca Yuen',
            username: 'rebecca'
        }
    ]
}
```

#### POST /chat/`:id`/leave
- removes the authenticated user from the specified chat
- Required headers: `x-access-token: 6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2Myw`
- example route: `localhost:3000/chat/578f912a2c1c59400431fff8/leave`
- example response:
```javascript
{
    "success": true
}
```

#### POST /chat/`:id`/message
- adds a message to the chat (what happens when the user hits send)
- Required headers: `x-access-token: 6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2Myw`
- example route: `localhost:300/chat/578f912a2c1c59400431fff8/message`
- example body:
```javascript
{
  content: "Hey man what's up??"
}
```
- example response:
```javascript
{
  success: true
}
```

#### GET /chat/`:id`/messages
- gets all the messages in the chat, sorted
- Required headers: `x-access-token: 6IkpXVIsImlkI1x1MDAxOcKTwrlhdCI6MTQ2OTAxNDk2Myw`
- example route: `localhost:300/chat/578f912a2c1c59400431fff8/messages`
- example response:
```javascript
{
    success: true,
    result: [
        {
            emoji: "🌽",
            _id: "578faa84e6c2d1b0056bb645",
            time: "2016-07-20T16:44:52.784Z",
            content: "I'm a corn emoji. $waggg."
        },
        {
            emoji: "😊",
            _id: "578faa58e6c2d1b0056bb644",
            time: "2016-07-20T16:44:08.265Z",
            content: "Chillin like a villain! 💪"
        },
        {
            emoji: "🌽",
            _id: "578faa1be6c2d1b0056bb643",
            time: "2016-07-20T16:43:07.284Z",
            content: "Nothing much homie, how you doin?"
        },
        {
            emoji: "😊",
            _id: "578fa9f8e6c2d1b0056bb642",
            time: "2016-07-20T16:42:32.348Z",
            content: "What's up???"
        }
    ]
}
```

### WebSocket API
URL: ws://HOSTNAME/`access-token`
 - Client does not send messages
 - Every new message in the client's chats (including messages they wrote) is sent over the web socket while the socket is open.
 - Messages are sent one at a time
 - Example Message:
 ```javascript
 {
     "_id": "578fa67945047f7825843d97",
     "seq": 10,
     "chatid": "578f9e42b7570fcc23b9becb",
     "emoji": "😇",
     "time": "2016-07-20T16:27:37.558Z",
     "content": "Yeah, he is"}
 ```
