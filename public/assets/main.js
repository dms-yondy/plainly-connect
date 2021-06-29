const elements = [];
const arr = [];
let currIndex = 0;
let currRow = 1;
let container = document.querySelector(".container");
const delay = 300;
const animationLength = 300;
const rowLength = 4;
const numOfGridElements = 16;

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
    }
    await fixRow(arr, currRow, correct);
    if (correct) currRow++;
    arr.splice(0, rowLength);
    if (currIndex + rowLength == numOfGridElements) {
      await fixRow(elements.slice(currIndex, currIndex + 4), currRow, true);
      window.alert("Congrats!! You have solved the wall!!!");
    }
  }
}

async function swap(elem1, elem2) {
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

async function fixRow(arr, currRow, correct) {
  arr.forEach((a) => {
    a.classList.remove("highlight");
    if (correct) {
      a.classList.add("fixed", `row_${currRow}`);
    }
  });
}

elements.forEach((element) => {
  element.addEventListener("click", select);
});
