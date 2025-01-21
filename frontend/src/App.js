import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Game from "./Game";
import Leaderboard from "./Leaderboard";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/leaderboard")
      .then((response) => {
        setLeaderboard(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the leaderboard!", error);
      });
  }, []);

  const startGame = () => {
    setIsGameStarted(true);
    setScore(0);
  };

  const endGame = () => {
    setIsGameStarted(false);
    window.location.reload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Memory Match Game</h1>
      </header>

      {!isGameStarted ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div id="game-container">
          <Game
            setScore={setScore}
            score={score}
            saveScore={() => {
              axios
                .post("http://localhost:5000/api/leaderboard", {
                  player_name: playerName,
                  score: score,
                })
                .then(() => alert("Score saved!"));
            }}
            onGameOver={endGame}
          />
          <canvas ref={canvasRef} id="game"></canvas>
        </div>
      )}

      <Leaderboard leaderboard={leaderboard} />
    </div>
  );
}

export default App;
