import http from "http";
import express from "express";
import next from "next";
import getGameDataHandler, { gameDataProps } from "./gameData";
import getGameActionHandler from "./gameActions";

// function that allows next.js to handle the server side code
async function startServer() {
  const nextJsApp = next({ dev: false, conf: { reactStrictMode: true } });
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
      getGameDataHandler.getAllLobbies().forEach((lobby) => {
        lobby.players.find((p) => p.socket === socket.id) &&
          (lobby.players = lobby.players.filter((p) => p.socket !== socket.id));
        !lobby.players.length && getGameDataHandler.removeLobby(lobby.id);
      });
    });
    socket.on("join_lobby", async (roomId, player) => {
      let lobby = getGameDataHandler.getLobby(roomId);
      if (lobby && !lobby.players.find((p) => p.id === player.id)) {
        lobby.players.push(player);
        await socket.join(roomId);

        io.to(roomId).emit("lobby_state_res", lobby);
      }
    });
    socket.on("resume_game", async (id) => {
      await socket.join(id);
      io.to(id).emit("update_res", getGameDataHandler.getGame(id));
    });
    socket.on("get_games", (socketId) => {
      let lobbies = [...getGameDataHandler.getAllLobbies()];
      io.to(socketId).emit("get_games_res", lobbies);
    });
    socket.on("leave_lobby", (lobbyId, playerId) => {
      let lobby = getGameDataHandler.getLobby(lobbyId);
      lobby.players = lobby.players.filter((player) => player.id !== playerId);
      !lobby.players.length && getGameDataHandler.removeLobby(lobbyId);
      io.to(lobbyId).emit("lobby_state_res", lobby);
    });
    socket.on("delete_gameData", (id) => {
      getGameDataHandler.removeGame(id);
    });
    socket.on("init_lobby", async (name, owner) => {
      let newLobby = { ...getGameDataHandler.initLobby(owner, name) };
      await socket.join(newLobby.id);
      io.to(newLobby.id).emit("lobby_state_res", newLobby);
    });
    socket.on("send_message", (message, lobbyId, username) => {
      let lobby = getGameDataHandler.getLobby(lobbyId);

      lobby.messages.push({ author: username, body: message });

      io.to(lobby.id).emit("lobby_state_res", lobby);
    });
    socket.on("init_gameData", async (lobby: any) => {
      let newGame: gameDataProps = getGameDataHandler.initGame(
        lobby.difficulty
      );
      newGame.id = lobby.id;
      newGame.difficulty = lobby.difficulty;
      lobby.players.forEach((p) => {
        newGame.players.push({
          id: p.id,
          name: p.name,
          life: 100,
          maxLife: 100,
          speed: 10,
          modifiers: [],
          actionPoints: 0,
          action: "chanting",
          spell: { ...p.knownSpells[0] },
          knownSpells: p.knownSpells,
          target: 0,
          spellReq: ["lorem", "ipsum", "dolor"],
          spellInput: [],
          overcharge: 0,
        });
      });
      await socket.join(lobby.id);
      getGameDataHandler.removeLobby(lobby.id);
      getGameActionHandler.gameTimer(newGame.id, io);

      io.to(lobby.id).emit("update_res", newGame);
    });
    socket.on("update_req", (playerId: string, req: any) => {
      let gameData = getGameDataHandler.getGame(req.id);

      if (gameData && !gameData.players.find((p) => p.life > 0)) {
        gameData.concluded = true;
        gameData.score = "Player defeated";
        io.to(gameData.id).emit("update_res", gameData);
      } else {
        getGameActionHandler.handleAction(req, io, playerId);
      }
    });
  });
  server.listen(process.env.PORT);
  console.log("listening at port:", process.env.PORT);
}
startServer();
