const gameBoard = (() => {
  const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  return board;
})();

const displayController = (() => {
  const updateDisplay = (board) => {
    gameBoard.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellElement = document.querySelector(`[data-row="${rowIndex}"] [data-cell="${cellIndex}"]`);
        cellElement.innerText = cell;
        cellElement.classList.add(cellElement.innerText == 'X' ? 'red' : 'blue');
      });
    });
  };
  return { updateDisplay };
})();

const player = (marker) => {
  return { marker };
}

const player1 = player('X');
const player2 = player('O');

