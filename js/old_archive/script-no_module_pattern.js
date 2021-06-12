/* GRAB DOM ELEMENTS -- START */
const overlayDisplayWinnerDiv = document.querySelector('.js-overlay-display-winner');
const overlayDisplayWinnerMessageP = document.querySelector('.js-overlay-display-winner-message');
const newGameBtn = document.querySelector('.js-btn-new-game');
const rematchBtn = document.querySelector('.js-btn-rematch');
/* -------------------------------------------------------------------------------------- */
const playersNameForm = document.querySelector('.js-players-name-form');
const playerOneInput = document.querySelector('.js-player-one');
const playerTwoInput = document.querySelector('.js-player-two');
/* -------------------------------------------------------------------------------------- */
const displayPlayers = document.querySelector('.js-display-players');
const displayPlayerOneP = document.querySelector('.js-display-player-1');
const displayPlayerTwoP = document.querySelector('.js-display-player-2');
/* -------------------------------------------------------------------------------------- */
const boardgameDiv = document.querySelector('.js-boardgame-container');
/* -------------------------------------------------------------------------------------- */
const displayPlayerTurnName = document.querySelector('.js-display-player-turn-name');
/* -------------------------------------------------------------------------------------- */
const squaresDiv = document.querySelectorAll('.js-board-square');
/* GRAB DOM ELEMENTS -- END */

let playerOne;
let playerTwo;
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer;
let gameHasWinner = false;
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6] 
];

function Player(name, symbol) {
  this.name = name;
  this.symbol = symbol;
} 

playersNameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  playerOne = new Player(playerOneInput.value, 'X');
  playerTwo = new Player(playerTwoInput.value, 'O');
  playersNameForm.style.display = 'none';
  boardgameDiv.style.display = 'flex';
  playerOneInput.value = '';
  playerTwoInput.value = '';
  displayPlayerOneP.innerText = playerOne.name;
  displayPlayerTwoP.innerText = playerTwo.name;
  displayPlayerTurnName.innerText = `${playerOne.name} 's `;
  startGame();
})


function startGame() {
  currentPlayer = playerOne;
  squaresDiv.forEach(square => {
    square.classList.add(`board__square_X`);
    square.addEventListener('click', (e) => { 
      e.target.innerText = currentPlayer.symbol;
      if(square.classList.contains(`board__square_${currentPlayer.symbol}`)) {
        square.classList.remove(`board__square_${currentPlayer.symbol}`)
      }
      addSymbolToBoardArray(board, e.target);
      checkWinner(currentPlayer);
      switchPlayer();
      squaresDiv.forEach(square => {
        if(square.classList.contains('board__square_X')) {
          square.className = square.className.replace( /(^|\s+)board__square_X($|\s+)/g , ' board__square_O');
        } else if(square.classList.contains('board__square_O')){
          square.className = square.className.replace( /(^|\s+)board__square_O($|\s+)/g , ' board__square_X');
        }
      })
    }, {once: true});

    const switchPlayer = () => {
      currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne;
      displayPlayerTurnName.innerText = `${currentPlayer.name} 's`; 
    } 
    const addSymbolToBoardArray = (board, elementClicked) => {
      board.splice(elementClicked.dataset.id, 1, (currentPlayer).symbol);
    }
    const checkWinner = () => {
        let p1 = "";
        let p2 = "";
        let p3 = "";
      for (let i=0; i<winningCombinations.length; i++) {
        let winningRow = winningCombinations[i];
        p1 = winningRow[0];
        p2 = winningRow[1];
        p3 = winningRow[2];
        if (board[p1] !== "" && board[p1] == board[p2] && board[p2] == board[p3] && board[p3] == board[p1]) {
          gameHasWinner = true;
        }
        if(gameHasWinner == true) {
          displayWinner(currentPlayer);
        } else if(gameIsTie()) {
          displayPlayers.style.display = 'none';
          overlayDisplayWinnerDiv.style.display = 'flex';
          overlayDisplayWinnerMessageP.innerText = "Oh no! That's a tie!";
        };
      }
    }
    const gameIsTie = () => {
      return board.every((value) => value != "") && (gameHasWinner == false);
    }
    const displayWinner = () => {
      displayPlayers.style.display = 'none';
      overlayDisplayWinnerDiv.style.display = 'flex';
      overlayDisplayWinnerMessageP.innerText = `"${currentPlayer.name}" won!`;
    }
  })
}

newGameBtn.addEventListener('click', () => {
  displayPlayers.style.display = 'flex';
  overlayDisplayWinnerDiv.style.display = 'none';
  playersNameForm.style.display = 'flex';
  boardgameDiv.style.display = 'none';
  gameHasWinner = false;
  squaresDiv.forEach(square => {
    square.innerText = "";
  })
  board = ['', '', '', '', '', '', '', '', ''];

})

rematchBtn.addEventListener('click', () => {
  displayPlayers.style.display = 'flex';
  overlayDisplayWinnerDiv.style.display = 'none';
  gameHasWinner = false;
  squaresDiv.forEach(square => {
  square.innerText = "";
})
board = ['', '', '', '', '', '', '', '', ''];
  startGame();
})