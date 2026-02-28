const gameBoard = (function () {
  let board = [null, null, null, null, null, null, null, null, null];

  function checkEmpty(index) {
    if (board[index]) {
      return false;
    } else {
      return true;
    }
  }

  function addMove(symbol, index) {
    if (checkEmpty(index)) {
      board[index] = symbol;
    }
  }
  function ResetBoard() {
    board.splice(0, board.length + 1, ...new Array(9).fill(null));
  }

  function getBoard() {
    return board;
  }
  return { addMove, ResetBoard, getBoard };
})();

const Player = function (name, symbol) {
  let playerName = name;
  let playerSymbol = symbol;
  let playerScore = 0;

  function changeName(name) {
    playerName = name;
  }

  function changeSymbole(symbol) {
    playerSymbol = symbol;
  }

  function incrementScore() {
    playerScore++;
  }

  function resetScore() {
    playerScore = 0;
  }

  function getScore() {
    return playerScore;
  }

  function getName() {
    return playerName;
  }

  function getSymbole() {
    return playerSymbol;
  }

  return {
    changeName,
    changeSymbole,
    incrementScore,
    resetScore,
    getName,
    getScore,
    getSymbole,
  };
};

const gameController = (function () {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let gameOver = false;
  let curruntPlayer = player1;
  let lastWinCombo;
  let gameOverType;
  let winner;

  const winningCombos = [
    //row
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    //coloumn
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    //diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWin() {
    let board = gameBoard.getBoard();
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        lastWinCombo = combo;
        return true;
      }
    }
    return false;
  }
  function checkDraw() {
    let board = gameBoard.getBoard();
    if (!checkWin()) {
      let emptySlotscount = 0;
      board.forEach((slot) => {
        if (!slot) {
          emptySlotscount++;
        }
      });
      if (emptySlotscount !== 0) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  function changeCurruntPlayer() {
    if (curruntPlayer === player1) {
      curruntPlayer = player2;
    } else {
      curruntPlayer = player1;
    }
  }

  function playMove(index) {
    gameBoard.addMove(curruntPlayer.getSymbole(), index);
    checkGameOver();
    changeCurruntPlayer();
  }
  function getCurrentPlayer() {
    return curruntPlayer;
  }

  function checkGameOver() {
    if (checkWin()) {
      curruntPlayer.incrementScore();
      gameOverType = "win";
      winner = curruntPlayer;
      gameOver = true;
    }

    if (checkDraw()) {
      gameOverType = "draw";
      gameOver = true;
    }
    return false;
  }

  function getGameStatus() {
    return gameOver;
  }

  function runGame() {
    gameOver = false;
  }
  function stopGame() {
    gameOver = true;
  }

  function resetCurrentPlayer() {
    curruntPlayer = player1;
  }

  function getLastWiningCombo() {
    return lastWinCombo;
  }

  function getWinningComboIndex() {
    for (let i = 0; i < winningCombos.length; i++) {
      if (winningCombos[i] === lastWinCombo) {
        return i;
      }
    }
  }

  function getGameOverType() {
    return gameOverType;
  }

  function getGameWinner() {
    return winner;
  }
  return {
    resetCurrentPlayer,
    playMove,
    getCurrentPlayer,
    getGameStatus,
    runGame,
    stopGame,
    player1,
    player2,
    getLastWiningCombo,
    getWinningComboIndex,
    getGameOverType,
    getGameWinner,
  };
})();

