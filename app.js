document.addEventListener('DOMContentLoaded', () => {
  const wordCount = 10;
  var guessCount = 4;
  var password = '';

  var start = document.getElementById('start');
  start.addEventListener('click', () => {
    toggleClasses(document.getElementById('start-screen'), 'hide', 'show');
    toggleClasses(document.getElementById('game-screen'), 'hide', 'show');
    startGame();
  });

  function toggleClasses(element, ...classNames) {
    classNames.forEach(name => element.classList.toggle(name))
  }

  function startGame() {
    // get random words and append them to the DOM
    var wordList = document.getElementById('word-list');
    // 'words' variable is from words.js
    var randomWords = getRandomValues(words); // eslint-disable-line no-undef
    randomWords.forEach((word) => {
      var li = document.createElement('li');
      li.innerText = word;
      wordList.appendChild(li);
    });

    // set a secret password and the guess count display
    password = getRandomValues(randomWords, 1)[0];
    setGuessCount(guessCount);

    // add update listener for clicking on a word
    wordList.addEventListener('click', updateGame);
  }

  let getRandomValues = (array, numberOfVals=wordCount) => shuffle(array).slice(0, numberOfVals)

  function shuffle(array) {
    var arrayCopy = array.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      // generate a random index between 0 and idx1 (inclusive)
      var idx2 = Math.floor(Math.random() * (idx1 + 1));

      // swap elements at idx1 and idx2
      [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]]
    }
    return arrayCopy;
  }

  function setGuessCount(newCount) {
    guessCount = newCount;
    document.getElementById('guesses-remaining').innerText =
      `Guesses remaining:  ${guessCount}.`;
  }

  function updateGame(e) {
    if (e.target.tagName === 'LI' && !e.target.classList.contains('disabled')) {
      // grab guessed word, check it against password, update view
      var guess = e.target.innerText;
      var similarityScore = compareWords(guess, password);
      e.target.classList.add('disabled');
      e.target.innerText =  `${guess} --> Matching Letters: ${similarityScore}`
      setGuessCount(guessCount - 1);

      // check whether the game is over
      if (similarityScore === password.length) {
        toggleClasses(document.getElementById('winner'), 'hide', 'show');
        this.removeEventListener('click', updateGame);
      } else if (guessCount === 0) {
        toggleClasses(document.getElementById('loser'), 'hide', 'show');
        this.removeEventListener('click', updateGame);
      }
    }
  }

  function compareWords(word1, word2) {
    if (word1.length !== word2.length) {
      throw 'Words must have the same length';
    }
    var count = 0;
    for (var i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  }
});
