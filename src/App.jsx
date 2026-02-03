import { BrowserRouter, Routes, Route } from "react-router-dom";
import Creator from "./components/Creator";
import Quiz from "./components/Quiz";
import HeartBackground from "./components/HeartBackground";
import "./hearts.css";

export default function App() {
  return (
    <>
      <HeartBackground />

      <div className="app-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Creator />} />
            <Route path="/play" element={<Quiz />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