const displayManager = (function () {
  const boardDiv = document.querySelector(".boardReal");
  const restartButton = document.querySelector("#reset");
  const player1Input = document.querySelector("#player1Name");
  const player2Input = document.querySelector("#player2Name");
  const player1Score = document.querySelector("#xScore");
  const player2Score = document.querySelector("#oScore");
  const info = document.querySelector(".info");
  const player1ScoreBox = document.querySelector(".player1");
  const player2ScoreBox = document.querySelector(".player2");
  const animatedBars = document.querySelectorAll("[data-winning-combo]");
  const winningAnimDraw = document.querySelector(".winingAnimDraw");
  const winningAnimO = document.querySelector(".winingAnimO");
  const winningAnimX = document.querySelector(".winingAnimX");
  const resetPlayerInfoBtn = document.querySelector("#resetScoreBtn");

  boardDiv.addEventListener("animationend", () => {
    boardDiv.classList.remove("animB");
  });

  info.addEventListener("animationend", () => {
    info.classList.remove("infoAnim");
  });

  [winningAnimDraw, winningAnimO, winningAnimX].forEach((elm) => {
    elm.addEventListener("click", () => {
      removeOverScreen();
      reset();
    });
  });

  resetPlayerInfoBtn.addEventListener("click", () => {
    gameController.player1.resetScore();
    gameController.player2.resetScore();
    updateScoreDisplay();
  });

  function displayBoard() {
    boardDiv.textContent = "";
    let board = gameBoard.getBoard();
    for (let i = 0; i < board.length; i++) {
      let cell = document.createElement("div");
      if (board[i] === null) {
        cell.textContent = " ";
      } else {
        cell.textContent = board[i];
      }
      cell.classList.add("cell");

      if (board[i] === "X") {
        cell.classList.add("xCell");
      } else if (board[i] === "O") {
        cell.classList.add("oCell");
      }

      cell.setAttribute("data-index", `${i}`);

      boardDiv.appendChild(cell);
      boardDiv.classList.add("animB");
    }
  }

  function updateBoardDisplay(cells, index) {
    let board = gameBoard.getBoard();

    cells.forEach((cell) => {
      if (cell.dataset.index === index) {
        if (board[index] === "X") {
          cell.classList.add("xCell");
        } else {
          cell.classList.add("oCell");
        }
        cell.textContent = board[index];
      }
    });
  }
  function addCellsEventsListeners() {
    const cells = document.querySelectorAll(".cell");

    function clickBoard(e) {
      let gameOver = gameController.getGameStatus();
      if (!gameOver) {
        let index = e.target.dataset.index;
        gameController.playMove(index);
        updateBoardDisplay(cells, index);
        updateScoreBoxBorder();
        let gameOver = gameController.getGameStatus();
        updateInfoDisplay();
        if (gameOver) {
          addCellsEventsListeners();
          updateScoreDisplay();
          if (gameController.getGameOverType() === "win") {
            addAnimatedBar();
          }
          gameOverScreen();
        }
      }
    }
    cells.forEach((cell) => {
      cell.removeEventListener("click", (e) => clickBoard(e));
    });
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => clickBoard(e));
    });
  }

  function restartButtonEventListener() {
    restartButton.addEventListener("click", () => {
      reset();
    });
  }
  function reset() {
    boardDiv.classList.add("animB");
    removeOverScreen();
    gameBoard.ResetBoard();
    gameController.runGame();
    gameController.resetCurrentPlayer();
    updateScoreBoxBorder();
    updateInfoDisplay();
    displayBoard();
    addCellsEventsListeners();
    removeAnimatedBar();
  }

  function playersNamesInputsEventListners() {
    player1Input.addEventListener("input", () => {
      gameController.player1.changeName(player1Input.value);
    });
    player2Input.addEventListener("input", () => {
      gameController.player2.changeName(player2Input.value);
    });
  }
  function updateScoreDisplay() {
    player1Score.textContent = gameController.player1.getScore();
    player2Score.textContent = gameController.player2.getScore();
  }

  function updateInfoDisplay() {
    let gameOver = gameController.getGameStatus();
    if (!gameOver) {
      let S = gameController.getCurrentPlayer().getSymbole();
      info.textContent = `${S} Turn`;
      info.classList.add("infoAnim");
    } else {
      info.textContent = `Game Over`;
      info.classList.add("infoAnim");
    }
  }

  function updateScoreBoxBorder() {
    let currentPlayer = gameController.getCurrentPlayer().getSymbole();
    if (currentPlayer === "X") {
      player1ScoreBox.classList.add("player1current");
      player2ScoreBox.classList.remove("player2current");
    } else {
      player2ScoreBox.classList.add("player2current");
      player1ScoreBox.classList.remove("player1current");
    }
  }

  function addAnimatedBar() {
    let lastWinningCombo = gameController.getWinningComboIndex();
    animatedBars.forEach((bar) => {
      if (bar.dataset.winningCombo == lastWinningCombo) {
        bar.classList.add("showBar");
      }
    });
  }
  function removeAnimatedBar() {
    let lastWinningCombo = gameController.getWinningComboIndex();
    animatedBars.forEach((bar) => {
      if (bar.dataset.winningCombo == lastWinningCombo) {
        bar.classList.remove("showBar");
      }
    });
  }

  function gameOverScreen() {
    let type = gameController.getGameOverType();
    if (type == "win") {
      let winnerSymbol = gameController.getGameWinner().getSymbole();
      if (winnerSymbol === "X") {
        winningAnimX.classList.add("show");
      } else if (winnerSymbol === "O") {
        winningAnimO.classList.add("show");
      }
    } else {
      winningAnimDraw.classList.add("show");
    }
  }

  function removeOverScreen() {
    winningAnimX.classList.remove("show");
    winningAnimO.classList.remove("show");
    winningAnimDraw.classList.remove("show");
  }

  displayBoard();
  updateScoreBoxBorder();
  addCellsEventsListeners();
  restartButtonEventListener();
  playersNamesInputsEventListners();
})();
