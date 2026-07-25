// ---------------------------------------------------------
// LESSON DATA
// Add a new unit here and it automatically works with
// pages/lesson.html?unit=yourUnitId
// ---------------------------------------------------------
const quizData = {
  greetings1: {
    title: "Hello & Introductions",
    video: "../videos/firstvid.mp4",
    questions: [
      {
        question: "How do you say 'Hello' in Dinka?",
        answers: ["Kudual", "Adios", "Gracias", "Buenas noches"],
        correct: 0
      },
      {
        question: "What does 'Me llamo...' mean?",
        answers: ["Where are you from?", "My name is...", "How are you?", "See you later"],
        correct: 1
      },
      {
        question: "How do you ask 'What is your name?'",
        answers: ["¿Cómo estás?", "¿De dónde eres?", "¿Cómo te llamas?", "¿Qué hora es?"],
        correct: 2
      }
    ]
  },
  greetings2: {
    title: "Casual Greetings",
    video: "../videos/firstvid.mp4",
    questions: [
      {
        question: "Which greeting is the most casual?",
        answers: ["Buenos días", "¿Qué tal?", "Mucho gusto", "Buenas tardes"],
        correct: 1
      },
      {
        question: "How do you say 'See you later'?",
        answers: ["Hasta luego", "Por favor", "De nada", "Lo siento"],
        correct: 0
      }
    ]
  },
  food1: {
    title: "Basic Foods",
    video: "../videos/firstvid.mp4",
    questions: [
      {
        question: "What does 'pan' mean?",
        answers: ["Rice", "Bread", "Water", "Meat"],
        correct: 1
      },
      {
        question: "How do you say 'apple'?",
        answers: ["Manzana", "Naranja", "Plátano", "Uva"],
        correct: 0
      },
      {
        question: "What does 'agua' mean?",
        answers: ["Juice", "Milk", "Water", "Soda"],
        correct: 2
      }
    ]
  },
  food2: {
    title: "Ordering Food",
    video: "../videos/firstvid.mp4",
    questions: [
      {
        question: "How do you say 'I would like...'?",
        answers: ["Quisiera...", "Necesito...", "Tengo...", "Voy a..."],
        correct: 0
      },
      {
        question: "How do you ask for the check?",
        answers: ["¿Qué recomienda?", "La cuenta, por favor", "¿Cuánto cuesta?", "Buen provecho"],
        correct: 1
      }
    ]
  }
};

// ---------------------------------------------------------
// SETUP
// ---------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const unitId = params.get("unit");
const lesson = quizData[unitId];

const lessonTitle = document.getElementById("lessonTitle");
const pageTitle = document.getElementById("pageTitle");
const videoSource = document.getElementById("videoSource");
const lessonVideo = document.getElementById("lessonVideo");
const quizContainer = document.querySelector(".quiz-container");
const progressEl = document.getElementById("progress");
const questionEl = document.getElementById("question");
const answerButtonsEl = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");

let currentQuestion = 0;
let score = 0;

if (!lesson) {
  lessonTitle.textContent = "Lesson not found";
  quizContainer.innerHTML = `
    <p>We couldn't find a lesson for "${unitId ?? ""}".</p>
    <a class="btn" style="display:block;text-align:center;margin-top:20px;" href="../learn.html">Back to Learn</a>
  `;
  document.querySelector(".learn-container").removeChild(lessonVideo);
} else {
  pageTitle.textContent = lesson.title;
  lessonTitle.textContent = lesson.title;
  videoSource.src = lesson.video;
  lessonVideo.load();

  nextBtn.addEventListener("click", handleNext);
  loadQuestion();
}

// ---------------------------------------------------------
// QUIZ LOGIC
// ---------------------------------------------------------
function loadQuestion() {
  resetState();
  const q = lesson.questions[currentQuestion];

  progressEl.textContent = `Question ${currentQuestion + 1} of ${lesson.questions.length}`;
  questionEl.textContent = q.question;

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(index));
    answerButtonsEl.appendChild(button);
  });
}

function resetState() {
  nextBtn.style.display = "none";
  answerButtonsEl.innerHTML = "";
}

function selectAnswer(selectedIndex) {
  const q = lesson.questions[currentQuestion];
  const buttons = answerButtonsEl.querySelectorAll("button");

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === q.correct) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("incorrect");
    }
  });

  if (selectedIndex === q.correct) {
    score++;
  }

  nextBtn.style.display = "block";
}

function handleNext() {
  currentQuestion++;
  if (currentQuestion < lesson.questions.length) {
    loadQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  progressEl.textContent = "";
  quizContainer.innerHTML = `
    <div class="score-screen">
      <h2>Nice work!</h2>
      <p>You scored ${score} out of ${lesson.questions.length}</p>
      <a class="btn" href="../learn.html">Back to Learn</a>
    </div>
  `;
}