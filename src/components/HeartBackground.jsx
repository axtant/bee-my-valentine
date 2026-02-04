import "../hearts.css";

export default function HeartBackground() {

  const hearts = Array.from({ length: 70 });

  return (
    <div className="hearts-container">
      {hearts.map((_, i) => {

        const size = 10 + Math.random() * 18;

        return (
          <span
            key={i}
            className="heart"
            style={{
              left: Math.random() * 100 + "%",
              width: size + "px",
              height: size + "px",
              animationDuration: 6 + Math.random() * 6 + "s",
              animationDelay: Math.random() * 5 + "s",
              opacity: 0.4 + Math.random() * 0.6
            }}
          />
        );
      })}
    </div>
  );
}
