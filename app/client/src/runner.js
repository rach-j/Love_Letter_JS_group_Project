const SetUpHelper = require('./helpers/setup.js');
const GameView = require('./views/game_view.js');
const Player = require('./models/player.js');
const Turn = require('./models/turn.js');

let deck;
// let initialRemovedCard;
let gameNotWon = true;
let playerArray = [];
let gameNotStarted = true;
let turnCounter = 0;
let skippedPlayer = 0;
let playerWon = null;
const gameView = new GameView();


SetUpHelper.setUpDeck((finishedDeck) => {
  deck = finishedDeck;
  deck.removeInitialCard();
});


const handleStartGameButton = function () {
  if (gameNotStarted) {
    playerArray =  SetUpHelper.setUpPlayers(deck, gameView);
    // console.log(playerArray);
    playRound();
    gameNotStarted = false;
    const startButton = document.getElementById('start-button');
    startButton.style.background = "rgb(158, 147, 130)";
    startButton.style.color = "#614d4d";
  }
}


const handleGoEndButtonClick = function (event) {
  if (event) {
    console.log("ENDGOBUTTON was clicked by user");
    gameView.unShowCards(playerArray);
    const goEndButton = document.getElementById(`${event.srcElement.id}`)
    goEndButton.disabled = true;
    goEndButton.style.background = "rgb(158, 147, 130)";
  }
  console.log("ENDGOBUTTON code setoff");
  if (!gameNotWon) {
    // END GAME winner is current active player who clicked button;
    // logic to set playerWon to the last remaining active player.
    // GAME END Notification!
    console.log("SOME ONE WON! as all else are out", playerWon);
  } else if (deck.noCardsLeft) {
    // logic to compare values of active players cards.
    // GAME END Notification!
    console.log("SOME ONE WON with higher card!", playerWon);
  } else {
    if (turnCounter < 3) { turnCounter += 1;
    } else { turnCounter = 0 };
    playRound();
  }
} // end end-go-button click


const playRound = function () {
  console.log("Round:", turnCounter," kicked off!");
  const turnLogic = new Turn(playerArray[turnCounter], gameView, deck, playerArray);

  const numActivePlayers = playerArray.filter(player => player.aliveStatus).length;
  console.log(numActivePlayers);
  if (numActivePlayers < 2) {
    gameNotWon = false;
    handleGoEndButtonClick();
  } else if (turnLogic.playerIsActive(gameView)) {
    turnLogic.getSecondCard(deck, gameView);
    console.log("Turn of player:", turnLogic.activePlayer);
    // console.log("Hand card is:", turnLogic.activePlayer.card.character);
    // console.log("Deck card for their go: ", turnLogic.secondCard.character);

    const endOfGo = function () {
      const goEndButton = document.getElementById('end-go-button');
      goEndButton.style.background = "rgb(138, 218, 105)";
      goEndButton.disabled = false;
    }

    turnLogic.activateCardChoiceEventListener(endOfGo);
    skippedPlayer = 0;
  } else { // auto SKIP PLAYER AS THEY are dead
    handleGoEndButtonClick();
  };

} // end Round


document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', handleStartGameButton)

  const goEndButton = document.getElementById('end-go-button');
  goEndButton.addEventListener('click', (event) => {handleGoEndButtonClick(event)});
  goEndButton.disabled = true;
});







// goEndButton.style.hover =
// goEndButton.style.active =
//
// #end-go-button:hover {background-color: rgb(55, 221, 57)}
// #end-go-button:active {
// background-color: rgb(92, 231, 27);
// box-shadow: 1px 2px #666;
// transform: translateY(3px);
// }
