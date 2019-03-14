import React, { Component } from "react";
import "./App.css";
import GameBoard from "./GameBoard";
import { connect } from "react-redux";
import Controls from "./Controls";
import ArrowKeysReact from "arrow-keys-react";
import utils from "./utils";

const App = props => {
  const { x, y } = props.player.location;
  ArrowKeysReact.config({
    left: () => {
      moveLeft();
    },
    right: () => {
      moveRight();
    },
    up: () => {
      moveUp();
    },
    down: () => {
      moveDown();
    }
  });

  const moveUp = () => {
    if (y > 0) {
      props.dispatch({
        type: "change_player_location",
        data: { x: x, y: y - 1 }
      });
      spikeChase();
    }
  };
  const moveDown = () => {
    if (y < 20) {
      props.dispatch({
        type: "change_player_location",
        data: { x: x, y: y + 1 }
      });
      spikeChase();
    }
  };
  const moveLeft = () => {
    if (x > 0) {
      props.dispatch({
        type: "change_player_location",
        data: { x: x - 1, y: y }
      });
      spikeChase();
    }
  };
  const moveRight = () => {
    if (x < 20) {
      props.dispatch({
        type: "change_player_location",
        data: { x: x + 1, y: y }
      });
      spikeChase();
    }
  };

  const shoot = direction => {
    addEnemy();

    function theLoop(dir, i) {
      setTimeout(() => {
        if (dir === "up") {
          if (props.spikes.some(spike => spike.x == x && spike.y == i)) {
            removeSpike(x, i);
            props.dispatch({ type: "change_bullet", data: [] });
          } else {
            props.dispatch({ type: "change_bullet", data: [{ x: x, y: i }] });
            if (i >= 0) {
              theLoop("up", i - 1);
            }
          }
        } else if (dir === "down") {
          if (props.spikes.some(spike => spike.x == x && spike.y == i)) {
            removeSpike(x, i);
            props.dispatch({ type: "change_bullet", data: [] });
          } else {
            props.dispatch({ type: "change_bullet", data: [{ x: x, y: i }] });
            if (i <= 20) {
              theLoop("down", i + 1);
            }
          }
        } else if (dir === "left") {
          if (props.spikes.some(spike => spike.x == i && spike.y == y)) {
            removeSpike(i, y);
            props.dispatch({ type: "change_bullet", data: [] });
          } else {
            props.dispatch({ type: "change_bullet", data: [{ x: i, y: y }] });
            if (i >= 0) {
              theLoop("left", i - 1);
            }
          }
        } else if (dir === "right") {
          if (props.spikes.some(spike => spike.x == i && spike.y == y)) {
            removeSpike(i, y);
            props.dispatch({ type: "change_bullet", data: [] });
          } else {
            props.dispatch({ type: "change_bullet", data: [{ x: i, y: y }] });

            if (i <= 20) {
              theLoop("right", i + 1);
            }
          }
        }
      }, 30);
    }

    if (direction == "up") {
      theLoop("up", y);
      // for (let i = y; i >= 0; i--) {
      //   if (props.spikes.some(spike => spike.x == x && spike.y == i)) {
      //     removeSpike(x, i);
      //     break;
      //   }
      // }
    }
    if (direction == "down") {
      theLoop("down", y);
      // for (let i = y; i <= 20; i++) {
      //   if (props.spikes.some(spike => spike.x == x && spike.y == i)) {
      //     removeSpike(x, i);
      //     break;
      //   }
      // }
    }
    if (direction == "left") {
      theLoop("left", x);
      // for (let i = y; i >= 0; i--) {
      //   if (props.spikes.some(spike => spike.x == i && spike.y == y)) {
      //     removeSpike(i, y);
      //     break;
      //   }
      // }
    }
    if (direction == "right") {
      theLoop("right", x);
      // for (let i = y; i <= 20; i++) {
      //   if (props.spikes.some(spike => spike.x == i && spike.y == y)) {
      //     removeSpike(i, y);
      //     break;
      //   }
      // }
    }
  };

  const removeSpike = (sx, sy) => {
    const newSpikes = props.spikes.filter(pack => {
      return !(pack.x == sx && pack.y == sy);
    });
    props.dispatch({
      type: "change_spikes",
      data: newSpikes
    });
  };
  const spikeChase = () => {
    const spikeArray = props.spikes.map(spike => {
      let num = utils.getRandomInt(10);
      let fast = num > 8 ? 2 : 1;
      if (num > 5) {
        const xdist = spike.x - x;
        const ydist = spike.y - y;
        if (Math.abs(xdist) > Math.abs(ydist)) {
          spike.x += xdist < 0 ? fast : -fast;
        } else {
          spike.y += ydist < 0 ? fast : -fast;
        }
        return spike;
      }
      return spike;
    });
    props.dispatch({ type: "change_spikes", data: spikeArray });
  };

  const addEnemy = () => {
    const enemies = props.spikes;
    const num = utils.getRandomInt(21);
    enemies.push({ x: num, y: 21 });
    props.dispatch({ type: "change_spikes", data: enemies });
  };

  return (
    <div {...ArrowKeysReact.events} className="App bg-dark">
      <div className="container">
        <div className="row">
          <div className="col-sm-2">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <Controls
              moveDown={() => shoot("down")}
              moveUp={() => shoot("up")}
              moveLeft={() => shoot("left")}
              moveRight={() => shoot("right")}
              addEnemy={addEnemy}
            />
          </div>
          <div className="col-sm-10">
            <br />
            <GameBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(function mapStateToProps(state, props) {
  return {
    player: state.player,
    spikes: state.spikes
  };
})(App);
