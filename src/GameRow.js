import React from "react";
import GridSquare from "./GridSquare";
import utils from "./utils";

const GameRow = props => {
  return (
    <div className="game-row">
      {utils.range(0, 20).map(number => (
        <GridSquare
          key={[props.y, number]}
          y={props.y}
          x={number}
          player={props.player}
        />
      ))}
    </div>
  );
};

export default GameRow;
