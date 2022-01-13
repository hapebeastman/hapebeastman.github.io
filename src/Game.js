import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let tileMap = new TileMap(tileSize);
let pacman = tileMap.getPacman(velocity);
let enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("sounds/gameOver.wav");
const gameWinSound = new Audio("sounds/gameWin.wav");

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function restart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tileMap = new TileMap(tileSize);
  pacman = tileMap.getPacman(velocity);
  enemies = tileMap.getEnemies(velocity);
  gameOver = false;
  gameWin = false;
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = " You Win!";
    if (gameOver) {
      text = "Game Over";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 100);

    ctx.font = "75px comic sans";
    //const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    //gradient.addColorStop("0", "magenta");
    //gradient.addColorStop("0.5", "blue");
    //gradient.addColorStop("1.0", "red");

    ctx.fillStyle = "white";
    ctx.fillText(text, canvas.width / 4, canvas.height / 3.2 + 80);
  }
}

const checkRestart = (event) => {
  // restart
  if (event.keyCode == 82) {
    restart();
  }
};

document.addEventListener("keydown", checkRestart);
tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);