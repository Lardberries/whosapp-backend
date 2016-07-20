var messageQueue = module.exports = {};

/* Takes in information about a message to be sent out. For each recipient, either sends the
 * message immediately over a websocket if available or stores in the database for later
 * retrieval.
 * 
 * chatUserIds - An array of ObjectIds for each recipient of the message (including sender)
 * message - Plain Object following Message Document Schema
 * next - callback
 */
messageQueue.queueMessage = function queueMessage(chatUserIds, message, next) {

};