import { useState } from "react";
import { getAIQuestions } from "../util/ai";

export default function Creator() {
  const [questions, setQuestions] = useState([]);
  const [finalMessage, setFinalMessage] = useState("");
  const [mode, setMode] = useState(null); // null | "quiz"
  const [showHelp, setShowHelp] = useState(false);

  const addQuestion = () => {
    if (questions.length >= 5) return;
  
    setQuestions([
      ...questions,
      { 
        text: "", 
        options: ["", ""], // start with 2
        correct: 0, 
        image: null 
      }
    ]);
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

  const suggestAI = async () => {
    try {
      const aiQs = await getAIQuestions();
      const formatted = aiQs.map(q => ({ ...q, image: null }));
      setQuestions(formatted.slice(0, 5));
      setMode("quiz");
    } catch {
      alert("AI failed 😢 try again");
    }
  };

  return (
    <div className="app-container" style={{ minHeight: "100dvh" }}>
      {/* Floating Help Button */}
      <button className="help-toggle" onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? "✖" : "❓ How it works"}
      </button>

      {showHelp && (
  <div className="help-overlay animate-fade-in">
    <div className="glass help-card">
      <div className="help-header">
        <h3>✨ GUIDE ✨</h3>
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
  </div>
)}

      {/* Main Selection Screen */}
      {mode === null && (
        <div className="glass-container">
          <div className="hero-section">
            <h1 className="title">Valentine's Quiz Maker</h1>
            <p className="subtitle">Ask them out in the cutest way possible</p>
          </div>

          <div className="options-grid">
    
            <div className="glass option-card">
              <h2>✍️ Custom Quiz</h2>
              <p>Write your own inside jokes and personal questions.</p>
              <button className="secondary-btn" onClick={() => setMode("quiz")}>Create Manual</button>
            </div>

            <div className="glass option-card skip-card">
              <h2>⏩ Just Ask</h2>
              <p>Skip the quiz and go straight to the proposal.</p>
              <button className="ghost-btn" onClick={() => generateLink(true)}>Direct Link</button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Creator UI */}
      {mode === "quiz" && (
        <div className="quiz-creator-wrapper">
          <div className="glass quiz-box">
            <header className="quiz-header">
              <button className="back-btn" onClick={() => setMode(null)}>← Back</button>
              <h2>Customize Your Quiz</h2>
            </header>

            <div className="questions-list">
              {questions.map((q, i) => (
                <div className="question-card" key={i}>
                  <div className="q-count">Question {i + 1}</div>
                  <input
                    className="main-input"
                    placeholder="Enter your question here..."
                    value={q.text}
                    onChange={e => {
                      const copy = [...questions];
                      copy[i].text = e.target.value;
                      setQuestions(copy);
                    }}
                  />
                  <div className="card-actions">
                    <label className="upload-label">
                      <input type="file" hidden onChange={e => addImage(e, i)} />
                      📷 {q.image ? "Change Image" : "Add Image"}
                    </label>
                  </div>
                  {q.image && <img src={q.image} className="preview-img" alt="preview" />}
                  <div className="options-input-grid">
                    {q.options.map((op, idx) => (
                      <div key={idx} className="option-row">
                        <input
                          placeholder={`Option ${idx + 1}`}
                          value={op}
                          onChange={e => {
                            const copy = [...questions];
                            copy[i].options[idx] = e.target.value;
                            setQuestions(copy);
                          }}
                        />
                        <input 
                            type="radio" 
                            name={`correct-${i}`} 
                            checked={q.correct === idx}
                            onChange={() => {
                                const copy = [...questions];
                                copy[i].correct = idx;
                                setQuestions(copy);
                            }}
                        />
                        
                      </div>
                    ))}
                    <div className="option-controls">

<button
  className="small-btn"
  onClick={() => {
    const copy = [...questions];
    if (copy[i].options.length < 4) {
      copy[i].options.push("");
      setQuestions(copy);
    }
  }}
>
  ➕ Add Option
</button>

<button
  className="small-btn danger"
  onClick={() => {
    const copy = [...questions];
    if (copy[i].options.length > 2) {
      copy[i].options.pop();
      if (copy[i].correct >= copy[i].options.length) {
        copy[i].correct = 0;
      }
      setQuestions(copy);
    }
  }}
>
  ➖ Remove
</button>

</div>

                  </div>
                </div>
              ))}
            </div>

            <div className="creator-footer">
              <button className="add-btn" onClick={addQuestion} disabled={questions.length >= 5}>
                + Add Question ({questions.length}/5)
              </button>
              
              <hr />

              <input
                className="final-message-input"
                placeholder="💌 Message after they say YES (e.g. 'See you at 7!')"
                value={finalMessage}
                onChange={e => setFinalMessage(e.target.value)}
              />

              <button className="generate-btn" onClick={() => generateLink(false)}>
                🚀 Copy & Share Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}