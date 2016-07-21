var emoji = module.exports = {};

var whosappEmojis = emoji.whosappEmojis = '🐙,😁,😂,😇,😎,😆,🐨,🐸,👻,💪,👯,🐻,👼,🐶,🎈,🎂,💚,🎷,🎩,🦁,🎱,🍉,🦄,🐢,😹,🐯,🍜,🍍,🌽,🌮,🍀,🌵,🐉,🐎,🐋,🐕,🐥,🙉,🐰,🐼'.split(',');

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
