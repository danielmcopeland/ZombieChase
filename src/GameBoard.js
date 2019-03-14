import React from "react";
import utils from "./utils";
import GameRow from "./GameRow";

const GameBoard = props => {
  return (
    <div className="game">
      {utils.range(0, 20).map(number => (
        <GameRow key={number} y={number} player={props.player} />
      ))}
      <br />
    </div>
  );
};

export default GameBoard;
