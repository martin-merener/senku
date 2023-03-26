


const cellSize = 50;
const backgroundColor = [255, 255, 255];
const pegColor = [50, 50, 50];
const emptyColor = [200, 200, 200];
const borderColor = [100, 100, 100];
const fontColor = [0, 0, 0];


class Senku {
  constructor() {
    this.board = [
      [2, 2, 1, 1, 1, 2, 2],
      [2, 2, 1, 1, 1, 2, 2],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [2, 2, 1, 1, 1, 2, 2],
      [2, 2, 1, 1, 1, 2, 2],
    ];
  }

  is_valid_move(x1, y1, x2, y2) {
    if (this.board[y1][x1] !== 1 || this.board[y2][x2] !== 0) {
      return false;
    }

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    if ((dx === 2 && dy === 0) || (dx === 0 && dy === 2)) {
      const xMiddle = Math.floor((x1 + x2) / 2);
      const yMiddle = Math.floor((y1 + y2) / 2);
      return this.board[yMiddle][xMiddle] === 1;
    }

    return false;
  }

  make_move(x1, y1, x2, y2) {
    if (this.is_valid_move(x1, y1, x2, y2)) {
      this.board[y1][x1] = 0;
      this.board[y2][x2] = 1;
      this.board[Math.floor((y1 + y2) / 2)][Math.floor((x1 + x2) / 2)] = 0;
      return true;
    }
    return false;
  }

  has_moves() {
    for (let y1 = 0; y1 < this.board.length; y1++) {
      for (let x1 = 0; x1 < this.board[y1].length; x1++) {
        for (const dy of [-2, 2]) {
          const y2 = y1 + dy;
          if (y2 >= 0 && y2 < this.board.length && this.is_valid_move(x1, y1, x1, y2)) {
            return true;
          }
        }
        for (const dx of [-2, 2]) {
          const x2 = x1 + dx;
          if (x2 >= 0 && x2 < this.board[y1].length && this.is_valid_move(x1, y1, x2, y1)) {
            return true;
          }
        }
      }
    }

    return false;
  }

}


let game = new Senku();
let movingPeg = null;
let canvas;

function setup() {
  game = new Senku();
  canvas = createCanvas(game.board[0].length * cellSize, game.board.length * cellSize);
  canvas.parent('game-container');
  canvas.hide(); // Add this line to hide the canvas initially
}

function initializeGame() {
  game = new Senku();
  canvas = createCanvas(game.board[0].length * cellSize, game.board.length * cellSize);
  canvas.parent('game-container');
  canvas.show();
  loop();
}

function draw() {
  background(backgroundColor);

  for (let y = 0; y < game.board.length; y++) {
    for (let x = 0; x < game.board[y].length; x++) {
      const cell = game.board[y][x];
      if (cell !== 2) {
        fill(cell === 1 ? pegColor : emptyColor);
        stroke(borderColor);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  if (!game.has_moves()) {
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(fontColor);
    text(`INSERT COIN!`, width / 2, height / 2);
    noLoop();
  }
}


let isDragging = false;

function mousePressed() {
  if (!game) return;

  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);

  if (x >= 0 && x < game.board[0].length && y >= 0 && y < game.board.length) {
    const cell = game.board[y][x];
    if (cell === 1) {
      selectedPeg = { x, y };
      isDragging = true;
    }
  }
}

function mouseReleased() {
  if (!game || !isDragging) return;

  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);

  if (x >= 0 && x < game.board[0].length && y >= 0 && y < game.board.length) {
    const cell = game.board[y][x];
    if (cell === 0) {
      const dx = Math.abs(selectedPeg.x - x);
      const dy = Math.abs(selectedPeg.y - y);
      if ((dx === 2 && dy === 0) || (dx === 0 && dy === 2)) {
        const middleX = (selectedPeg.x + x) / 2;
        const middleY = (selectedPeg.y + y) / 2;
        if (game.board[middleY][middleX] === 1) {
          game.make_move(selectedPeg.x, selectedPeg.y, x, y);
        }
      }
    }
  }

  isDragging = false;
  selectedPeg = null;
}

function mouseDragged() {
  if (!game || !isDragging) return;
  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);

  if (x >= 0 && x < game.board[0].length && y >= 0 && y < game.board.length) {
    const cell = game.board[y][x];
    if (cell === 0) {
      const dx = Math.abs(selectedPeg.x - x);
      const dy = Math.abs(selectedPeg.y - y);
      if ((dx === 2 && dy === 0) || (dx === 0 && dy === 2)) {
        const middleX = (selectedPeg.x + x) / 2;
        const middleY = (selectedPeg.y + y) / 2;
        if (game.board[middleY][middleX] === 1) {
          game.make_move(selectedPeg.x, selectedPeg.y, x, y);
          selectedPeg = { x, y };
        }
      }
    }
  }
}


function touchStarted() {
  mousePressed();
}

function touchMoved() {
  mouseDragged();
  return false; // Prevents default scrolling behavior on mobile devices
}

function touchEnded() {
  mouseReleased();
}


function mouseClicked() {
  if (!game) return;

  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);

  if (x >= 0 && x < game.board[0].length && y >= 0 && y < game.board.length) {
    const cell = game.board[y][x];
    if (selectedPeg && cell === 0) {
      const dx = Math.abs(selectedPeg.x - x);
      const dy = Math.abs(selectedPeg.y - y);
      if ((dx === 2 && dy === 0) || (dx === 0 && dy === 2)) {
        const middleX = (selectedPeg.x + x) / 2;
        const middleY = (selectedPeg.y + y) / 2;
        if (game.board[middleY][middleX] === 1) {
          game.make_move(selectedPeg.x, selectedPeg.y, x, y);
          selectedPeg = null;
        }
      }
    } else if (cell === 1) {
      selectedPeg = { x, y };
    }
  }
}



