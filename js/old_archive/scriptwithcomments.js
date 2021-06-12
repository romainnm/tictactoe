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

// Function to create players
function Player(name, symbol) {
  this.name = name;
  this.symbol = symbol;
} 

// Game board is in charge of rendering what is happening in the board
const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  const getBoard = () => {
    return board;
  };
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
  return {getBoard, winningCombinations}
})();



// Game controller controls the game logics
// . Who is playing first
// . Placing the symbols >> gameBoard?
// . Is there a winner?
// . Switch players turn
// . Show who is the winner
const gameController = (() => {
  let playerOne;
  let playerTwo;
  let board = gameBoard.getBoard();
  const winningCombinations = gameBoard.winningCombinations;
  let gameHasWinner = false;
  // The module needs so be self invoke, otherwise it returns getBoard not a function;

  const inputPlayers = (() => {
    resetNameForm();
    playersNameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playerOne = new Player(playerOneInput.value, 'X');
      playerTwo = new Player(playerTwoInput.value, 'O');
      console.log(playerOne, playerTwo)
      renderNamesOnBoard(playerOne, playerTwo);
      hideNameForm();
    })

    function renderNamesOnBoard(playerOne, playerTwo) {
      displayPlayerOneP.innerText = playerOne.name;
      displayPlayerTwoP.innerText = playerTwo.name;
      displayPlayerTurnName.innerText = `${playerOne.name} 's`;
    }
    function hideNameForm() {
      playersNameForm.style.display = 'none';
      boardgameDiv.style.display = 'flex';
    }
    function resetNameForm() {
      playerOneInput.value = null;
      playerTwoInput.value = null;
    }
  });
  const placeSymbol = (currentPlayer) => {
    squaresDiv.forEach(square => {
    square.classList.add(`board__square_X`);
    square.addEventListener('click', (e) => {
      currentPlayer = (currentPlayer == playerTwo || currentPlayer == undefined) ? playerOne : playerTwo;
      e.target.innerText = currentPlayer.symbol;
      board.splice(e.target.dataset.id, 1, (currentPlayer).symbol);
      checkWinner();
      displayPlayerTurnName.innerText = (currentPlayer == playerOne) ? `${playerTwo.name} 's` : `${playerOne.name} 's`;
      if(square.classList.contains(`board__square_${currentPlayer.symbol}`)) {
        square.classList.remove(`board__square_${currentPlayer.symbol}`)
      }
      squaresDiv.forEach(square => {
        if(square.classList.contains('board__square_X')) {
          square.className = square.className.replace( /(^|\s+)board__square_X($|\s+)/g , ' board__square_O');
        } else if(square.classList.contains('board__square_O')){
          square.className = square.className.replace( /(^|\s+)board__square_O($|\s+)/g , ' board__square_X');
        }
      }) 
    }, {once: true});
    
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
  })}

  const startGame = () => {
    gameController.inputPlayers()
    gameController.placeSymbol()
  };

  const resetGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
      overlayDisplayWinnerDiv.style.display = 'none';
      displayPlayers.style.display = 'flex';
      gameHasWinner = false;
      currentPlayer = playerOne;
      squaresDiv.forEach(square => {
        square.innerText = "";
      })
  }

  const resetPlayerInfo = () => {
    boardgameDiv.style.display = 'none';
    playersNameForm.style.display = 'flex';
  }

  return {
    startGame,
    resetGame,
    resetPlayerInfo,
    inputPlayers,
    placeSymbol
  }
})();


const newGame = (() => {
  gameController.resetGame();
  gameController.startGame();
  newGameBtn.addEventListener('click', () => {
    gameController.inputPlayers();
    gameController.resetGame();
    gameController.resetPlayerInfo();
    gameController.startGame();
  })
  rematchBtn.addEventListener('click', () => {
    gameController.resetGame();
    gameController.startGame();
  });
})()
  







