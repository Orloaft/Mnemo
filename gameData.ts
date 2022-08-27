import { uuid } from "uuidv4";
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
  };
  enemy: {
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    dmg: number;
  };
  spellTable: string[];
  spellInput: string[];
  spellReq: string[];
  concluded: boolean;
  animation: string;
}
const rounds = [
  {
    name: "goblin",
    life: 20,
    maxLife: 20,
    speed: 5,
    actionPoints: 0,
    action: "chanting",
    dmg: 5,
  },
  {
    name: "wraith",
    life: 40,
    maxLife: 40,
    speed: 7,
    actionPoints: 0,
    action: "chanting",
    dmg: 15,
  },
  {
    name: "megawraith",
    life: 60,
    maxLife: 60,
    speed: 9,
    actionPoints: 0,
    action: "chanting",
    dmg: 25,
  },
];
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
  };
  enemy: {
    name: string;
    life: number;
    maxLife: number;
    speed: number;
    actionPoints: number;
    action: string;
    dmg: number;
  };
  spellTable: string[];
  spellInput: string[];
  spellReq: string[];
  concluded: boolean;
  animation: string;
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
        },
        enemy: { ...rounds[0] },
        spellTable: [
          "Lorem",
          "ipsum",
          "dolor",
          "sit",
          "amet",
          "adipisicing",
          "elit",
          "Aut",
          "blanditiis",
          "sunt",
          "quisquam",
          "molestiae",
          "magnam",
        ],
        spellInput: [],
        spellReq: ["Lorem", "ipsum", "dolor"],
        concluded: false,
        animation: "normal",
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
        game.enemy = { ...rounds[game.round] };
      } else {
        game.concluded = true;
      }
    },
  };
}
export default getGameDataHandler();
