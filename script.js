let questions = [];           // כאן יישמרו השאלות מה-JSON
{
  "questions": [
    {
      "question": "מי היו שני בניו של אדם הראשון?",
      "options": [
        "קין והבל",
        "נוח ושם",
        "אברהם ויצחק",
        "יעקב ועשיו"
      ],
      "correct_answer": 0
    },
    {
      "question": "איזו מצווה נתן ה' לאדם הראשון?",
      "options": [
        "לאכול מכל עץ הגן חוץ מעץ הדעת",
        "לשמור את יום השבת",
        "לתת מעשר מכל יבולו",
        "לבנות מזבח ולהקריב קורבנות"
      ],
      "correct_answer": 0
    },
    {
      "question": "כיצד נענש הנחש לאחר שפיתה את חוה?",
      "options": [
        "הפך לנשר",
        "איבד את רגליו ונדרש לזחול על גחונו",
        "נשלח לחיות בים",
        "הפך לאבן"
      ],
      "correct_answer": 1
    },
    {
      "question": "איזה מבין הבאים לא היה אחד מבניו של נוח?",
      "options": [
        "שם",
        "חם",
        "יפת",
        "תרח"
      ],
      "correct_answer": 3
    },
    {
      "question": "מהי הסיבה שניתנה לבריאת האישה בסיפור בריאת האדם?",
      "options": [
        "כדי שתוכל לשרת את האדם",
        "כי לא טוב היות האדם לבדו",
        "כדי ללמד את האדם חוכמה",
        "כדי להביא ילדים לעולם"
      ],
      "correct_answer": 1
    }
  ]
}

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
