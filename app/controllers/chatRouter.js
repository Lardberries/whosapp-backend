var express = require('express');
var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');

var Chat = require('../models/chat');
var User = require('../models/user');
var Message = require('../models/message');
var NewMessage = require('../models/newMessage');
var config = require('../../config');
var messageQueue = require('../models/messageQueue');

var ObjectId = mongoose.Types.ObjectId;

var chatRouter = module.exports = express.Router({mergeParams: true});

/* GET - /chat/
 * Gets all of the chats for the logged-in user, sorted by last activity
 */
chatRouter.get('/', function (req, res) {
  if (!req.user) {
    return res.status(403).send('Unauthorized');
  }

  Chat.find({users: {$has: req.user._id}}, function (err, results) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Something broke!');
    }

    res.send(_.map(_.sortBy(results, 'lastActivity'), function (chat) {
      return _.pick(chat, 'name', '_id');
    }));
  });
});

/* GET - /chat/:id
 * Gets more information about the given chat, like the current users
 */
chatRouter.get('/:id', function (req, res) {
  if (!req.user) {
    return res.status(403).send('Unauthorized');
  }

  
  Chat.findOne({users: {$has: req.user._id}, _id: ObjectId(req.param.id)}, function (err, chat) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Something broke!');
    }
    if (!chat) {
      return res.status(404).send('Chat not found');
    }

    // need to get name of each user
    async.mapSeries(chat.users, function onEachUser(userId, done) {
      User.findOne({_id: ObjectId(userId)}, function (err, user) {
        done(err, _.pick(user, 'name', 'username'));
      });
    }, function onFinish(err, users) {
      if (err) {
        console.error(err.stack);
        return res.status(500).send('Something broke!');
      }
      res.send({
        _id: chat._id.toString(),
        name: chat.name,
        users: users
      });
    });
  });
});

/* POST - /chat/:id/leave
 */
chatRouter.get('/:id', function (req, res) {
  if (!req.user) {
    return res.status(403).send('Unauthorized');
  }

  // remove the current user from the given chat
  Chat.findOneAndUpdate({users: {$has: req.user._id}, _id: ObjectId(req.param.id)}, {$pull: {users: req.user._id}}, function (err) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Something broke!');
    }

    return res.send({status: 'success'});
  }, {multi: false});
});

/* POST - /chat/
 */

/* POST - /chat/:id/message
 * Post params:
 *  - String content
 */
chatRouter.get('/:id', function (req, res) {
  if (!req.user) {
    return res.status(403).send('Unauthorized');
  }

  var content = req.body.content;

  // validate message
  if (!content) {
    return res.status(400).send('Message required');
  }

  if (content.length > config.maxMessageLengt) {
    return res.status(400).send('Message too long');
  }

  // find this chat (validate user)
  Chat.findOne({users: {$has: req.user._id}, _id: ObjectId(req.param.id)}, function (err, chat) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Something broke!');
    }
    if (!chat) {
      return res.status(404).send('Chat not found');
    }

    // use the current emoji or a new one?
    Messages.findOne({sender: req.user._id, chatid: chat._id}, null, {sort: {time: -1}}, function (err, lastMessage) {
      if (err) {
        console.error(err.stack);
        return res.status(500).send('Something broke!');
      }

      var getEmoji;

      if (!lastMessage || (new Date() - lastMessage.time) > config.emojiTimeout) {
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
          return res.status(500).send('Something broke!');
        }

        var message = {
          sender: req.user._id,
          chatid: chat._id,
          emoji: emoji,
          time: new Date(),
          content: content
        };

        // add message to Message collection
        Message.create(message, function(err) {
          // add message to NewMessageCollection for all users
          messageQueue.queueMessage(chatUserId, message, function(err) {
            if (err) {
              console.error(err.stack);
              return res.status(500).send('Something broke!');
            }
            return resp.send({'status': 'success'});
          });
        });
      });
    });
  }, {multi: false});
});

module.exports = chatRouter;