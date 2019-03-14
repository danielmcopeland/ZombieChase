import { createStore } from "redux";

const defaultState = {
  player: {
    location: {
      x: 0,
      y: 0
    },
    health: 50,
    healthPacks: 0
  },
  healthPacks: [{ x: 2, y: 3 }, { x: 6, y: 10 }, { x: 3, y: 7 }],
  spikes: [{ x: 8, y: 14 }, { x: 14, y: 8 }, { x: 16, y: 3 }, { x: 1, y: 18 }],
  bullet: []
};

function move(state = defaultState, action) {
  if (action.type === "change_player_location") {
    return {
      ...state,
      player: {
        location: action.data,
        health: state.player.health,
        healthPacks: state.player.healthPacks
      }
    };
  } else if (action.type === "add_health_pack") {
    return {
      ...state,
      player: {
        location: state.player.location,
        health: state.player.health,
        healthPacks: action.data
      }
    };
  } else if (action.type === "use_health_pack") {
    return {
      ...state,
      player: {
        location: state.player.location,
        health: state.player.health + 25,
        healthPacks: state.player.healthPacks - 1
      }
    };
  } else if (action.type === "change_player_health") {
    return {
      ...state,
      player: {
        location: state.player.location,
        health: action.data,
        healthPacks: state.player.healthPacks
      }
    };
  } else if (action.type === "change_healthPacks") {
    return {
      ...state,
      healthPacks: action.data
    };
  } else if (action.type === "change_spikes") {
    return {
      ...state,
      spikes: action.data
    };
  } else if (action.type === "change_bullet") {
    return {
      ...state,
      bullet: action.data
    };
  }
  return state;
}

const store = createStore(move);

export default store;
