function createBoard() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    hasMole: false,
  }));
}

let board = createBoard();
console.log(board);

function renderBoard(board) {
  const imgs = document.querySelectorAll(".hole img");
  board.forEach((hole, i) => {
    imgs[i].style.visibility = hole.hasMole ? "visible" : "hidden";
  });
}

let moleInterval = setInterval(() => {
  let moleCount = board.filter((b) => b.hasMole).length;

  if (moleCount < 3) {
    const emptyHoles = board.filter((b) => !b.hasMole);
    if (emptyHoles.length > 0) {
      const randomIdx = Math.floor(Math.random() * emptyHoles.length);
      const moleId = emptyHoles[randomIdx].id;
      board[moleId].hasMole = true;
      renderBoard(board);
    }
  }
}, 1000);

let score = 0;

document.querySelectorAll(".hole").forEach((hole) => {
  hole.addEventListener("click", function () {
    const holeId = Number(this.getAttribute("data-id"));

    if (board[holeId].hasMole) {
      board[holeId].hasMole = false;
      score++;
      renderBoard(board);
      document.getElementById("score").textContent = score;
    }
  });
});

let timeLeft = 30;
document.getElementById("timer").textContent = timeLeft;
let timerInterval = setInterval(() => {
  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    clearInterval(moleInterval);
    alert("Time is Over!");
  }
}, 1000);

document.getElementById("start-btn").addEventListener("click", function () {
  clearInterval(timerInterval);
  clearInterval(moleInterval);

  board = createBoard();
  score = 0;
  timeLeft = 30;

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;
  renderBoard(board);

  moleInterval = setInterval(() => {
    let moleCount = board.filter((b) => b.hasMole).length;
    if (moleCount < 3) {
      const emptyHoles = board.filter((b) => !b.hasMole);
      if (emptyHoles.length > 0) {
        const randomIdx = Math.floor(Math.random() * emptyHoles.length);
        const moleId = emptyHoles[randomIdx].id;
        board[moleId].hasMole = true;
        renderBoard(board);
      }
    }
  }, 1000);

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(moleInterval);
      alert("Time is Over!");
    }
  }, 1000);
});
