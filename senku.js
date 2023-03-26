const cellSize = 50;
const backgroundColor = [255, 255, 255];
const pegColor = [50, 50, 50];
const emptyColor = [200, 200, 200];
const borderColor = [100, 100, 100];
const fontColor = [0, 0, 0];

let game;
let movingPeg = null;
let canvas;

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


  calculate_score() {
    const pegsLeft = this.board.reduce((count, row) => count + row.filter(cell => cell === 1).length, 0);

    let score = 0;
    if (pegsLeft === 1 && this.board[3][3] === 1) {
      score = 100;
    } else if (pegsLeft === 1) {
      score = 75;
    } else if (pegsLeft === 2) {
      score = 50;
    } else if (pegsLeft === 3) {
      score = 25;
    } else if (pegsLeft === 4) {
      score = 10;
    } else if (pegsLeft === 5) {
      score = 5;
    } else if (pegsLeft === 6) {
      score = 1;
    }
    return score;
  }
}

function setup() {
  game = new Senku();
  canvas = createCanvas(game.board[0].length * cellSize, game.board.length * cellSize);
  canvas.parent('senku-game');
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
    const score = game.calculate_score();
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(fontColor);
    text(`Game finished! Score: ${score}`, width / 2, height / 2);
    noLoop();
  }
}

function mouseClicked() {
  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);

  if (game.board[y][x] === 1 && movingPeg === null) {
    movingPeg = { x, y };
  } else if (movingPeg !== null) {
    if (game.make_move(movingPeg.x, movingPeg.y, x, y)) {
      redraw();
    }
    movingPeg = null;
  }
}


function startGame() {
  game = new Senku();
  canvas = createCanvas(cellSize * 7, cellSize * 7);
  canvas.parent("game-container");