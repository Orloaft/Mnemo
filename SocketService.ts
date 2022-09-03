import io from "socket.io-client";
import { uuid } from "uuidv4";
let socket: any = null;
let gameData: any = null;
let config: any = null;
let playerId = null;
let lobbyData = null;
//class component for handling clients instance of socket connection and exported to any components that need to interact with said instance.
function getSocketService() {
  return {
    socket: function () {
      return socket;
    },
    setGameData: function (obj) {
      gameData = { ...obj };
    },
    getGameData: function () {
      return gameData;
    },
    closeGame: function () {
      socket.emit("delete_gameData", gameData.id);
    },
    resumeGame: function () {
      socket.emit("resume_game", localStorage.getItem("matchId"));
    },
    setPlayerId: function () {
      playerId = localStorage.getItem("playerId");
    },
    getPlayerId: function () {
      return playerId;
    },
    initLobby: function (name) {
      let owner = {
        id: uuid(),
        name: localStorage.getItem("username"),
        socket: socket.id,
      };
      playerId = owner.id;
      localStorage.setItem("playerId", playerId);
      socket.emit("init_lobby", name, owner);
    },
    getLobbyData: function () {
      return lobbyData;
    },
    setLobbyData: function (data) {
      lobbyData = data;
    },
    leaveLobby: function (lobbyId) {
      lobbyData = null;
      localStorage.removeItem("playerId");

      socket.emit("leave_lobby", lobbyId, playerId);
      playerId = null;
    },
    initGame: function () {
      !playerId && (playerId = uuid());
      localStorage.setItem("playerId", playerId);
      socket.emit(
        "init_gameData",
        lobbyData || {
          id: uuid(),
          players: [{ id: playerId, name: localStorage.getItem("username") }],
        }
      );
    },
    //method to initiate socket instance
    connect: function () {
      return new Promise((rs, rj) => {
        socket = io();

        if (!socket) return rj();

        socket.on("connect", () => {
          rs(socket);
        });
      });
    },
    getGames: function () {
      socket.emit("get_games", socket.id);
    },
    update: function (req) {
      //send an update to the battle state which is handled by a switch statement
      socket.emit(
        "update_req",
        playerId || localStorage.getItem("playerId"),
        req
      );
    },
    joinLobby: function (lobbyId) {
      let player = {
        name: localStorage.getItem("username"),
        id: uuid(),
        socket: socket.id,
      };
      playerId = player.id;
      localStorage.setItem("playerId", playerId);
      socket.emit("join_lobby", lobbyId, player);
    },
    sendMessage: function (message, lobbyId) {
      //send a message signed with your username to current lobby
      socket.emit(
        "send_message",
        message,
        lobbyId,
        localStorage.getItem("username")
      );
    },
  }; // socket instance that will persist across all components
}

export default getSocketService();
