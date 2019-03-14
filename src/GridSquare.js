import React from "react";
import { connect } from "react-redux";

const GridSquare = props => {
  const { x, y } = props.player.location;
  let squareIcon = ".";
  const isPlayerOccupied = x === props.x && y === props.y;
  const isHealOccupied = props.healthPacks.some(pack => {
    return pack.x == props.x && pack.y == props.y;
  });
  const isSpikeOccupied = props.spikes.some(spike => {
    return spike.x == props.x && spike.y == props.y;
  });

  const isBulletOccupied = props.bullet.some(bul => {
    return bul.x == props.x && bul.y == props.y;
  });
  const isShotgunOccupied = props.weapons.shotgun.some(gun => {
    return gun.x == props.x && gun.y == props.y;
  });
  const isSniperOccupied = props.weapons.sniper.some(gun => {
    return gun.x == props.x && gun.y == props.y;
  });

  const getSquareColor = () => {
    if (isPlayerOccupied) {
      squareIcon = "o";
      return getPlayerHealthColor();
    }
    if (isHealOccupied) {
      squareIcon = "+";
      return "White";
    }
    if (isSpikeOccupied) {
      squareIcon = "X";
      return "Tan";
    }
    if (isBulletOccupied) {
      squareIcon = "0";
      return "Gray";
    }
    if (isShotgunOccupied) {
      squareIcon = "S";
      return "Gray";
    }
    if (isSniperOccupied) {
      squareIcon = "R";
      return "Gray";
    }
    return "Gray";
  };

  const getTextColor = () => {
    if (isHealOccupied && isSpikeOccupied) {
      const newHealthPacks = props.healthPacks.filter(pack => {
        return !(pack.x == props.x && pack.y == props.y);
      });
      props.dispatch({
        type: "change_healthPacks",
        data: newHealthPacks
      });
    }
    if (isPlayerOccupied && isHealOccupied) {
      const newHealthPacks = props.healthPacks.filter(pack => {
        return !(pack.x == props.x && pack.y == props.y);
      });
      props.dispatch({
        type: "add_health_pack",
        data: props.player.healthPacks + 1
      });
      props.dispatch({
        type: "change_healthPacks",
        data: newHealthPacks
      });
    }
    if (isPlayerOccupied && isShotgunOccupied) {
      const newShotguns = props.weapons.shotgun.filter(gun => {
        return !(gun.x == props.x && gun.y == props.y);
      });
      props.dispatch({ type: "pickup_shotgun", data: newShotguns });
    }
    if (isPlayerOccupied && isSniperOccupied) {
      const newSnipers = props.weapons.sniper.filter(gun => {
        return !(gun.x == props.x && gun.y == props.y);
      });
      props.dispatch({ type: "pickup_sniper", data: newSnipers });
    }
    if (isPlayerOccupied && isSpikeOccupied) {
      const newSpikes = props.spikes.filter(pack => {
        return !(pack.x == props.x && pack.y == props.y);
      });
      props.dispatch({
        type: "change_player_health",
        data: props.player.health - 25
      });
      props.dispatch({
        type: "change_spikes",
        data: newSpikes
      });
    }
    // if (isBulletOccupied && isSpikeOccupied) {
    //   const newSpikes = props.spikes.filter(pack => {
    //     return !(pack.x == props.x && pack.y == props.y);
    //   });
    //   props.dispatch({
    //     type: "change_spikes",
    //     data: newSpikes
    //   });
    // }
    if (isPlayerOccupied) {
      return "Black";
    }
    if (isHealOccupied) {
      return "Red";
    }
    if (isSpikeOccupied) {
      return "Black";
    }
    if (isBulletOccupied) {
      return "White";
    }
    if (isSniperOccupied || isShotgunOccupied) {
      return "White";
    }
    return "Gray";
  };

  const getPlayerHealthColor = () => {
    let color;
    const health = props.player.health;
    if (health > 75) {
      color = "Green";
    } else if (health > 50) {
      color = "Yellow";
    } else if (health > 25) {
      color = "Orange";
    } else {
      color = "Red";
    }
    return color;
  };

  return (
    <div className="inline">
      <button
        className="grid-button"
        style={{
          backgroundColor: getSquareColor(),
          color: getTextColor()
        }}
      >
        {squareIcon}
      </button>
    </div>
  );
};

export default connect(function mapStateToProps(state, props) {
  return {
    player: state.player,
    healthPacks: state.healthPacks,
    spikes: state.spikes,
    bullet: state.bullet,
    weapons: state.weapons
  };
})(GridSquare);
