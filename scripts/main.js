function player(marker, name) {
  return { marker, name };
}

const player1 = player('X', 'Player 1');
const player2 = player('O', 'Player 2');
const players = [player1, player2];

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

  const addPiece = (player, row, col) => {
    if (board[row][col] === '' && !gameController.gameOver) {
      board[row][col] = player;
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
        if (cellElement.innerText === '' && cell.marker !== undefined) {
          cellElement.innerText = cell.marker;
        }
        if(cellElement.innerText !== ''){
          cellElement.classList.add(cellElement.innerText === 'X' ? 'red' : 'blue');
        }
      });
    });
  };

  const setPlayerStatus = (player) => {
    const playerStatus = document.querySelector('#player-status');
    if(gameController.gameOver) {
      if(gameController.tie) {
        playerStatus.innerText = "It's a tie!";
        playerStatus.classList.remove('bg-yellow');
        playerStatus.classList.add('bg-light-blue');
      } else {
        playerStatus.innerText = `${player.name} wins!`;
        playerStatus.classList.remove('black', 'bg-yellow');
        playerStatus.classList.add('white', 'bg-green');
      }
    } else {
      playerStatus.innerText = `${player.name}'s turn`;
      playerStatus.classList.remove('white', 'bg-green');
      playerStatus.classList.add('black', 'bg-yellow');
    }
  };

  const changePlayerNames = document.querySelector('#change-player-names');
  
  changePlayerNames.addEventListener('click', (e) => {
    e.preventDefault();
    const playerInputs = document.querySelectorAll('.player-name-input');

    for(let i = 0; i < playerInputs.length; i++) {
      if (playerInputs[i].value !== '') {
        players[i].name = playerInputs[i].value;
      }
    }
    setPlayerStatus(gameController.getCurrentPlayer());
    updateDisplay(gameBoard.board);
  });

  return { updateDisplay, setPlayerStatus };
})();

const gameController = (() => {
  let gameOver = false;
  let tie = false;
  let currentPlayer = player1;
  const resetButton = document.querySelector('#reset');

  const resetElements = () => {
    currentPlayer = player1;
    gameController.gameOver = false;
    player1.name = 'Player 1';
    player2.name = 'Player 2';
    document.querySelector('#player-one-name-input').value = '';
    document.querySelector('#player-two-name-input').value = '';
    displayController.setPlayerStatus(currentPlayer);
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
          if (cell.innerHTML === '' && !gameOver) {
            gameBoard.addPiece(currentPlayer, rowNum, colNum);
            gameController.switchPlayer();
            gameController.checkWinner(gameBoard.board);
          }
        });
      });
    });
  };

  resetButton.addEventListener('click', resetElements);

  const switchPlayer = () => {
    if(!gameOver) {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    
    displayController.setPlayerStatus(currentPlayer);
  };

  const getCurrentPlayer = () => { return currentPlayer };

  const checkWinner = () => {
    const winner = checkForWinner(gameBoard.board);
    if (winner) {
      gameController.gameOver = true;
      displayController.setPlayerStatus(winner);
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
    if(flattenedBoard.every(cell => cell !== '')) {
      gameController.tie = true;
      return true;
    }
    return false;
  };

  return { gameOver, tie, getCurrentPlayer, switchPlayer, checkWinner, resetElements };
})();
