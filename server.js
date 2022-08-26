const http = require("http");
const express = require("express");
const next = require("next");
const { uuid } = require("uuidv4");
const gamesArr = [];
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
// function that allows next.js to handle the server side code
async function startServer() {
  const nextJsApp = next({ dev: true, conf: { reactStrictMode: true } });
  await nextJsApp.prepare();
  const app = express();
  app.all("*", nextJsApp.getRequestHandler());

  const server = http.createServer(app);
  const io = require("socket.io")(server);
  const gameTimer = (roomId, socket) => {
    let gameData = gamesArr.find((g) => g.id === roomId);
    // Update the count down every 1 second
    const x = setInterval(() => {
      if (gameData.concluded) {
        console.log("clearing timer");
        clearInterval(x);
      } else {
        gameData.time += 1;
        if (gameData.player.action === "chanting") {
          gameData.player.actionPoints += 1;
        }
        if (gameData.enemy.action === "chanting") {
          gameData.enemy.actionPoints += 1;
        }
        if (gameData.enemy.action === "casting") {
          gameData.player.life -= 10;
          gameData.enemy.action = "chanting";
        }

        if (gameData.enemy.actionPoints >= 15 - gameData.enemy.speed) {
          gameData.enemy.action = "casting";
          gameData.enemy.actionPoints = 0;
        }
        if (gameData.player.actionPoints >= 15 - gameData.player.speed) {
          gameData.player.action = "casting";
        }
        io.to(socket).emit("update_res", gameData);
      }
    }, 1000);
    return x;
  };
  //endpoint for initiating client connection
  io.on("connection", (socket) => {
    console.log("connected with", socket.id);
    socket.on("disconnecting", () => {
      console.log(socket.rooms); // the Set contains at least the socket ID
    });
    socket.on("init_gameData", (id) => {
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
      gameTimer(newGame.id, id);
      io.to(id).emit("update_res", newGame);
    });
    socket.on("update_req", (id, req) => {
      let gameData = gamesArr.find((g) => g.id === req.id);
      if (gameData.player.life <= 0) {
        gameData.concluded = true;
      }
      switch (req.type) {
        case "animate":
          gameData.animation = req.animation;
        case "clearMatch":
          gameData.concluded = true;

        case "addWord":
          gameData.spellInput.push(req.word);
          if (gameData.spellInput.length === gameData.spellReq.length) {
            if (gameData.spellInput.join("") === gameData.spellReq.join("")) {
              gameData.animation = "casting";
              gameData.player.actionPoints = 0;
              io.to(id).emit("update_res", gameData);

              setTimeout(() => {
                gameData.enemy.life -= 30;
                gameData.spellInput = [];
                gameData.spellReq = [...gameData.spellTable]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 3);
                gameData.animation = "normal";
                gameData.player.action = "chanting";

                if (gameData.enemy.life <= 0) {
                  if (gameData.round + 1 < rounds.length) {
                    gameData.round += 1;
                    gameData.enemy = { ...rounds[gameData.round] };
                  } else {
                    gameData.concluded = true;
                  }
                }
                io.to(id).emit("update_res", gameData);
              }, 1000);
            } else {
              gameData.animation = "failed";
              io.to(id).emit("update_res", gameData);
              setTimeout(() => {
                gameData.spellInput = [];
                gameData.animation = "normal";
                io.to(id).emit("update_res", gameData);
              }, 1000);
            }
          }
      }
      io.to(id).emit("update_res", gameData);
    });
  });
  server.listen(process.env.PORT);
  console.log("listening at port:", process.env.PORT);
}
startServer();
