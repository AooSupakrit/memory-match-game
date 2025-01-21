import React, { memo } from "react";
import PropTypes from "prop-types";

const Leaderboard = ({ leaderboard = [] }) => {
  console.log(leaderboard);
  return (
    <div>
      <h2>Today's Top 5 Players</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.player_name} - {entry.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

Leaderboard.propTypes = {
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      player_name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ),
};

export default memo(Leaderboard);
