import { useState, useEffect, useRef } from "react";
import { generateSingleQuestion } from "../util/ai";
import gsap from "gsap";
import "../cupid.css";
import FloatingHearts from "./FloatingHearts";

export default function Creator() {
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: ["", ""],
      correct: 0,
      image: null
    }
  ]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [finalMessage, setFinalMessage] = useState("");
  const [mode, setMode] = useState(null); // null | "quiz"
  const [showHelp, setShowHelp] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const slideRef = useRef(null);
  const prevActiveRef = useRef(0);

  useEffect(() => {
    if (mode === "quiz" && slideRef.current) {
      const direction = activeQuestion >= prevActiveRef.current ? 1 : -1;
      gsap.fromTo(slideRef.current,
        { x: direction * 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      prevActiveRef.current = activeQuestion;
    }
  }, [activeQuestion, mode]);

  const addQuestion = () => {
    if (questions.length >= 5) return;

    const newQ = {
      text: "",
      options: ["", ""],
      correct: 0,
      image: null
    };

    setQuestions([...questions, newQ]);
    setActiveQuestion(questions.length); // Switch to the new question
  };

  const deleteQuestion = (i) => {
    if (questions.length <= 1) return;
    const copy = [...questions];
    copy.splice(i, 1);
    setQuestions(copy);
    if (activeQuestion >= copy.length) {
      setActiveQuestion(copy.length - 1);
    }
  };

  const addImage = (e, i) => {
    const file = e.target.files[0];
    if (!file) return;
    const copy = [...questions];
    copy[i].image = URL.createObjectURL(file);
    setQuestions(copy);
  };

  const generateLink = (isSkip = false) => {
    const data = isSkip ? { skip: true } : { questions, finalMessage };
    const payload = encodeURIComponent(JSON.stringify(data));
    const link = `${window.location.origin}/play?q=${payload}`;
    navigator.clipboard.writeText(link);
    alert(isSkip ? "💌 Valentine link copied!" : "💌 Quiz link copied!");
  };

  const handleAIGenerate = async () => {
    if (isGeneratingAI) return;
    
    setIsGeneratingAI(true);
    try {
      const generatedText = await generateSingleQuestion();
      if (generatedText && typeof generatedText === 'string' && generatedText.trim().length > 0) {
        const copy = [...questions];
        copy[activeQuestion].text = generatedText.trim();
        setQuestions(copy);
      } else {
        throw new Error("Invalid question text received");
      }
    } catch (error) {
      console.error("Failed to generate AI question:", error);
      // Fallback is handled in generateSingleQuestion, but just in case:
      const copy = [...questions];
      const fallbackQuestions = [
        "What's my favorite thing about you?",
        "Where did we first meet?",
        "What's our song?",
        "What's my favorite memory with you?",
        "What makes me smile the most?",
        "What's my favorite way to spend time with you?",
        "What's the sweetest thing you've ever done for me?",
        "What's my favorite nickname for you?",
        "What's our favorite date spot?",
        "What's the first thing I noticed about you?",
        "What's my favorite thing you cook?",
        "What's our inside joke?",
        "What's my favorite thing to do together?",
        "What's the most romantic thing you've said to me?",
        "What's my favorite quality about you?",
        "Where did we click this photo?"
      ];
      copy[activeQuestion].text = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      setQuestions(copy);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const q = questions[activeQuestion];

  return (
    <div className="quiz-wrapper">
      <FloatingHearts />

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
        <div className="cloud-bubble">{mode === "quiz" ? "Create!" : "Maker"}</div>
      </div>

      <div className="quiz-card" style={{ overflowY: 'auto', maxHeight: '90vh' }}>

        {showHelp && (
          <div className="help-overlay animate-fade-in" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.95)', zIndex: 120, padding: '20px', borderRadius: '20px' }}>
            <div className="help-header" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>✨ GUIDE ✨</h3>
              <button onClick={() => setShowHelp(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
            </div>

            <div className="step-container">
              <div className="step-item">
                <div className="step-text">
                  <strong>Craft the Vibe 🎯 </strong>
                  <p>Add up to 5 cute questions with custom answers and photos.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-text">
                  <strong>Seal it with a Link 💌</strong>
                  <p>Send your unique URL to your special someone.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-text">
                  <strong>Get the 'Yes' 💖</strong>
                  <p>They play, they swoon, and you secure your Valentine.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Selection Screen */}
        {mode === null && (
          <div className="creator-home" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "center", position: 'relative' }}>
            {/* Help Button on Main Screen */}
            <button
              className="help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              style={{ position: 'absolute', top: '0', right: '0', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ❓
            </button>

            <div className="hero-section">
              <h1 className="title" style={{ fontSize: "2.5rem", color: "#ff6699", marginBottom: "10px" }}>Valentine's Quiz Maker</h1>
              <p className="subtitle" style={{ fontSize: "1.2rem", color: "#666", marginBottom: "40px" }}>Ask them out in the cutest way possible</p>
            </div>

            <div className="options-grid" style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>

              <div className="option-card" style={{ background: "#fff0f5", padding: "20px", borderRadius: "20px", width: "220px", border: "2px solid #ffccdd" }}>
                <h2 style={{ color: "#ff6699" }}>✍️ Custom</h2>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>Write your own inside jokes and personal questions.</p>
                <button
                  className="secondary-btn"
                  onClick={() => setMode("quiz")}
                  style={{ marginTop: "15px", padding: "10px 20px", borderRadius: "50px", border: "none", background: "#ff6699", color: "white", fontWeight: "bold", cursor: "pointer" }}
                >
                  Create Manual
                </button>
              </div>

              <div className="option-card skip-card" style={{ background: "#fff", padding: "20px", borderRadius: "20px", width: "220px", border: "2px dashed #999" }}>
                <h2 style={{ color: "#666" }}>⏩ Just Ask</h2>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>Skip the quiz and go straight to the proposal.</p>
                <button
                  className="ghost-btn"
                  onClick={() => generateLink(true)}
                  style={{ marginTop: "15px", padding: "10px 20px", borderRadius: "50px", border: "2px solid #666", background: "none", color: "#666", fontWeight: "bold", cursor: "pointer" }}
                >
                  Direct Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Creator UI */}
        {mode === "quiz" && q && (
          <div className="quiz-creator-wrapper" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

            <header className="quiz-header" style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <button
                className="back-btn"
                onClick={() => setMode(null)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", marginRight: "10px" }}
              >
                ←
              </button>
              <h2 style={{ color: "#ff6699", margin: 0, fontSize: '1.2rem' }}>Create Quiz</h2>
              <div style={{ flex: 1 }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {questions.length > 1 && (
                  <button
                    onClick={() => deleteQuestion(activeQuestion)}
                    style={{ background: "#ffcccc", color: "#cc0000", border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Delete Q
                  </button>
                )}
                {/* Help button brought here next to Delete Q */}
                <button
                  className="help-toggle"
                  onClick={() => setShowHelp(!showHelp)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  ❓
                </button>
              </div>
            </header>

            {/* Current Question Card */}
            <div className="question-editor" style={{ flex: 1, overflowY: 'auto' }}>
              <div ref={slideRef}>
                <div className="question-card" style={{ background: "#fff0f5", padding: "15px", borderRadius: "15px", border: "2px solid #ffccdd", marginBottom: "20px" }}>
                  <div className="q-count" style={{ fontWeight: "bold", color: "#ff6699", marginBottom: "5px" }}>Question {activeQuestion + 1} of {questions.length}</div>
                  <input
                    className="main-input"
                    placeholder="Enter your question here..."
                    value={q.text}
                    onChange={e => {
                      const copy = [...questions];
                      copy[activeQuestion].text = e.target.value;
                      setQuestions(copy);
                    }}
                    style={{ width: "98%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "10px" }}
                  />
                 

                  <div className="card-actions" style={{ marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <label className="upload-label" style={{ cursor: "pointer", color: "#ff6699", fontWeight: "bold", fontSize: "0.9rem" }}>
                      <input type="file" hidden onChange={e => addImage(e, activeQuestion)} />
                      📷 {q.image ? "Change Image" : "Add Image"}
                    </label>
                    <button 
                      onClick={handleAIGenerate}
                      disabled={isGeneratingAI}
                      style={{
                        margin: "0",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        background: isGeneratingAI ? "#ccc" : "#ff6699",
                        color: "white",
                        fontWeight: "bold",
                        cursor: isGeneratingAI ? "not-allowed" : "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      {isGeneratingAI ? "✨ Generating..." : "✨ Get AI help"}
                    </button>
                  </div>
                  
                  {q.image && <img src={q.image} className="preview-img" alt="preview" style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }} />}

                  <div className="options-input-grid" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {q.options.map((op, idx) => (
                      <div key={idx} className="option-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <input
                            type="radio"
                            name={`correct-${activeQuestion}`}
                            checked={q.correct === idx}
                            onChange={() => {
                              const copy = [...questions];
                              copy[activeQuestion].correct = idx;
                              setQuestions(copy);
                            }}
                          />
                          <span style={{ fontSize: "0.6rem", color: "#666" }}>Correct</span>
                        </div>

                        <input
                          placeholder={`Option ${idx + 1}`}
                          value={op}
                          onChange={e => {
                            const copy = [...questions];
                            copy[activeQuestion].options[idx] = e.target.value;
                            setQuestions(copy);
                          }}
                          style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }}
                        />
                      </div>
                    ))}

                    <div className="option-controls" style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                      <button
                        className="small-btn"
                        onClick={() => {
                          const copy = [...questions];
                          if (copy[activeQuestion].options.length < 4) {
                            copy[activeQuestion].options.push("");
                            setQuestions(copy);
                          }
                        }}
                        style={{ fontSize: "0.8rem", padding: "5px 10px", borderRadius: "5px", border: "none", background: "#e0e0e0", cursor: "pointer" }}
                      >
                        ➕ Add Option
                      </button>

                      <button
                        className="small-btn danger"
                        onClick={() => {
                          const copy = [...questions];
                          if (copy[activeQuestion].options.length > 2) {
                            copy[activeQuestion].options.pop();
                            if (copy[activeQuestion].correct >= copy[activeQuestion].options.length) {
                              copy[activeQuestion].correct = 0;
                            }
                            setQuestions(copy);
                          }
                        }}
                        style={{ fontSize: "0.8rem", padding: "5px 10px", borderRadius: "5px", border: "none", background: "#ffcccc", color: "#cc0000", cursor: "pointer" }}
                      >
                        ➖ Remove Option
                      </button>
                    </div>
                  </div>
                </div>

                {/* Final Message Input (Visible on last question or always? Let's keep it accessible) */}
                <div className="final-msg-section" style={{ padding: "0 10px" }}>
                  <input
                    className="final-message-input"
                    placeholder="💌 Message after they say YES"
                    value={finalMessage}
                    onChange={e => setFinalMessage(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd" }}
                  />
                </div>
              </div>
            </div>

            {/* Carousel Dots & Controls */}
            <div className="creator-footer" style={{ marginTop: "20px", textAlign: "center", borderTop: "1px solid #eee", paddingTop: "15px" }}>

              <div className="carousel-nav" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveQuestion(i)}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "none",
                      background: i === activeQuestion ? "#ff0066" : "#ddd",
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                    title={`Question ${i + 1}`}
                  />
                ))}

                {questions.length < 5 && (
                  <button
                    onClick={addQuestion}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "2px dashed #ff0066",
                      background: "none",
                      color: "#ff0066",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      lineHeight: 1
                    }}
                    title="Add Question"
                  >
                    +
                  </button>
                )}
              </div>

              <button
                className="generate-btn"
                onClick={() => generateLink(false)}
                style={{ width: "100%", padding: "15px", borderRadius: "50px", border: "none", background: "#ff0066", color: "white", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(255, 0, 102, 0.3)" }}
              >
                🚀 Copy & Share Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}