var _ = require('underscore');
var emoji = module.exports = {};

var whosappEmojis = emoji.whosappEmojis = '😊,😁,😂,😇,😎,😆,👽,😈,👻,💪,👯,👮,👼,👶,🎈,🎂,💚,🎷,🎩,⚽,🎱,🎓,🏈,☎,📍,🔪,🍜,🍍,🌽,🍨,🍀,🌵,🐉,🐎,🐋,🐕,🐥,🙉,☃,🐼'.split(',');
var whosappColors = emoji.whosappColors = '#99C764,#D66D6D,#6DABD6,#6DD6A2,#ECEF89,#D483EC,#FDA267,#C49B75,#8972B5,#EB62DD,#44B764,#F7CAC9,#F7786B,#91A8D0,#034F84,#FAE03C,#98DDDE,#9896A4,#DD4132,#B18F6A,#79C753,#9DC3D4,#00ABC0,#7ACCB8,#D2B49C,#E78B90,#F88F58,#E5D68E,#964F4C,#C5C6C7,#7BA0C0,#476A30,#B18EAA,#9FD66D,#F86043,#6D8ED6,#7821BA,#50E3C2,#BD0FE1,#B8E986'.split(',');

var emojiColorMap = _.object(whosappEmojis, whosappColors);

/* Generate a randomly ordered sequence of the WhosApp emojis
 * Returns - an array of emojis
 */
emoji.generateSequence = function generateSequence() {
  var output = whosappEmojis;
  for (var i = 0; i < output.length; i++) {
    var j = Math.floor(Math.random() * output.length);

    var temp = output[i];
    output[i] = output[j];
    output[j] = temp;
  }

  return output.join(',');
}

emoji.getColorForEmoji = function getColorForEmoji(emoji) {
	return emojiColorMap[emoji];
}