import React, { useState, useEffect } from "react";
import GameBoard from "./GameBoard";

function Game({ setScore, score, saveScore, onGameOver }) {
  const defaultTime = 300; // 300 seconds (5 minutes)
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [timeLeft, setTimeLeft] = useState(defaultTime);

  const initializeGame = () => {
    const cardImages = [
      "🍉", "🍉", "🍌", "🍌", "🍒", "🍒", "🍓", "🍓",
      "🍑", "🍑", "🍍", "🍍", "🥭", "🥭", "🍇", "🍇"
    ];
    const shuffleCards = cardImages
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image, flipped: false }));

    setCards(shuffleCards);
    setFlipped([]);
    setMatchedPairs([]);
    setTimeLeft(defaultTime);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      saveScore();
      alert("Time is up! Game Over.");
      onGameOver();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const flipCard = (index) => {
    if (flipped.length === 2 || cards[index].flipped || matchedPairs.includes(cards[index].image)) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlipped((prev) => [...prev, index]);

    if (flipped.length === 1) {
      const firstIndex = flipped[0];
      const secondIndex = index;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.image === secondCard.image) {
        setTimeout(() => {
          setMatchedPairs((prev) => [...prev, firstCard.image]);
          setScore((prevScore) => prevScore + 10);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setTimeLeft((prevTime) => Math.max(prevTime - 10, 0));
          newCards[firstIndex].flipped = false;
          newCards[secondIndex].flipped = false;
          setCards([...newCards]);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && cards.length > 0) {
      saveScore();
      alert("Congratulations! You matched all pairs!");
      onGameOver();
    }
  }, [matchedPairs, cards]);

  return (
    <div>
      <GameBoard
        timeLeft={timeLeft}
        score={score}
        cards={cards}
        flipCard={flipCard}
      />
    </div>
  );
}

export default Game;
