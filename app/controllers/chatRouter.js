var express = require('express');
var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');

var Chat = require('../models/chat');
var User = require('../models/user');
var Message = require('../models/message');
var config = require('../../config');
var messageQueue = require('./messageQueue');
var emoji = require('../utils/emoji');

var ObjectId = mongoose.Types.ObjectId;

var chatRouter = module.exports = express.Router({mergeParams: true});

/* GET - /chat/
 * Gets all of the chats for the logged-in user, sorted by last activity
 */
chatRouter.get('/', function (req, res) {
  if (!req.user) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  Chat.find({users: req.user._id}, function (err, results) {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Something broke' });
    }

    res.send({ success: true, result: _.map(_.sortBy(results, 'lastActivity'), function (chat) {
      return _.pick(chat, 'name', '_id', 'sequenceCounter');
    })});
  });
});

/* POST - /chat/
 * Creates a new chat
 * Params:
 *  - String name - Name for new chat
 *  - [String] users - users to add, not including current user. Either username or phone number
 */
chatRouter.post('/', function (req, res) {
  if (!req.user) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  // validation
  var name = req.body.name;

  if (!name || !name.length || name.length > 30) {
    return res.status(400).json({ success: false, message: 'Name must be between 1 and 30 characters' });
  }

  var userEntries = req.body.users;

  // need to convert phone numbers or usernames to ObjectIds
  async.map(userEntries, User.findFromEntry.bind(User), function (err, users) {
    var userIds = [req.user._id];

    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if (!user) {
        return res.json({ success: false, message: 'Entry not found', entry: userEntries[i] });
      } else {
        userIds.push(user._id);
      }
    }

    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Something broke!' });
    }

    Chat.create({
      name: name,
      users: userIds,
      emojiSequence: emoji.generateSequence(),
      emojiCounter: 0
    }, function (err) {
      if (err) {
        console.error(err.stack);
        return res.status(500).json({ success: false, message: 'Something broke!' });
      }
      return res.json({ success: true });
    });
  });
});

/* GET - /chat/:id
 * Gets more information about the given chat, like the current users
 */
chatRouter.get('/:id', function (req, res) {
  if (!req.user) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  // invalid id param
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid ObjectId parameter' });
  }

  Chat.findOne({users: req.user._id, _id: ObjectId(req.params.id)}, function (err, chat) {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Something broke!' });
    }
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    // need to get name of each user
    async.mapSeries(chat.users, function onEachUser(userId, done) {
      User.findOne({_id: ObjectId(userId)}, function (err, user) {
        done(err, _.pick(user, 'name', 'username'));
      });
    }, function onFinish(err, users) {
      if (err) {
        console.error(err.stack);
        return res.status(500).json({ success: false, message: 'Something broke!' });
      }
      res.json({
        _id: chat._id.toString(),
        name: chat.name,
        users: users
      });
    });
  });
});

/* POST - /chat/:id/leave
 */
chatRouter.post('/:id/leave', function (req, res) {
  if (!req.user) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  // invalid id param
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid ObjectId parameter' });
  }

  // remove the current user from the given chat
  Chat.findOneAndUpdate({users: req.user._id, _id: ObjectId(req.params.id)}, {$pull: {users: req.user._id}}, function (err) {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Something broke!' });
    }

    return res.json({ success: true });
  }, {multi: false});
});

/* POST - /chat/:id/message
 * Post params:
 *  - String content
 */
chatRouter.post('/:id/message', function (req, res) {
  if (!req.user) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  var content = req.body.content;

  // validate message
  if (!content) {
    return res.status(400).json({ success: false, message: 'Message required' });
  }

  if (content.length > config.maxMessageLengt) {
    return res.status(400).json({ success: false, message: 'Message too long' });
  }

  // invalid id param
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid ObjectId parameter' });
  }

  // find this chat (validate user)
  Chat.findOne({users: req.user._id, _id: ObjectId(req.params.id)}, function (err, chat) {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Something broke!' });
    }
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    // use the current emoji or a new one?
    Message.findOne({sender: req.user._id, chatid: chat._id}, null, {sort: {time: -1}}, function (err, lastMessage) {
      if (err) {
        console.error(err.stack);
        return res.status(500).json({ success: false, message: 'Something broke!' });
      }

      var getEmoji;

      if (!lastMessage || (new Date() - lastMessage.time) > config.emojiTimeout || !lastMessage.emoji) {
        // need new emoji
        getEmoji = chat.getNextEmoji.bind(chat);
      } else {
        getEmoji = function getEmojiSimple(cb) {
          process.nextTick(function() {
            cb(null, lastMessage.emoji);
          });
        }
      }

      getEmoji(function (err, emoji) {
        if (err) {
          console.error(err.stack);
          return res.status(500).json({ success: false, message: 'Something broke!' });
        }

        var message = {
          sender: req.user._id,
          chatid: chat._id,
          emoji: emoji,
          time: new Date(),
          content: content
        };

        // add message
        messageQueue.queueMessage(chat, message, function(err) {
          if (err) {
            console.error(err.stack);
            return res.status(500).json({ success: false, message: 'Something broke!' });
          }
          return res.json({ success: true });
        });
      });
    });
  }, {multi: false});
});

/* GET - /chat/:id/messages
 * gets all the messages for the given chat
 */
chatRouter.get('/:id/messages', function(req, res) {
  if (!req.user) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  // invalid id param
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid ObjectId parameter' });
  }

  // get them messages
  Message.find({ chatid: ObjectId(req.params.id) }, function (err, messages) {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Something broke' });
    }

    res.json({ success: true, result: _.map(_.sortBy(messages, 'time'), function (message) {
      return _.pick(message, 'emoji', '_id', 'seq', 'time', 'content');
    }).reverse() });
  });
});

module.exports = chatRouter;