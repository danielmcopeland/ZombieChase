import React from "react";
import utils from "./utils";
import { connect } from "react-redux";

const Controls = props => {
  const { x, y } = props.player.location;

  const useHealthPack = () => {
    if (props.player.healthPacks > 0) {
      props.dispatch({ type: "use_health_pack" });
    }
  };

  const selectWeapon = weapon => {
    props.dispatch({ type: "change_equiped_weapon", data: weapon });
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
        <br />
        <div className="arrowKeyRow">
          <button className="use-health-pack" onClick={useHealthPack}>
            Use Health Pack
          </button>
        </div>
        <br />
        <div className="inventory">
          <div style={{ color: "white" }}>
            Equiped Weapon: {props.heldWeapon}
          </div>
        </div>
        <div className="inventory">
          <div style={{ color: "white" }}>Inventory</div>
          {props.equipedWeapons.map((weapon, index) => (
            <div key={index} className="inventory_button">
              <button onClick={() => selectWeapon(weapon)}>{weapon}</button>
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect(function mapStateToProps(state, props) {
  return {
    player: state.player,
    equipedWeapons: state.equipedWeapons,
    heldWeapon: state.heldWeapon
  };
})(Controls);
