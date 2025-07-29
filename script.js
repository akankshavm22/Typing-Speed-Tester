const wordBank = [
  "sun", "moon", "bright", "sky", "code", "jump", "laugh", "dream", "cloud",
  "type", "speed", "banana", "chair", "school", "hero", "movie", "fun", "magic",
  "light", "power", "space", "world", "smile", "charm", "energy"
];

let time = 30;
let timer;
let wordIndex = 0;
let correctWords = 0;
let totalTyped = 0;
let isGameRunning = false;

const timerEl = document.getElementById("timer");
const wordsEl = document.getElementById("words");
const input = document.getElementById("input");
const cwEl = document.getElementById("cw");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const toggleDark = document.getElementById("toggle-dark");

// Sounds
const typeSound = new Audio("sounds/type.mp3");
const correctSound = new Audio("sounds/correct.mp3");
const endSound = new Audio("sounds/end.mp3");

toggleDark.onclick = () => {
  document.body.classList.toggle("dark");
};

function generateWords(count = 30) {
  const words = [];
  for (let i = 0; i < count; i++) {
    const rand = wordBank[Math.floor(Math.random() * wordBank.length)];
    words.push(rand);
  }
  return words;
}

let gameWords = [];

function renderWords() {
  wordsEl.innerHTML = gameWords
    .map((w, i) => `<span class="word ${i === wordIndex ? "highlight" : ""}">${w}</span>`)
    .join(" ");
}

function startGame() {
  clearInterval(timer);
  time = 30;
  wordIndex = 0;
  correctWords = 0;
  totalTyped = 0;
  isGameRunning = true;
  input.disabled = false;
  input.value = "";
  gameWords = generateWords();
  cwEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  timerEl.textContent = time;

  renderWords();

  timer = setInterval(() => {
    time--;
    timerEl.textContent = time;
    if (time === 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  input.disabled = true;
  isGameRunning = false;
  endSound.play();
}

input.addEventListener("input", () => {
  if (!isGameRunning) return;

  const current = gameWords[wordIndex];
  const typed = input.value.trim();

  typeSound.currentTime = 0;
  typeSound.play();

  if (typed === current && input.value.endsWith(" ")) {
    correctWords++;
    wordIndex++;
    totalTyped++;
    correctSound.play();
    input.value = "";
  } else if (input.value.endsWith(" ")) {
    totalTyped++;
    wordIndex++;
    input.value = "";
  }

  cwEl.textContent = correctWords;
  const wpm = Math.round((correctWords / (30 - time)) * 60) || 0;
  const accuracy = totalTyped ? Math.round((correctWords / totalTyped) * 100) : 100;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = `${accuracy}%`;

  if (wordIndex >= gameWords.length) {
    endGame();
  }

  renderWords();
});

window.onload = startGame;
