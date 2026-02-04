import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import "../index.css";
import "../cupid.css";
import FloatingHearts from "./FloatingHearts";
import DrawHeart from "./DrawHeart";
import petsImg from "../assets/option_pets.png";
import turkeyImg from "../assets/option_turkey.png";

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

const HeartIcon = () => (
  <svg viewBox="0 0 100 100" className="option-icon-svg">
    <path d="M50 88.9L16.7 55.6C7.2 46.1 7.2 30.9 16.7 21.4s24.7-9.5 33.3 0l0 0 0 0c8.6-9.5 23.8-9.5 33.3 0s9.5 24.7 0 33.3L50 88.9z" fill="#ff99aa" stroke="none" />
    <path d="M50 88.9L16.7 55.6C7.2 46.1 7.2 30.9 16.7 21.4s24.7-9.5 33.3 0l0 0 0 0c8.6-9.5 23.8-9.5 33.3 0s9.5 24.7 0 33.3L50 88.9z" fill="none" stroke="#ff88aa" strokeWidth="2" />
    <path d="M25 35 L35 45 M65 35 L75 45" stroke="#ff7799" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export default function Quiz() {

  const [params] = useSearchParams();
  const payload = JSON.parse(params.get("q") || "{}");
  const skip = payload.skip;

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

  /* ===== END PAGE ===== */

  /* Additional State for animation */
  const [firing, setFiring] = useState(false);

  const yesClick = () => {
    setFiring(true);
    setTimeout(() => {
      setShowEnd(true);
    }, 1500); // Wait for arrow animation
  };

  const getOptionContent = (text) => {
    const t = text.toLowerCase();
    if (t.includes("pet")) return <img src={petsImg} alt="pets" className="option-img" />;
    if (t.includes("thank")) return <img src={turkeyImg} alt="turkey" className="option-img" />;
    if (t.includes("love") || t.includes("heart")) return <HeartIcon />;
    return null;
  };

  /* ===== END PAGE ===== */

  if (final || skip) {

    if (showEnd) {
      return (
        <div className="quiz-wrapper">
          <FloatingHearts />
          <div className="quiz-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '450px', height: 'auto' }}>
            <DrawHeart message={finalMessage} />
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-wrapper">
        <FloatingHearts />

        <div className="cupid-wrapper">
          <div className={`cupid ${firing ? 'firing' : ''}`}>
            <div className="body">
              <div className="wing"></div>
              <div className="wing"></div>
              <div className="leg"></div>
              <div className="leg"></div>
              <div className="robe"></div>
              <div className="chest"></div>
              <div className="arm arm-bottom"></div>
              <div className="bow"></div>
              <div className="arrow">
                <div className="arrow-head"></div>
              </div>
              <div className="arm arm-top"></div>
              <div className="neck"></div>
            </div>
            <div className="head">
              <div className="face">
                <div className="mouth"></div>
                <div className="eye"></div>
                <div className="eye"></div>
                <div className="cheek"></div>
                <div className="cheek"></div>
              </div>
              <div className="hair"></div>
              <div className="ear"></div>
            </div>
          </div>
        </div>

        <div className="bubble-container">
          <div className="cloud-bubble">Love!</div>
        </div>

        <div className="quiz-card">
          <div className="quiz-header-spacer"></div>

          {!skip && (
            <p className="score-text" style={{ textAlign: "center", fontWeight: "bold", color: "#666" }}>
              ❤️ Score {score}/{questions.length}
            </p>
          )}

          <div className="val-card">

            <div className="card-content">

              <p className="v-small-text" style={{ fontSize: "1.5rem", textAlign: "center", marginTop: "20px" }}>Will you be my</p>

              <h1 className="v-valentine-text" style={{ fontSize: "3.5rem", color: "#ff0066", textAlign: "center", margin: "10px 0" }}>Valentine? ❤️</h1>

              <div className="v-buttons" style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "40px" }}>

                <button
                  className="yes-btn"
                  onClick={yesClick}
                  style={{ fontSize: "1.5rem", padding: "15px 40px" }}
                >
                  YES 💖
                </button>

                <button
                  className="no-btn"
                  style={{
                    position: "relative",
                    transform: `translate(${noPos.x}px,${noPos.y}px)`,
                    fontSize: "1.5rem",
                    padding: "15px 40px",
                    border: "3px solid #ff6699"
                  }}
                  onMouseEnter={moveNo}
                >
                  NO 😈
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  /* ===== QUIZ ===== */

  const q = questions[index];

  return (
    <div className="quiz-wrapper">

      <div className="cupid-wrapper">
        <div className="cupid">
          <div className="body">
            <div className="wing"></div>
            <div className="wing"></div>
            <div className="leg"></div>
            <div className="leg"></div>
            <div className="robe"></div>
            <div className="chest"></div>
            <div className="arm arm-bottom"></div>
            <div className="bow"></div>
            <div className="arrow">
              <div className="arrow-head"></div>
            </div>
            <div className="arm arm-top"></div>
            <div className="neck"></div>
          </div>
          <div className="head">
            <div className="face">
              <div className="mouth"></div>
              <div className="eye"></div>
              <div className="eye"></div>
              <div className="cheek"></div>
              <div className="cheek"></div>
            </div>
            <div className="hair"></div>
            <div className="ear"></div>
          </div>
        </div>
      </div>

      <div className="bubble-container">
        <div className="cloud-bubble">Trivia</div>
      </div>

      <div className="quiz-card">

        <div className="card-badge">2</div>

        <div className="quiz-header-spacer"></div>

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
                <div className="option-badge">{i + 1}</div>
                <div className="option-visual">
                  {getOptionContent(op)}
                </div>
                <div className="option-text">{op}</div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
