const elements = [];
const arr = [];
let wallIsSolved = false;
let currIndex = 0;
let currRow = 1;
let livesIndex = 0;
let interval = null;
let container = document.querySelector(".container");
const button = document.querySelector(".timeAndLives button");
const lives = document.querySelectorAll(".live");
const lives_container = document.querySelector(".lives_container");
const delay = 300;
const animationLength = 300;
const rowLength = 4;
const numOfGridElements = 16;

container.classList.add("fixed");

for (let i = 0; i < numOfGridElements; i++) {
  const element = document.createElement("div");
  element.classList.add("box");
  element.classList.add(`box_${i + 1}`);
  element.textContent = `${wall[parseInt(i / rowLength)][i % rowLength]}`;
  elements.push(element);
}

shuffle(elements);
elements.forEach((element) => container.appendChild(element));

async function select(e) {
  const target = e.target;
  const list = target.classList;
  if (list.contains("highlight")) {
    arr.splice(arr.indexOf(target), 1);
    list.remove("highlight");
  } else {
    arr.push(target);
    list.add("highlight");
  }
  if (arr.length == rowLength) {
    await sleep(delay);
    const checkArr = arr.map((a) => a.innerText);
    const correct = checkRow(checkArr);
    if (correct) {
      for (let i = 0; i < 4; i++) {
        await swap(elements[currIndex++], arr[i]);
      }
    } else if (currRow >= 3) {
      lives[livesIndex++].classList.add("lost_live");
      if (livesIndex >= 3) {
        clearInterval(interval);
        container.classList.add("fixed");
        arr.forEach((a) => {
          a.classList.remove("highlight");
        });
        window.alert("You are out of guess");
        return;
      }
    }
    fixRow(arr, currRow, correct);
    if (correct) currRow++;
    if (currRow == 3) lives_container.classList.add("show");
    arr.splice(0, rowLength);
    if (currIndex + rowLength == numOfGridElements) {
      fixRow(elements.slice(currIndex, currIndex + 4), currRow, true);
      wallIsSolved = true;
      window.alert("Congrats!! You have solved the wall!!!");
    }
  }
}

async function swap(elem1, elem2) {
  container.classList.add("fixed");
  const rect0 = elem1.getBoundingClientRect();
  const rect1 = elem2.getBoundingClientRect();
  const top0 = rect0.top;
  const top1 = rect1.top;
  const left0 = rect0.left;
  const left1 = rect1.left;
  const above = top0 <= top1;
  const left = left0 <= left1;
  const diffX = Math.abs(top0 - top1);
  const diffY = Math.abs(left0 - left1);
  elem1.setAttribute(
    "style",
    `transform: translate(${left ? "" : "-"}${diffY}px, ${
      above ? "" : "-"
    }${diffX}px); transition: background-color ${animationLength}ms, transform ${animationLength}ms`
  );

  elem2.setAttribute(
    "style",
    `transform: translate(${left ? "-" : ""}${diffY}px, ${
      above ? "-" : ""
    }${diffX}px); transition: background-color ${animationLength}ms, transform ${animationLength}ms`
  );
  await sleep(delay);
  elem1.removeAttribute("style");
  elem2.removeAttribute("style");
  const temp = elem1;
  const index1 = elements.indexOf(elem1);
  const index2 = elements.indexOf(elem2);
  elements[index1] = elem2;
  elements[index2] = temp;
  const nextContainer = newContainer(elements);
  container.replaceWith(nextContainer);
  container = nextContainer;
}

function shuffle(arr) {
  arr.forEach((a, i) => {
    const rand = Math.floor(Math.random() * arr.length);
    const temp = arr[i];
    arr[i] = arr[rand];
    arr[rand] = temp;
  });
}

function checkRow(arr) {
  let valid = true;
  for (let i = 0; i < wall.length; i++) {
    const row = wall[i];
    for (let i = 0; i < arr.length; i++) {
      if (row.indexOf(arr[i]) < 0) {
        valid = false;
        break;
      }
    }
    if (valid) return true;
    valid = true;
  }
  return false;
}

function newContainer(elements) {
  const newContainer = document.createElement("div");
  newContainer.classList.add("container");
  elements.forEach((element) => {
    newContainer.appendChild(element);
  });
  return newContainer;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fixRow(arr, currRow, correct) {
  arr.forEach((a) => {
    a.classList.remove("highlight");
    if (correct) {
      a.classList.add("fixed", `row_${currRow}`);
    }
  });
}

function startTimer(duration, display) {
  container.classList.remove("fixed");
  let timer = duration,
    minutes,
    seconds;
  interval = setInterval(() => {
    if (wallIsSolved) {
      clearInterval(interval);
      return;
    }
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      container.classList.add("fixed");
      clearInterval(interval);
      window.alert("Time up!!");
      return;
    }
  }, 1000);
}

window.onload = () => {};

elements.forEach((element) => {
  element.addEventListener("click", select);
});

button.addEventListener("click", (e) => {
  console.log("clicked");
  let threeMinutes = 60 * 3;
  display = document.querySelector("#time");
  button.classList.add("fixed");
  startTimer(threeMinutes, display);
});
