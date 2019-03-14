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
  const shootHelper = direction => {
    if (props.heldWeapon === "pistol") {
      shootPistol(direction, x, y);
    }
    if (props.heldWeapon === "shotgun") {
      shootShotgun(direction, x, y, true, true, true, props.spikes);
    }
    if (props.heldWeapon === "sniper") {
      shootSniper(direction, x, y, props.spikes);
    }
  };

  const shootPistol = (dir, ix, iy) => {
    setTimeout(() => {
      if (dir === "up") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          removeSpike(ix, iy);
          removeBullet(ix, iy + 1);
        } else {
          removeBullet(ix, iy + 1);
          props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });

          if (iy >= 0) {
            shootPistol("up", ix, iy - 1);
          }
        }
      } else if (dir === "down") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          removeSpike(ix, iy);
          removeBullet(ix, iy - 1);
        } else {
          props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });
          if (iy <= 20) {
            shootPistol("down", ix, iy + 1);
          }
        }
      } else if (dir === "left") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          removeSpike(ix, iy);
          removeBullet(ix + 1, iy);
        } else {
          props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });
          if (ix >= 0) {
            shootPistol("left", ix - 1, iy);
          }
        }
      } else if (dir === "right") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          removeSpike(ix, iy);
          removeBullet(ix - 1, iy);
        } else {
          props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });

          if (ix <= 20) {
            shootPistol("right", ix + 1, iy);
          }
        }
      }
    }, 30);
  };

  const shootShotgun = (dir, ix, iy, a, b, c, spikeInput) => {
    setTimeout(() => {
      if (dir === "up") {
        let allSpikes = spikeInput;
        let bullets = props.bullet;
        bullets = bullets.filter(bul => {
          return !(
            (bul.x == ix - 1 || bul.x == ix || bul.x == ix + 1) &&
            bul.y == iy + 1
          );
        });
        if (a) {
          if (props.spikes.some(spike => spike.x == ix - 1 && spike.y == iy)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix - 1 && s.y == iy);
            });
            a = false;
          } else {
            bullets.push({ x: ix - 1, y: iy });
          }
        }
        if (b) {
          if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix && s.y == iy);
            });
            b = false;
          } else {
            bullets.push({ x: ix, y: iy });
          }
        }
        if (c) {
          if (props.spikes.some(spike => spike.x == ix + 1 && spike.y == iy)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix + 1 && s.y == iy);
            });
            c = false;
          } else {
            bullets.push({ x: ix + 1, y: iy });
          }
        }
        props.dispatch({ type: "change_spikes", data: allSpikes });
        props.dispatch({ type: "change_bullet", data: bullets });

        if (iy >= 0) {
          shootShotgun("up", ix, iy - 1, a, b, c, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      } else if (dir === "down") {
        let allSpikes = spikeInput;
        let bullets = props.bullet;
        bullets = bullets.filter(bul => {
          return !(
            (bul.x == ix - 1 || bul.x == ix || bul.x == ix + 1) &&
            bul.y == iy - 1
          );
        });
        if (a) {
          if (props.spikes.some(spike => spike.x == ix - 1 && spike.y == iy)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix - 1 && s.y == iy);
            });
            a = false;
          } else {
            bullets.push({ x: ix - 1, y: iy });
          }
        }
        if (b) {
          if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix && s.y == iy);
            });
            b = false;
          } else {
            bullets.push({ x: ix, y: iy });
          }
        }
        if (c) {
          if (props.spikes.some(spike => spike.x == ix + 1 && spike.y == iy)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix + 1 && s.y == iy);
            });
            c = false;
          } else {
            bullets.push({ x: ix + 1, y: iy });
          }
        }
        props.dispatch({ type: "change_spikes", data: allSpikes });
        props.dispatch({ type: "change_bullet", data: bullets });

        if (iy <= 20) {
          shootShotgun("down", ix, iy + 1, a, b, c, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      } else if (dir === "left") {
        let allSpikes = spikeInput;
        let bullets = props.bullet;
        bullets = bullets.filter(bul => {
          return !(
            (bul.y == iy - 1 || bul.y == iy || bul.y == iy + 1) &&
            bul.x == ix + 1
          );
        });
        if (a) {
          if (props.spikes.some(spike => spike.y == iy - 1 && spike.x == ix)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.y == iy - 1 && s.x == ix);
            });
            a = false;
          } else {
            bullets.push({ x: ix, y: iy - 1 });
          }
        }
        if (b) {
          if (props.spikes.some(spike => spike.y == iy && spike.x == ix)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix && s.y == iy);
            });
            b = false;
          } else {
            bullets.push({ x: ix, y: iy });
          }
        }
        if (c) {
          if (props.spikes.some(spike => spike.x == ix && spike.y == iy + 1)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix && s.y == iy + 1);
            });
            c = false;
          } else {
            bullets.push({ x: ix, y: iy + 1 });
          }
        }
        props.dispatch({ type: "change_spikes", data: allSpikes });
        props.dispatch({ type: "change_bullet", data: bullets });

        if (ix >= 0) {
          shootShotgun("left", ix - 1, iy, a, b, c, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      } else if (dir === "right") {
        let allSpikes = spikeInput;
        let bullets = props.bullet;
        bullets = bullets.filter(bul => {
          return !(
            (bul.y == iy - 1 || bul.y == iy || bul.y == iy + 1) &&
            bul.x == ix - 1
          );
        });
        if (a) {
          if (props.spikes.some(spike => spike.y == iy - 1 && spike.x == ix)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.y == iy - 1 && s.x == ix);
            });
            a = false;
          } else {
            bullets.push({ x: ix, y: iy - 1 });
          }
        }
        if (b) {
          if (props.spikes.some(spike => spike.y == iy && spike.x == ix)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix && s.y == iy);
            });
            b = false;
          } else {
            bullets.push({ x: ix, y: iy });
          }
        }
        if (c) {
          if (props.spikes.some(spike => spike.x == ix && spike.y == iy + 1)) {
            allSpikes = allSpikes.filter(s => {
              return !(s.x == ix && s.y == iy + 1);
            });
            c = false;
          } else {
            bullets.push({ x: ix, y: iy + 1 });
          }
        }
        props.dispatch({ type: "change_spikes", data: allSpikes });
        props.dispatch({ type: "change_bullet", data: bullets });

        if (ix <= 20) {
          shootShotgun("right", ix + 1, iy, a, b, c, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      }
    }, 30);
  };

  const shootSniper = (dir, ix, iy, spikesInput) => {
    setTimeout(() => {
      let allSpikes = spikesInput;
      if (dir === "up") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          allSpikes = allSpikes.filter(s => {
            return !(s.x == ix && s.y == iy);
          });
        }
        props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });
        props.dispatch({ type: "change_spikes", data: allSpikes });
        if (iy >= 0) {
          shootSniper("up", ix, iy - 1, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      } else if (dir === "down") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          allSpikes = allSpikes.filter(s => {
            return !(s.x == ix && s.y == iy);
          });
        }
        props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });
        props.dispatch({ type: "change_spikes", data: allSpikes });
        if (iy <= 20) {
          shootSniper("down", ix, iy + 1, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      } else if (dir === "left") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          allSpikes = allSpikes.filter(s => {
            return !(s.x == ix && s.y == iy);
          });
        }
        props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });
        props.dispatch({ type: "change_spikes", data: allSpikes });
        if (ix >= 0) {
          shootSniper("left", ix - 1, iy, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      } else if (dir === "right") {
        if (props.spikes.some(spike => spike.x == ix && spike.y == iy)) {
          allSpikes = allSpikes.filter(s => {
            return !(s.x == ix && s.y == iy);
          });
        }
        props.dispatch({ type: "change_bullet", data: [{ x: ix, y: iy }] });
        props.dispatch({ type: "change_spikes", data: allSpikes });
        if (ix <= 20) {
          shootSniper("right", ix + 1, iy, allSpikes);
        } else {
          props.dispatch({ type: "change_bullet", data: [] });
        }
      }
    }, 30);
  };

  const shoot = direction => {
    addEnemy();
    if (direction == "up") {
      shootHelper("up");
    }
    if (direction == "down") {
      shootHelper("down");
    }
    if (direction == "left") {
      shootHelper("left");
    }
    if (direction == "right") {
      shootHelper("right");
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

  const removeBullet = (bx, by) => {
    const newBullets = props.bullet.filter(bul => {
      return !(bul.x == bx && bul.y == by);
    });
    props.dispatch({
      type: "change_bullet",
      data: newBullets
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
          <div className="col-sm-9">
            <br />
            <GameBoard />
          </div>
          <div className="col-sm-3">
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
        </div>
      </div>
    </div>
  );
};

export default connect(function mapStateToProps(state, props) {
  return {
    player: state.player,
    spikes: state.spikes,
    heldWeapon: state.heldWeapon,
    bullet: state.bullet
  };
})(App);
