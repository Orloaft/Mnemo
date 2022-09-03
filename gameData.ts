import { EventEmitter } from "stream";
import { uuid } from "uuidv4";
import { getEnemy } from "./enemies";
export interface gameDataProps {
  id: string;
  paused: boolean;
  time: number;
  round: number;
  participatingSockets: string[];
  players: {
    id: string;
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    spell: string;
    target: number;
    spellReq: string[];
    spellInput: string[];
  }[];
  enemies: {
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    dmg: number;
    spellInput: string[];
    targeted: boolean;
    target: any;
  }[];
  spellTable: string[];
  spellInput: string[];
  spellReq: string[];
  concluded: boolean;
  animation: string;
}
const rounds = [...getEnemy()].map((enemy) => {
  return [{ ...enemy }, { ...enemy }, { ...enemy }];
});
let lobbyArr: {
  id: string;
  owner: string;
  players: { id: string; name: string; socket: string }[];
  name: string;
  messages: { author: string; body: string }[];
}[] = [];
let gamesArr: {
  id: string;
  paused: boolean;
  time: number;
  round: number;
  participatingSockets: string[];
  players: {
    id: string;
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    spell: string;
    target: number;
    spellReq: string[];
    spellInput: string[];
  }[];
  enemies: {
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    dmg: number;
    spellInput: string[];
    spell: string;
    targeted: boolean;
    target: any;
  }[];
  spellTable: string[];
  spellInput: string[];
  spellReq: string[];
  concluded: boolean;
  animation: string;
  score: string;
}[] = [];
function getGameDataHandler() {
  return {
    initLobby: function (owner, name): any {
      let newLobby = {
        id: uuid(),
        owner: owner.id,
        players: [{ ...owner }],
        name: name,
        messages: [],
      };
      lobbyArr.push(newLobby);
      return newLobby;
    },
    initGame: function (): any {
      let newGame = {
        id: uuid(),
        paused: false,
        time: 0,
        round: 0,
        participatingSockets: [],
        players: [],
        enemies: rounds[0].map((enemy) => {
          return { ...enemy };
        }),
        spellTable: [
          "lorem",
          "ipsum",
          "dolor",
          "sit",
          "amet",
          "adipisicing",
          "elit",
          "aut",
        ],
        spellInput: [],
        spellReq: [],
        concluded: false,
        animation: "normal",
        score: "",
      };
      gamesArr.push(newGame);
      newGame.enemies.forEach((enemy) => (enemy.spellInput = []));

      return newGame;
    },
    removeGame: function (id: string) {
      gamesArr = gamesArr.filter((game) => game.id !== id);
    },
    removeLobby: function (id: string) {
      lobbyArr = lobbyArr.filter((lobby) => lobby.id !== id);
    },
    getLobby: function (id: string) {
      return lobbyArr.find((lobby) => lobby.id === id);
    },
    getAllLobbies: function () {
      return lobbyArr;
    },
    getGame: function (id: string) {
      return gamesArr.find((game) => game.id === id);
    },
    getAllGames: function () {
      return gamesArr;
    },
    nextRound: function (id: string) {
      let game = gamesArr.find((game) => game.id === id);
      if (game.round + 1 < rounds.length) {
        game.round += 1;
        game.enemies = rounds[game.round].map((enemy) => {
          return { ...enemy };
        });
        game.enemies.forEach((enemy) => {
          enemy.target = Math.floor(Math.random() * game.players.length);
          enemy.spellInput = [];
        });
        return false;
      } else {
        game.concluded = true;
        game.enemies.forEach((enemy) => (enemy.spellInput = []));
        game.score = "Congratulations, you eviscerated all enemies!";
        return true;
      }
    },
  };
}
export default getGameDataHandler();
