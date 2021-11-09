function player(marker) {
  return { marker };
}

const player1 = player('X');
const player2 = player('O');

const gameBoard = (() => {
  const originalBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  
  const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  let gameOver = false;

  const resetBoard = () => {
    board.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        board[rowIndex][cellIndex] = originalBoard[rowIndex][cellIndex];
      });
    });
  };

  const addPiece = (piece, row, col) => {
    if (board[row][col] === '' && !gameOver) {
      board[row][col] = piece;
      displayController.updateDisplay(board);
    }
  };

  return { board, gameOver, resetBoard, addPiece };
})();

const displayController = (() => {
  const updateDisplay = (board) => {
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellElement = document.querySelector(`[data-row="${rowIndex}"] [data-cell="${cellIndex}"]`);
        cellElement.innerText = cell;
        if (cellElement.innerText !== '') {
          cellElement.classList.add(cellElement.innerText === 'X' ? 'red' : 'blue');
        }
      });
    });
  };
  return { updateDisplay };
})();

const gameController = (() => {
  let currentPlayer = player1;
  const resetButton = document.querySelector('#reset');

  const resetElements = () => {
    const playerDisplay = document.querySelector('#current-player');
    playerDisplay.innerText = 'Player 1';
    currentPlayer = player1;
    gameBoard.resetBoard();
    gameBoard.board.forEach((row, rowIndex) => {
      row.forEach((_cell, cellIndex) => {
        const cellElement = document.querySelector(`[data-row="${rowIndex}"] [data-cell="${cellIndex}"]`);
        cellElement.innerText = '';
        cellElement.classList.remove('red', 'blue');
        cellElement.addEventListener('click', (e) => {
          const cell = e.target;
          const rowNum = cell.parentElement.dataset.row;
          const colNum = cell.dataset.cell;
          const player = gameController.getCurrentPlayer();
          if (cell.innerHTML === '' && !gameBoard.gameOver) {
            gameBoard.addPiece(currentPlayer.marker, rowNum, colNum);
            gameController.switchPlayer();
            gameController.checkWinner(gameBoard.board);
          }
        });
      });
    });
  };

  resetButton.addEventListener('click', resetElements);

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    const playerDisplay = document.querySelector('#current-player');
    playerDisplay.innerText = currentPlayer == player1 ? 'Player 2' : 'Player 1';
  };

  const getCurrentPlayer = () => { return currentPlayer };

  const checkWinner = () => {
    const winner = checkForWinner(gameBoard.board);
    if (winner) {
      gameBoard.gameOver = true;
      alert(`${winner} wins!`);
    }
  };

  const checkForWinner = (board) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let flattenedBoard = gameBoard.board.flat();
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (flattenedBoard[a] !== '' && flattenedBoard[a] === flattenedBoard[b] && flattenedBoard[a] === flattenedBoard[c]) {
        return flattenedBoard[a];
      }
    }

    return false;
  };

  return { getCurrentPlayer, switchPlayer, checkWinner, resetElements };
})();
