import React from "react";

const GameOver = props => {
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {props.condition ? (
        <h1 style={{ color: "green" }}>You Win!</h1>
      ) : (
        <h1 style={{ color: "red" }}>You Lose!</h1>
      )}
    </div>
  );
};

export default GameOver;
