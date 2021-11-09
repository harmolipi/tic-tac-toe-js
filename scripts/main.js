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

  const resetBoard = () => {
    board.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        board[rowIndex][cellIndex] = originalBoard[rowIndex][cellIndex];
      });
    });
  };

  const setEventListeners = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        const cell = e.target;
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const player = game.getCurrentPlayer();
        if (cell.innerHTML === '') {
          cell.innerHTML = player;
          board[row][col] = player;
          game.switchPlayer();
          game.checkWinner();
        }
      });
    });
  };

  const addPiece = (piece, row, col) => {
    if (board[row][col] === '') {
      board[row][col] = piece;
      displayController.updateDisplay(board);
    }
  };

  return { board, resetBoard, addPiece };
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
          if (cell.innerHTML === '') {
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
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (board[a][0] !== '' && board[a][0] === board[b][0] && board[a][0] === board[c][0]) {
        return board[a][0];
      }
    }
    return false;
  };

  return { getCurrentPlayer, switchPlayer, checkWinner, resetElements };
})();
