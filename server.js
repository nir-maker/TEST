// script.js

// מערך שאלות שיטען מהשרת (דינמי)
let questions = [];

async function loadQuestions() {
  try {
    const response = await fetch('http://localhost:3000/api/questions');
    questions = await response.json();
    startGame(); // אתחול המשחק לאחר טעינת השאלות
  } catch (error) {
    console.error('שגיאה בטעינת השאלות:', error);
    alert('לא הצלחנו לטעון את השאלות. אנא נסה שוב מאוחר יותר.');
  }
}

let currentQuestionIndex = 0;
let score = 0;

// הפניות למסכי המשחק
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const finalScreen = document.getElementById("final-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionTextEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const questionImageEl = document.getElementById("question-image");
const resultMessageEl = document.getElementById("result-message");

// אינדיקטור התקדמות
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

// נגן השמע
const backgroundAudio = document.getElementById("background-audio");

// צלילים לתשובות נכונות ושגויות
const correctSound = new Audio("https://actions.google.com/sounds/v1/cartoon/ta_da.ogg");
const wrongSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");

// מאזינים לאירועים
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartGame);

function startGame() {
  startScreen.style.display = "none";
  currentQuestionIndex = 0;
  score = 0;
  updateProgress();

  // אתחול נגן השמע לשאלה הראשונה
  backgroundAudio.src = questions[currentQuestionIndex].audio;
  backgroundAudio.play();
  
  showQuestion();
}

function showQuestion() {
  updateProgress();
  resultScreen.style.display = "none";
  questionScreen.style.display = "block";
  
  const currentQuestion = questions[currentQuestionIndex];
  questionTextEl.textContent = currentQuestion.questionText;
  questionImageEl.src = currentQuestion.image;
  
  // ניקוי אפשרויות קודמות והצגת האפשרויות החדשות
  choicesEl.innerHTML = "";
  currentQuestion.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.addEventListener("click", () => checkAnswer(index, btn));
    choicesEl.appendChild(btn);
  });
}

function updateProgress() {
  progressText.textContent = `שאלה ${currentQuestionIndex + 1} מתוך ${questions.length}`;
  progressBar.value = currentQuestionIndex + 1;
}

function checkAnswer(selectedIndex, btnElement) {
  const buttons = choicesEl.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  if (selectedIndex === currentQuestion.correct) {
    score++;
    btnElement.classList.add("correct");
    correctSound.play();
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  } else {
    btnElement.classList.add("wrong");
    wrongSound.play();
    resultMessageEl.textContent = "תשובה לא נכונה.";
    questionScreen.style.display = "none";
    resultScreen.style.display = "block";
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    backgroundAudio.src = questions[currentQuestionIndex].audio;
    backgroundAudio.play();
    showQuestion();
  } else {
    showFinalScreen();
  }
}

function showFinalScreen() {
  resultScreen.style.display = "none";
  finalScreen.style.display = "block";
  
  finalScreen.querySelector("p").textContent =
    `סיימת את המשחק! מספר התשובות הנכונות: ${score} מתוך ${questions.length}.`;
  
  // אפשר לעצור את נגן השמע במידת הצורך:
  // backgroundAudio.pause();
}

function restartGame() {
  finalScreen.style.display = "none";
  startScreen.style.display = "block";
}

// קריאה ראשונית לטעינת השאלות מה-API
loadQuestions();
