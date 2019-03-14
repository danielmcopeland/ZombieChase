import React from "react";
import utils from "./utils";
import { connect } from "react-redux";

const Controls = props => {
  const { x, y } = props.player.location;

  // ArrowKeysReact.config({
  //   left: () => {
  //     moveLeft();
  //   },
  //   right: () => {
  //     moveRight();
  //   },
  //   up: () => {
  //     moveUp();
  //   },
  //   down: () => {
  //     moveDown();
  //   }
  // });

  // const moveUp = () => {
  //   props.dispatch({
  //     type: "change_player_location",
  //     data: { x: x, y: y - 1 }
  //   });
  // };
  // const moveDown = () => {
  //   props.dispatch({
  //     type: "change_player_location",
  //     data: { x: x, y: y + 1 }
  //   });
  // };
  // const moveLeft = () => {
  //   props.dispatch({
  //     type: "change_player_location",
  //     data: { x: x - 1, y: y }
  //   });
  // };
  // const moveRight = () => {
  //   props.dispatch({
  //     type: "change_player_location",
  //     data: { x: x + 1, y: y }
  //   });
  // };

  const useHealthPack = () => {
    if (props.player.healthPacks > 0) {
      props.dispatch({ type: "use_health_pack" });
    }
  };

  return (
    <div>
      <div className="playerInfo">Health: {props.player.health}%</div>
      <div className="playerInfo">Health Packs: {props.player.healthPacks}</div>
      <div className="arrowKeys">
        <div className="arrowKeyRow">
          <button className="arrowKey" onClick={props.moveUp}>
            ^
          </button>
        </div>
        <div className="arrowKeyRow">
          <button className="arrowKey" onClick={props.moveLeft}>
            &#60;
          </button>
          <button className="arrowKey" onClick={props.moveDown}>
            v
          </button>
          <button className="arrowKey" onClick={props.moveRight}>
            &#62;
          </button>
        </div>
        <div className="arrowKeyRow">
          <button className="use-health-pack" onClick={useHealthPack}>
            Use Health Pack
          </button>
        </div>
        <div className="arrowKeyRow">
          <button className="add-enemy" onClick={props.addEnemy}>
            Add Enemy
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect(function mapStateToProps(state, props) {
  return {
    player: state.player
  };
})(Controls);
