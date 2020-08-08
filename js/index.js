document.addEventListener("DOMContentLoaded", (e) => {
  const container = document.querySelector(".container");
  let width = 10;
  let deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  let setWidth = deviceWidth > 850 ? "600px" : "350px";
  let setHeight = deviceWidth > 850 ? "200px" : "120px";
  // console.log(window.innerWidth +" : "+ screen.width);
  let bombCount = 30;
  let flags = 0;
  let playingSquares = [];
  let flagsLeft = document.querySelector("#flags-left");
  // flagsLeft.innerText=setWidth;
  let isGameOver = false;
  // function to create minsweeper board
  function createBoard() {
    const bombsArr = Array(bombCount).fill("bomb");
    const emptyArr = Array(width * width - bombCount).fill("valid");
    // console.log(bombsArr);
    // console.log(emptyArr);

    const gameArray = emptyArr.concat(bombsArr);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5); 
    // console.log(gameArray);
    for (let i = 0; i < width * width; i++) {
      let square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      container.appendChild(square);
      playingSquares.push(square);
      square.addEventListener("click", function (e) {
        click(square);
      });

      //adding flag with right click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }
    // console.log(playingSquares);

    //adding numbers to the squares
    for (let i = 0; i < playingSquares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      //   const isUpperEdge = i % width === width - 1;
      //   const isBottomEdge = i % width === width - 1;
      if (playingSquares[i].classList.contains("valid")) {
        if (
          i > 0 &&
          !isLeftEdge &&
          playingSquares[i - 1].classList.contains("bomb")
        )
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          playingSquares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > 10 && playingSquares[i - width].classList.contains("bomb"))
          total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          playingSquares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (
          i < 98 &&
          !isRightEdge &&
          playingSquares[i + 1].classList.contains("bomb")
        )
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          playingSquares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          playingSquares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (i < 89 && playingSquares[i + width].classList.contains("bomb"))
          total++;
        playingSquares[i].setAttribute("data", total);
        // console.log(playingSquares[i]);
      }
    }
  }
  createBoard();

  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombCount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        flagsLeft.innerHTML = bombCount - flags;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        flagsLeft.innerHTML = bombAmount - flags;
      }
    }
  }

  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;

    if (square.classList.contains("bomb")) {
      gameOver();
    } else {
      let total = square.getAttribute("data");
      // console.log(total);
      if (total != 0) {
        square.classList.add("checked");
        // console.log(square);
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = playingSquares[parseInt(currentId) - 1].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = playingSquares[parseInt(currentId) + 1 - width].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = playingSquares[parseInt(currentId - width)].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = playingSquares[parseInt(currentId) - 1 - width].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = playingSquares[parseInt(currentId) + 1].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = playingSquares[parseInt(currentId) - 1 + width].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = playingSquares[parseInt(currentId) + 1 + width].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = playingSquares[parseInt(currentId) + width].id;

        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }
  function gameOver() {
    isGameOver = true;
    console.log("game over!");

    playingSquares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.classList.add("checked");
        square.innerHTML = "💣";
        square.style.background = "#a1adb0";
      }
      square.style.pointerEvents = "none";
    });

    const gameDiv = document.querySelector(".gameOver");

    gameDiv.style.width = setWidth;
    gameDiv.style.height = setHeight;
    gameDiv.children[0].innerText = "Ooooh 🙁 \nTry again 🔥";
    gameDiv.children[0].classList.add("animate");
  }
  document.querySelector(".start").addEventListener("click", (e) => {
    e.preventDefault();

    window.location.reload();
  });

  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < width * width; i++) {
      if (
        playingSquares[i].classList.contains("flag") &&
        playingSquares[i].classList.contains("bomb")
      ) {
        matches++;
      }
    }
    console.log(matches, bombCount);
    if (matches === bombCount) {
      const gameDiv = document.querySelector(".gameOver");

      gameDiv.style.width = setWidth;
      gameDiv.style.height = setHeight;
      gameDiv.children[0].innerText =
        "🥇🥇🎉 Hurrrraayyy!! 🎉🥇🥇🎉 \nPlay again 🔥";
      gameDiv.children[0].classList.add("animate");
    }
  }
});
