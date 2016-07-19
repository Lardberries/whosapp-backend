var emojis = module.exports = {};

var whosappEmojis = '😊,😁,😂,😇,😎,😆,👽,😈,👻,💪,👯,👮,👼,👶,🎈,🎂,💚,🎷,🎩,⚽,🎱,🎓,🏈,☎,📍,🔪,🍜,🍍,🌽,🍨,🍀,🌵,🐉,🐎,🐋,🐕,🐥,🙉,☃,🐼'.split(',');

/* Generate a randomly ordered sequence of the WhosApp emojis
 * Returns - an array of emojis
 */
emojis.generateSequence = function generateSequence() {
  var output = whosappEmojis;
  for (var i = 0; i < output.length; i++) {
    var j = Math.floor(Math.random() * output.length);

    var temp = output[i];
    output[i] = output[j];
    output[j] = temp;
  }

  return output;
}