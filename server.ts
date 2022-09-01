import http from "http";
import express from "express";
import next from "next";
import getGameDataHandler, { gameDataProps } from "./gameData";
import getGameActionHandler from "./gameActions";
import { uuid } from "uuidv4";

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
    //when a socket disconnects. check which game it was in and pause that game and remove socketId
    socket.on("disconnecting", () => {
      getGameDataHandler.getAllGames().forEach((game) => {
        if (
          game.participatingSockets.find((socketId) => socketId === socket.id)
        ) {
          game.paused = true;
          game.participatingSockets.filter(
            (socketId) => socketId !== socket.id
          );
        }
      });
    });
    socket.on("join_lobby", (socket, roomId, playerName) => {
      getGameDataHandler
        .getLobby(roomId)
        .players.push({ name: playerName, id: uuid(), socket: socket });
      // getGameDataHandler.getGame(roomId).players.push({
      //   name: playerName,
      //   life: 100,
      //   maxLife: 100,
      //   speed: 10,
      //   actionPoints: 0,
      //   action: "chanting",
      //   spell: "missle",
      //   target: 0,
      // });
      io.to(socket).emit("join_lobby_res", getGameDataHandler.getGame(roomId));
    });
    socket.on("resume_game", (socket, id) => {
      io.to(socket).emit("update_res", getGameDataHandler.getGame(id));
    });
    socket.on("get_games", (socketId) => {
      let lobbies = [...getGameDataHandler.getAllLobbies()];
      io.to(socketId).emit("get_games_res", lobbies);
    });
    socket.on("delete_gameData", (id) => {
      getGameDataHandler.removeGame(id);
    });
    socket.on("init_lobby", (name, owner) => {
      let newLobby = { ...getGameDataHandler.initLobby(owner, name) };
      io.to(owner.socket).emit("lobby_state_res", newLobby);
    });
    socket.on("send_message", (message, lobbyId, username) => {
      let lobby = getGameDataHandler.getLobby(lobbyId);

      lobby.messages.push({ author: username, body: message });

      // io.to(lobby.socket).emit("lobby_state_res", lobby);
    });
    socket.on("init_gameData", (id: any, name: string) => {
      let newGame: gameDataProps = getGameDataHandler.initGame();
      getGameActionHandler.gameTimer(newGame.id, id, io);
      newGame.players[0].name = name;
      io.to(id).emit("update_res", newGame);
    });
    socket.on("update_req", (id: string, req: any) => {
      let gameData = getGameDataHandler.getGame(req.id);

      if (gameData && gameData.players[0].life <= 0) {
        gameData.concluded = true;
        gameData.score = "Player defeated";
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
