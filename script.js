let originboard;
const humanPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

const cells = document.querySelectorAll(".cell");
startGame();

// function selectSystem(sym) {
//   humanPlayer = sym;
//   aiPlayer = sym === "O" ? "X" : "O";
//   originboard = Array.from(Array(25).keys());
//   for (let i = 0; i < cells.length; i++) {
//     cells[i].addEventListener("click", turnClick, false);
//   }
//   if (aiPlayer === "X") {
//     turn(bestSpot(), aiPlayer);
//   }
//   document.querySelector(".selectSystem").style.display = "none";
// }

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  // document.querySelector(".endgame  .text").innerText = "";
  // document.querySelector(".selectSystem").style.display = "block";


  // for (let i = 0; i < cells.length; i++) {
  //   cells[i].innerText = "";
  //   cells[i].style.removeProperty("background-color");
  // }
  originboard = Array.from(Array(9).keys());
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
  // document.getElementById(squareId).innerHTML = player;
  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(originboard, player);
  if (gameWon) gameOver(gameWon);
  // checkTie();
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
  // return originboard.filter((elm, i) => i === elm);
  return originboard.filter(s => typeof s == 'number');
}

//-----------ERROR--------------
function bestSpot() {
  // return emptySquares()[0];
  return minimax(originboard, aiPlayer).index;
}

function checkTie() {
  // if (emptySquares().length === 0) {
  //   for (cell of cells) {
  //     cell.style.backgroundColor = "green";
  //     cell.removeEventListener("click", turnClick, false); //game over
  //   }
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "pink";
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
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    //if aiPlayer win
    return { score: 10 };
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

    //     if (
    //       (player === aiPlayer && move.score === 10) ||
    //       (player === humanPlayer && move.score === -10)
    //     )
    //       return move;
    //     else moves.push(move);
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
