import { EventEmitter } from "stream";
import { uuid } from "uuidv4";
import { getEnemy } from "./enemies";
import knex from "knex";
export interface enemyProps {
  spell: any;
  name: string;
  animation: string;
  life: number;
  maxLife: number;
  modifiers: string[];
  speed: number;
  actionPoints: number;
  invuln: boolean;
  action: string;
  dmg: number;
  spellInput: { word: string; isFlagged: boolean }[];
  targeted: boolean;
  target: any;
}

export interface playerProps {
  id: string;
  name: string;
  life: number;
  maxLife: number;
  speed: number;
  modifiers: string[];
  actionPoints: number;
  action: string;
  spell: { name: string; lvl: number };
  target: number;
  knownSpells: { name: string; lvl: number }[];
  spellReq: string[];
  spellInput: string[];
  overcharge: number;
}
export interface gameDataProps {
  id: string;
  paused: boolean;
  time: number;
  round: number;
  log: string[];
  participatingSockets: string[];
  difficulty: string;
  players: playerProps[];
  enemies: enemyProps[];
  spellTable: string[];
  spellInput: string[];
  spellReq: string[];
  concluded: boolean;
  animation: string;
  score?: string;
}

const rounds = [...getEnemy(null)].map((enemy) => {
  return { ...enemy };
});
let lobbyArr: {
  id: string;
  owner: string;
  players: { id: string; name: string; socket: string }[];
  name: string;
  messages: { author: string; body: string }[];
}[] = [];
let gamesArr: gameDataProps[] = [];
// look up each player by token and add xp to data
const awardXp = (game: gameDataProps) => {
  for (let player of game.players) {
    knex("./gameUserData.db")
      .select()
      .from("users")
      .where({ token: player.id })
      .then((users) => {
        let newData = JSON.parse(users[0].data);
        switch (game.difficulty) {
          case "easy":
            newData.xp += game.round * 10;
            break;
          case "medium":
            newData.xp += game.round * 15;
            break;
          case "hard":
            newData.xp += game.round * 30;
            break;
        }

        knex("./gameUserData.db")
          .update({ data: JSON.stringify(newData) })
          .from("users")
          .where({ token: player.id })
          .then(() => {})
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
};
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
    initGame: function (difficulty): any {
      let newGame = {
        id: uuid(),
        paused: false,
        time: 0,
        round: 0,
        log: [],
        participatingSockets: [],
        players: [],
        difficulty: difficulty,
        enemies: [],
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
      switch (difficulty) {
        case "easy":
          newGame.enemies = [{ ...rounds[Math.floor(Math.random() * 3)] }];
          break;
        case "medium":
          newGame.enemies = [
            { ...rounds[Math.floor(Math.random() * 3)] },
            { ...rounds[Math.floor(Math.random() * 3)] },
          ];
          break;
        case "hard":
          newGame.enemies = [
            { ...rounds[Math.floor(Math.random() * 3)] },
            { ...rounds[Math.floor(Math.random() * 3)] },
            { ...rounds[Math.floor(Math.random() * 3)] },
          ];
          break;
      }
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
      awardXp(game);
      if (game.round + 1 < 30) {
        game.round += 1;
        switch (game.difficulty) {
          case "easy":
            game.enemies = [
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
            ];
            break;
          case "medium":
            game.enemies = [
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
            ];
            break;
          case "hard":
            game.enemies = [
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
              {
                ...rounds[
                  Math.floor(
                    Math.random() * (game.round < 10 ? game.round + 1 : 10)
                  )
                ],
              },
            ];
            break;
        }
        game.enemies.forEach((enemy) => {
          enemy.target = Math.floor(Math.random() * game.players.length);
          enemy.spellInput = [];
        });
        return false;
      } else {
        game.concluded = true;
        awardXp(game);
        game.enemies.forEach((enemy) => (enemy.spellInput = []));
        game.score = "Congratulations, you defeated all enemies!";
        return true;
      }
    },
  };
}
export default getGameDataHandler();
