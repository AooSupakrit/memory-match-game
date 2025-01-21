import React from "react";
import PropTypes from "prop-types";
import "./App.css";
// import "./GameBoard.css"; // New CSS file for styles

const GameBoard = React.memo(({ timeLeft, score, cards, flipCard }) => {
  return (
    <div className="game-board">
      <h2 className="time-left">
        Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </h2>
      <h3 className="score">Score: {score}</h3>

      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${card.flipped ? "flipped" : ""}`}
            onClick={() => flipCard(index)}
          >
            <div className="card-inner">
              <div className="card-front">
                <span className="card-icon">❓</span>
              </div>
              <div className="card-back">
                <span className="card-icon">{card.image}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

GameBoard.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      flipped: PropTypes.bool.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  flipCard: PropTypes.func.isRequired,
};

export default GameBoard;
