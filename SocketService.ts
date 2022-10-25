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
    getPlayer: function () {
      return gameData.players.find((player) => player.id === playerId);
    },
    closeGame: function () {
      socket.emit("delete_gameData", gameData.id);
    },
    resumeGame: function () {
      socket.emit("resume_game", localStorage.getItem("matchId"));
    },
    setPlayerId: function () {
      playerId = JSON.parse(localStorage.getItem("credentials")).token;
    },
    getPlayerId: function () {
      return playerId;
    },
    initLobby: function (name) {
      let owner = {
        id: JSON.parse(localStorage.getItem("credentials")).token,
        name: JSON.parse(localStorage.getItem("credentials")).name,
        socket: socket.id,
        knownSpells: JSON.parse(localStorage.getItem("credentials"))
          .knownSpells,
      };
      playerId = owner.id;
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
      socket.emit("leave_lobby", lobbyId, playerId);
    },
    initGame: function (difficulty) {
      !playerId &&
        (playerId = JSON.parse(localStorage.getItem("credentials")).token);

      lobbyData && (lobbyData.difficulty = difficulty);
      socket.emit(
        "init_gameData",
        lobbyData || {
          id: uuid(),
          players: [
            {
              id: playerId,
              name: JSON.parse(localStorage.getItem("credentials")).name,
              knownSpells: JSON.parse(localStorage.getItem("credentials"))
                .knownSpells,
            },
          ],
          difficulty: difficulty,
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
        playerId || JSON.parse(localStorage.getItem("credentials")).token,
        req
      );
    },
    joinLobby: function (lobbyId) {
      let player = {
        name: JSON.parse(localStorage.getItem("credentials")).name,
        id: JSON.parse(localStorage.getItem("credentials")).token,
        socket: socket.id,
        knownSpells: JSON.parse(localStorage.getItem("credentials"))
          .knownSpells,
      };
      playerId = player.id;

      socket.emit("join_lobby", lobbyId, player);
    },
    sendMessage: function (message, lobbyId) {
      //send a message signed with your username to current lobby
      socket.emit(
        "send_message",
        message,
        lobbyId,
        JSON.parse(localStorage.getItem("credentials")).name
      );
    },
  }; // socket instance that will persist across all components
}

export default getSocketService();
