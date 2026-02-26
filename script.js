const gameBoard = (function () {
  let board = [null, null, null, null, null, null, null, null, null];
  const allowedSymboles = ["X", "O"];

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
  function checkEmpty(index) {
    if (board[index]) {
      return false;
    } else {
      return true;
    }
  }

  function addMove(symbol, index) {
    if (checkEmpty() && allowedSymboles.includes(symbol)) {
      board[index] = symbol;
      return true;
    } else {
      return false;
    }
  }
  function ResetBoard() {
    board.splice(0, board.length + 1, ...new Array(9).fill(null));
  }

  function checkWin() {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }
  function checkDraw() {
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
  }

  function showBoard() {
    return `${board[0]},${board[1]},${board[2]},
${board[3]},${board[4]},${board[5]},
${board[6]},${board[7]},${board[8]}
        `;
  }
  return { addMove, ResetBoard, checkWin, checkDraw, showBoard };
})();
