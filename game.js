const Model = (() => {
  let score = 0;
  let timeLeft = 30;
  let board = [];

  function createBoard() {
    board = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      hasMole: false,
      hasSnake: false,
    }));
  }

  function getBoard() {
    return board;
  }

  function getScore() {
    return score;
  }

  function setScore(val) {
    score = val;
  }

  function getTime() {
    return timeLeft;
  }

  function setTime(val) {
    timeLeft = val;
  }

  return {
    createBoard,
    getBoard,
    getScore,
    setScore,
    getTime,
    setTime,
  };
})();

const View = (() => {
  function renderBoard(board) {
    const moleImgs = document.querySelectorAll(".hole .mole");
    const snakeImgs = document.querySelectorAll(".hole .snake");
    board.forEach((hole, i) => {
      moleImgs[i].style.visibility = hole.hasMole ? "visible" : "hidden";
      snakeImgs[i].style.visibility = hole.hasSnake ? "visible" : "hidden";
    });
  }
  function renderScore(score) {
    document.getElementById("score").textContent = score;
  }
  function renderTimer(timeLeft) {
    document.getElementById("timer").textContent = timeLeft;
  }
  function resetView() {
    renderScore(0);
    renderTimer(30);
    renderBoard(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        hasMole: false,
        hasSnake: false,
      }))
    );
  }
  return {
    renderBoard,
    renderScore,
    renderTimer,
    resetView,
  };
})();

const Controller = ((model, view) => {
  let moleInterval = null;
  let timerInterval = null;
  let snakeInterval = null;

  function startGame() {
    clearInterval(timerInterval);
    clearInterval(moleInterval);
    clearInterval(snakeInterval);

    model.createBoard();
    model.setScore(0);
    model.setTime(30);

    view.resetView();

    timerInterval = setInterval(() => {
      let t = model.getTime() - 1;
      model.setTime(t);
      view.renderTimer(t);
      if (t <= 0) {
        clearInterval(timerInterval);
        clearInterval(moleInterval);
        clearInterval(snakeInterval);
        alert("Time is Over!");
      }
    }, 1000);

    moleInterval = setInterval(() => {
      const board = model.getBoard();
      let moleCount = board.filter((b) => b.hasMole).length;
      if (moleCount < 3) {
        const emptyHoles = board.filter((b) => !b.hasMole);
        if (emptyHoles.length > 0) {
          const randomIdx = Math.floor(Math.random() * emptyHoles.length);
          const moleId = emptyHoles[randomIdx].id;
          board[moleId].hasMole = true;
          view.renderBoard(board);
          setTimeout(() => {
            board[moleId].hasMole = false;
            view.renderBoard(board);
          }, 2000);
        }
      }
    }, 1000);

    snakeInterval = setInterval(() => {
      model.getBoard().forEach((hole) => (hole.hasSnake = false));
      const rand = Math.floor(Math.random() * 12);
      model.getBoard()[rand].hasSnake = true;
      view.renderBoard(model.getBoard());
    }, 2000);
  }

  function addHoleListeners() {
    document.querySelectorAll(".hole").forEach((hole) => {
      hole.addEventListener("click", function () {
        const holeId = Number(this.getAttribute("data-id"));
        const board = model.getBoard();

        if (board[holeId].hasSnake) {
          board.forEach((hole) => (hole.hasSnake = true));
          view.renderBoard(board);

          clearInterval(timerInterval);
          clearInterval(moleInterval);
          clearInterval(snakeInterval);
          alert("Game Over!");
          return;
        }

        if (board[holeId].hasMole) {
          board[holeId].hasMole = false;
          model.setScore(model.getScore() + 1);
          view.renderScore(model.getScore());
          view.renderBoard(board);
        }
      });
    });
  }

  document.getElementById("start-btn").addEventListener("click", startGame);

  const init = () => {
    model.createBoard();
    view.resetView();
    addHoleListeners();
  };

  return { init };
})(Model, View);

Controller.init();
