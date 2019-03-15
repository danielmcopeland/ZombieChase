import React from "react";
import utils from "./utils";
import { connect } from "react-redux";

const Controls = props => {
  const { x, y } = props.player.location;

  return (
    <div>
      <div className="inventory">
        <div className="playerInfo">Health: {props.player.health}%</div>
        <div className="playerInfo">
          Health Packs: {props.player.healthPacks}
        </div>

        <div className="playerInfo">
          <div>Use Health Pack: H</div>
        </div>
        <br />
      </div>
      <div className="inventory">
        <div style={{ color: "white" }}>Equiped Weapon: {props.heldWeapon}</div>
      </div>
      <div className="inventory">
        <div style={{ color: "white" }}>Inventory</div>
        {props.equipedWeapons.map((weapon, index) => (
          <div key={index} className="inventory_button">
            <div className="playerInfo">
              {index + 1}. {weapon}
            </div>
            <br />
          </div>
        ))}
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
