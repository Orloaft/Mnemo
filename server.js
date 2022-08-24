const http = require("http");
const express = require("express");
const next = require("next");
const { uuid } = require("uuidv4");
const gamesArr = [];
// function that allows next.js to handle the server side code
async function startServer() {
  const nextJsApp = next({ dev: true, conf: { reactStrictMode: true } });
  await nextJsApp.prepare();
  const app = express();
  app.all("*", nextJsApp.getRequestHandler());

  const server = http.createServer(app);
  const io = require("socket.io")(server);
  //endpoint for initiating client connection
  io.on("connection", (socket) => {
    console.log("connected with", socket.id);
    socket.on("init_gameData", (id) => {
      let newGame = {
        id: uuid(),
        time: 0,
        player: { life: 100, speed: 5 },
        enemy: { life: 50, speed: 5 },
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
      };
      gamesArr.push(newGame);
      io.to(id).emit("update_res", newGame);
    });
    socket.on("update_req", (id, req) => {
      let gameData = gamesArr.find((g) => g.id === req.id);
      switch (req.type) {
        case "update":

        case "addWord":
          gameData.spellInput.push(req.word);
          if (gameData.spellInput.join("") === gameData.spellReq.join("")) {
            gameData.enemy.health -= 10;
            if (gameData.enemy.health <= 0) {
              gameData.concluded = true;
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
