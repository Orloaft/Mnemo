import { uuid } from "uuidv4";
import { getEnemy } from "./enemies";
export interface gameDataProps {
  id: string;
  paused: boolean;
  time: number;
  round: number;
  participatingSockets: string[];
  player: {
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    spell: string;
    target: number;
  };
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
  }[];
  spellTable: string[];
  spellInput: string[];
  spellReq: string[];
  concluded: boolean;
  animation: string;
}
const rounds = [...getEnemy()];
const gamesArr: {
  id: string;
  paused: boolean;
  time: number;
  round: number;
  participatingSockets: string[];
  player: {
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    spell: string;
    target: number;
  };
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
    initGame: function (): any {
      let newGame = {
        id: uuid(),
        paused: false,
        time: 0,
        round: 0,
        participatingSockets: [],
        player: {
          name: "",
          life: 100,
          maxLife: 100,
          speed: 10,
          actionPoints: 0,
          action: "chanting",
          spell: "missle",
          target: 0,
        },
        enemies: [{ ...rounds[0] }, { ...rounds[1] }, { ...rounds[2] }],
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
        spellReq: ["lorem", "ipsum", "dolor"],
        concluded: false,
        animation: "normal",
        score: "",
      };
      gamesArr.push(newGame);
      newGame.enemies.forEach((enemy) => (enemy.spellInput = []));

      return newGame;
    },
    removeGame: function (id: string) {
      gamesArr.filter((game) => game.id !== id);
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
        game.enemies = [{ ...rounds[game.round] }];
        game.enemies.forEach((enemy) => (enemy.spellInput = []));
      } else {
        game.concluded = true;
        game.enemies.forEach((enemy) => (enemy.spellInput = []));
        game.score = "Congratulations, you eviscerated all enemies!";
      }
    },
  };
}
export default getGameDataHandler();
