import { uuid } from "uuidv4";
import { getEnemy } from "./enemies";
export interface gameDataProps {
  id: string;
  time: number;
  round: number;
  player: {
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
  time: number;
  round: number;
  player: {
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
        time: 0,
        round: 0,
        player: {
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
      console.log(newGame.id);
      return newGame;
    },
    getGame: function (id: string) {
      return gamesArr.find((game) => game.id === id);
    },
    nextRound: function (id: string) {
      let game = gamesArr.find((game) => game.id === id);
      if (game.round + 1 < rounds.length) {
        game.round += 1;
        game.enemies = [{ ...rounds[game.round] }];
      } else {
        game.concluded = true;
        game.score = "Congratulations, you eviscerated all enemies!";
      }
    },
  };
}
export default getGameDataHandler();
