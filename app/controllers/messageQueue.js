var _ = require('underscore');
var mongoose = require('mongoose');
var url = url = require('url');
var WebSocket = require('ws');

var auth = require('../utils/auth');
var Message = require('../models/message');

var ObjectId = mongoose.Types.ObjectId;
var messageQueue = module.exports = {};
var socketServer = null;
var openConnections = {};

messageQueue.init = function init(server) {
  if (socketServer) {
    return;
  }

  socketServer = new WebSocket.Server({ server: server });

  socketServer.on('connection', function connection(conn) {
    // accept HTTP header or path param
    var pathQuery;
    var pathname = url.parse(conn.upgradeReq.url).pathname;
    if (pathname && pathname.length) {
      pathQuery = pathname.substring(1);
    }
    var token = conn.upgradeReq.headers['x-access-token'] || pathQuery;

    // get access token from request
    auth(token, function (err, user) {
      if (!user) {
        // no valid auth header
        return conn.send('Unauthorized', function() {
          conn.close()
        });
      }
      openConnections[user._id.toString()] = conn;

      conn.on('close', function close() {
        openConnections[user._id.toString()] = undefined;
      });
    });
  });
};

/* Takes in information about a message to be sent out. For each recipient, either sends the
 * message immediately over a websocket if available or stores in the database for later
 * retrieval.
 * 
 * chat - Chat object
 * message - Plain Object following Message Document Schema
 * cb - callback
 */
messageQueue.queueMessage = function queueMessage(chat, message, cb) {
  var newMessageId = ObjectId();

  chat.getNextSequenceNumber(function (err, newSeq) {
    if (err) {
      cb(err);
    }

    var newMessage = _.defaults({ _id: newMessageId, seq: newSeq }, message);

    // save to database
    Message.create(newMessage, function (err) {
      if (err) {
        console.log('You may have lost sequence number ' + newSeq + ' in chat ' + chat._id);
        return cb(err);
      }

      var payload = JSON.stringify(_.omit(newMessage, 'sender'));

      // send out to sockets, best effort :/
      for (chatUserId of chat.users) {
        var userConnection = openConnections[chatUserId.toString()];
        if (userConnection) {
          userConnection.send(payload);
        }
      }

      cb();
    });
  });
};
