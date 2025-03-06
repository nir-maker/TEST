let quizData = [];
let currentQuestion = 0;
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const resultEl = document.getElementById('result');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameContainer = document.getElementById('gameContainer');

// לחיצה על כפתור "התחל משחק"
startBtn.addEventListener('click', () => {
  startGame();
});

// לחיצה על כפתור "התחל מחדש"
restartBtn.addEventListener('click', () => {
  restartGame();
});

// הפעלת המשחק לראשונה
function startGame() {
  startBtn.style.display = 'none';
  gameContainer.style.display = 'block';
  restartBtn.style.display = 'none';
  currentQuestion = 0;
  loadQuestion();
}

// אתחול מחדש של המשחק
function restartGame() {
  currentQuestion = 0;
  resultEl.textContent = "";
  restartBtn.style.display = 'none';
  gameContainer.style.display = 'block';
  loadQuestion();
}

// טעינת השאלה הנוכחית
function loadQuestion() {
  answersEl.innerHTML = "";
  resultEl.innerHTML = "";

  let q = quizData[currentQuestion];
  questionEl.textContent = q.question;

  q.options.forEach((option, index) => {
    let button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => {
      checkAnswer(index);
    });
    answersEl.appendChild(button);
  });
}

// בדיקת התשובה והפעלת צלילים
function checkAnswer(selectedIndex) {
  let q = quizData[currentQuestion];
  const soundCorrect = document.getElementById('sound-correct');
  const soundWrong = document.getElementById('sound-wrong');

  if (selectedIndex === q.correct_answer) {
    resultEl.textContent = "נכון!";
    soundCorrect.currentTime = 0;
    soundCorrect.play();
  } else {
    resultEl.textContent = "טעות! התשובה הנכונה היא: " + q.options[q.correct_answer];
    soundWrong.currentTime = 0;
    soundWrong.play();
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      questionEl.textContent = "סיימת את המשחק!";
      answersEl.innerHTML = "";
      restartBtn.style.display = 'inline-block';
    }
  }, 1500);
}

// טעינת קובץ ה-JSON עם מניעת מטמון ובדיקת שגיאות
fetch('https://raw.githubusercontent.com/nir-maker/TEST/main/questions.json?v=' + new Date().getTime())
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP error, status = ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    // התאמה למבנה הקובץ
    quizData = data.questions;
    // המשחק יתחיל כאשר המשתמש ילחץ על "התחל משחק"
  })
  .catch(error => {
    console.error('שגיאה בטעינת JSON:', error);
    questionEl.textContent = "אירעה שגיאה בטעינת השאלות: " + error.message;
  });
