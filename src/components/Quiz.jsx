import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import "../index.css";

const uwu = [
  "UwU correct 💖",
  "Yayyy 🥰",
  "So smart ❤️",
  "Hehe right 😘"
];

const angy = [
  "Wrong 😡",
  "Angyyy 😤",
  "Nooo 😠",
  "Try harder 💢"
];

export default function Quiz() {

  const [params] = useSearchParams();

  const skip = params.get("skip");

  const payload = JSON.parse(params.get("q") || "{}");

  const questions = payload.questions || [];
  const finalMessage = payload.finalMessage || "You made me so happy ❤️";

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [final, setFinal] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const moveNo = () => {
    setNoPos({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    });
  };

  const nextStep = () => {
    setTimeout(() => {
      setFeedback("");

      if (index + 1 < questions.length) {
        setIndex(index + 1);
      } else {
        setFinal(true);
      }
    }, 900);
  };

  const answer = (i) => {
    if (i === questions[index].correct) {
      setScore(score + 1);
      setFeedback(uwu[Math.floor(Math.random() * uwu.length)]);
    } else {
      setFeedback(angy[Math.floor(Math.random() * angy.length)]);
    }

    nextStep();
  };

  const yesClick = () => setShowEnd(true);

  /* ===== END PAGE ===== */

  if (final || skip) {

    if (showEnd) {
      return (
        <div className="glass end-screen">

          <h1 className="big-text">🎉 Yayyy!!! 💖</h1>

          <p className="love-msg">{finalMessage}</p>

          <div className="hearts">❤️ 💕 💗 💓 💖</div>

        </div>
      );
    }

    return (
      <div className="glass final-card">

        {!skip && (
          <p className="score-text">
            ❤️ Score {score}/{questions.length}
          </p>
        )}

        
        <div class="valentine-bg">
              <div class="card">
                <p class="small-text">Will you be my</p>
                <h1>Valentine?</h1>
              <div class="buttons"><button className="yes-btn" onClick={yesClick}>
          YES 💖
        </button>

        <button
          className="no-btn"
          style={{ transform: `translate(${noPos.x}px,${noPos.y}px)` }}
          onMouseEnter={moveNo}
        >
          NO 😈
        </button>
            </div>
          </div>
          <span class="heart">💗</span>
          <span class="heart">💖</span>
          <span class="heart">💞</span>
          <span class="heart">💕</span>

        </div>

      </div>
    );
  }

  /* ===== QUIZ ===== */

  const q = questions[index];

  return (
      <div className="quiz-wrapper">
        <div className="quiz-card">
    
          <div className="quiz-score">
            Score: {score}
          </div>
    
          <div className="quiz-question">
            {q.text}
          </div>
    
          {q.image && (
            <img src={q.image} className="quiz-image" />
          )}
    
          {feedback ? (
            <div className="quiz-feedback">
              {feedback}
            </div>
          ) : (
            <div className="quiz-options">
              {q.options.map((op, i) => (
                <button
                  key={i}
                  className="quiz-btn"
                  onClick={() => answer(i)}
                >
                  {op}
                </button>
              ))}
            </div>
          )}
    
        </div>
      </div>
  );
}
