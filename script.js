let questions = [];           // כאן יישמרו השאלות מה-JSON
let currentQuestionIndex = 0; // אינדקס השאלה הנוכחית
let score = 0;                // ניקוד (כמה תשובות נכונות)
const totalQuestions = 3;     // נסמן כמה שאלות יש. (לא חובה - ניתן להסיק מאורך המערך)

// בחירת אלמנטים מה-HTML
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextBtn = document.getElementById('nextBtn');
const resultElement = document.getElementById('result');

// שליפת השאלות מקובץ ה-JSON
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    // נוודא שיש שאלות לפני שמתחילים
    if (questions.length > 0) {
      showQuestion();
    } else {
      questionElement.textContent = "לא נמצאו שאלות";
    }
  })
  .catch(error => {
    console.error("Error loading questions:", error);
    questionElement.textContent = "שגיאה בטעינת השאלות.";
  });

// פונקציה להצגת שאלה
function showQuestion() {
  // ניקוי/הסתרה של תוצאה קודמת (אם הייתה)
  resultElement.classList.add('hidden');

  // קבלת השאלה הנוכחית
  const currentQuestion = questions[currentQuestionIndex];

  // הצגת טקסט השאלה
  questionElement.textContent = currentQuestion.question;

  // ריקון רשימת התשובות הקודמת
  answersElement.innerHTML = "";

  // יצירת כפתורים לכל תשובה
  currentQuestion.answers.forEach((answer, index) => {
    const li = document.createElement('li');
    li.textContent = answer;
    li.addEventListener('click', () => {
      handleAnswer(index);
    });
    answersElement.appendChild(li);
  });
}

// פונקציה לטיפול בבחירת תשובה
function handleAnswer(selectedIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  // בדיקת תשובה נכונה
  if (selectedIndex === currentQuestion.correctIndex) {
    score++;
    alert("תשובה נכונה!");
  } else {
    alert("תשובה שגויה!");
  }
  
  // לאחר בחירת תשובה, עוברים לשאלה הבאה
  goToNextQuestion();
}

// פונקציה למעבר לשאלה הבאה
function goToNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// פונקציה לסיום החידון
function endQuiz() {
  // הסתרת החידון
  questionElement.textContent = "";
  answersElement.innerHTML = "";
  nextBtn.style.display = "none";

  // הצגת התוצאה
  resultElement.textContent = `סיימת את החידון! הציון שלך: ${score} מתוך ${questions.length}`;
  resultElement.classList.remove('hidden');
}

// כפתור "שאלה הבאה" (אם תרצה לדלג ידנית)
nextBtn.addEventListener('click', goToNextQuestion);
