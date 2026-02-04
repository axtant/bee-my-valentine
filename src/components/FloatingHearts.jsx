import "../floating-hearts.css";

export default function FloatingHearts() {
    return (
        <div className="floating-hearts-wrapper">
            <div className="heart-anim x1"></div>
            <div className="heart-anim x2"></div>
            <div className="heart-anim x3"></div>
            <div className="heart-anim x4"></div>
            <div className="heart-anim x5"></div>
            <div className="altheart x6"></div>

            {/* Duplicate set for density */}
            <div className="heart-anim x1" style={{ animationDelay: '-7s' }}></div>
            <div className="heart-anim x2" style={{ animationDelay: '-12s' }}></div>
            <div className="heart-anim x3" style={{ animationDelay: '-5s' }}></div>
            <div className="heart-anim x4" style={{ animationDelay: '-9s' }}></div>
            <div className="heart-anim x5" style={{ animationDelay: '-3s' }}></div>
            <div className="altheart x6" style={{ animationDelay: '-4s' }}></div>
        </div>
    );
}
