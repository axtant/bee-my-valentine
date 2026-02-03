import "../hearts.css";

export default function HeartBackground() {

  const hearts = Array.from({ length: 80 }); // 👈 MORE HEARTS

  return (
    <div className="hearts-container">
      {hearts.map((_, i) => (
        <span
          key={i}
          className="heart"
          style={{
            left: Math.random() * 100 + "%",
            animationDuration: 5 + Math.random() * 6 + "s",
            width: 10 + Math.random() * 20 + "px",
            height: 10 + Math.random() * 20 + "px",
            opacity: 0.5 + Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
}
