let originboard;
const humanPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  originboard = Array.from(Array(25).keys());
  // console.log(board);
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  // console.log(square.target.id);
  if (typeof originboard[square.target.id] == "number") {
    turn(square.target.id, humanPlayer);
    if (!checkWin(originboard, humanPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  originboard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(originboard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let play = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []); //reduce method is (a-e)-i
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    //entries method is key/value pairs
    if (win.every(element => play.indexOf(element) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return originboard.filter(s => typeof s == 'number');
}

function bestSpot() {
  return minimax(originboard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false); //game over
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -100 };
  } else if (checkWin(newBoard, aiPlayer)) {
    //if aiPlayer win
    return { score: 100 };
  } else if (availSpots.length === 0) {
    //no more square room to play
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
