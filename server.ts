import http from "http";
import express from "express";
import next from "next";
import getGameDataHandler, { gameDataProps } from "./gameData";
import getGameActionHandler from "./gameActions";
import gameData from "./gameData";

// function that allows next.js to handle the server side code
async function startServer() {
  const nextJsApp = next({ dev: true, conf: { reactStrictMode: true } });
  await nextJsApp.prepare();
  const app = express();
  app.all("*", nextJsApp.getRequestHandler() as any);

  const server = http.createServer(app);
  const io = require("socket.io")(server);

  //endpoint for initiating client connection
  io.on("connection", (socket: any) => {
    console.log("connected with", socket.id);
    socket.on("disconnecting", () => {
      console.log(socket.rooms); // the Set contains at least the socket ID
    });
    socket.on("init_gameData", (id: any) => {
      let newGame: gameDataProps = getGameDataHandler.initGame();
      getGameActionHandler.gameTimer(newGame.id, id, io);
      io.to(id).emit("update_res", newGame);
    });
    socket.on("update_req", (id: string, req: any) => {
      let gameData = getGameDataHandler.getGame(req.id);

      if (gameData && gameData.player.life <= 0) {
        gameData.concluded = true;
        io.to(id).emit("update_res", gameData);
      } else {
        getGameActionHandler.handleAction(req, io, id);
      }
    });
  });
  server.listen(process.env.PORT);
  console.log("listening at port:", process.env.PORT);
}
startServer();
