import React, { Component } from "react";
import "./App.css";
import GameBoard from "./GameBoard";
import { connect } from "react-redux";
import Controls from "./Controls";
import utils from "./utils";
import KeyboardEventHandler from "react-keyboard-event-handler";
import GameOver from "./GameOver";

const App = props => {
  const { x, y } = props.player.location;
  const winCondition = props.spikes.length == 0;
  const gameOver = props.player.health <= 0 || winCondition;

  const keyPress = key => {
    if (key === "w") {
      moveUp();
    }
    if (key === "a") {
      moveLeft();
    }
    if (key === "s") {
      moveDown();
    }
    if (key === "d") {
      moveRight();
    }
    if (key === "up") {
      shoot("up");
    }
    if (key === "down") {
      shoot("down");
    }
    if (key === "left") {
      shoot("left");
    }
    if (key === "right") {
      shoot("right");
    }
    if (key === "1") {
      selectWeapon("pistol");
    }
    if (key === "2") {
      if (props.equipedWeapons.length >= 2) {
        selectWeapon(props.equipedWeapons[1]);
      }
    }
    if (key === "3") {
      if (props.equipedWeapons.length >= 3) {
        selectWeapon(props.equipedWeapons[2]);
      }
    }
    if (key === "h") {
      useHealthPack();
    }
  };
  const useHealthPack = () => {
    if (props.player.healthPacks > 0) {
      props.dispatch({ type: "use_health_pack" });
    }
  };
  const selectWeapon = weapon => {
    props.dispatch({ type: "change_equiped_weapon", data: weapon });
  };
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
      switch (utils.getRandomInt(8)) {
        case 0:
          addEnemy(2);
          break;
        case 1:
          addEnemy(1);
          break;
        case 2:
          addEnemy(1);
          break;
        case 3:
          addEnemy(1);
          break;
        case 4:
          addEnemy(1);
          break;
        default:
          break;
      }
    }
    if (props.heldWeapon === "shotgun") {
      shootShotgun(direction, x, y, true, true, true, props.spikes);
      switch (utils.getRandomInt(6)) {
        case 0:
          addEnemy(4);
          break;
        case 1:
          addEnemy(3);
          break;
        case 2:
          addEnemy(2);
          break;
        case 3:
          addEnemy(2);
          break;
        case 4:
          addEnemy(2);
          break;
        default:
          addEnemy(1);
      }
    }
    if (props.heldWeapon === "sniper") {
      shootSniper(direction, x, y, props.spikes);
      switch (utils.getRandomInt(6)) {
        case 0:
          addEnemy(7);
          break;
        case 1:
          addEnemy(5);
          break;
        case 2:
          addEnemy(4);
          break;
        case 3:
          addEnemy(3);
          break;
        case 4:
          addEnemy(3);
          break;
        default:
          addEnemy(2);
      }
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
    }, 20);
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
    }, 20);
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
    }, 20);
  };
  const shoot = direction => {
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
  const addEnemy = n => {
    if (n == 0) {
      return;
    }
    const enemies = props.spikes;
    const num = utils.getRandomInt(21);
    enemies.push({ x: num, y: 20 });
    props.dispatch({ type: "change_spikes", data: enemies });
    addEnemy(n - 1);
  };

  return (
    <div className="App bg-dark">
      <div className="container">
        <div className="row">
          <div className="col-sm-9">
            <br />
            {gameOver ? (
              winCondition ? (
                <GameOver condition={true} />
              ) : (
                <GameOver condition={false} />
              )
            ) : (
              <GameBoard />
            )}
          </div>
          <div className="col-sm-3">
            <br />
            <div className="inventory playerInfo">
              <h3>Instructions</h3>
              <div>Use WASD to move</div>
              <div>Use arrow keys to shoot</div>
              <div>Select weapon from inventory using the number keys</div>
              <div>H to use a health pack</div>
              <p>
                Beware, each shot will attract more zombies, and some guns are
                louder than others
              </p>
              <p>
                Switch weapons by clicking the desired weapon in your inventory
              </p>
            </div>
            <div className="inventory playerInfo">
              <h3>Key</h3>
              <div>O = Player</div>
              <div>X = Zombie</div>
              <div>S = Shotgun</div>
              <div>R = Sniper Rifle</div>
              <div>+ = Health Pack</div>
            </div>
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
      <KeyboardEventHandler
        handleKeys={[
          "w",
          "a",
          "s",
          "d",
          "left",
          "right",
          "up",
          "down",
          "1",
          "2",
          "3",
          "h"
        ]}
        onKeyEvent={(key, e) => keyPress(key)}
      />
    </div>
  );
};

export default connect(function mapStateToProps(state, props) {
  return {
    player: state.player,
    spikes: state.spikes,
    heldWeapon: state.heldWeapon,
    bullet: state.bullet,
    equipedWeapons: state.equipedWeapons
  };
})(App);
