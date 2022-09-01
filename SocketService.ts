import io from "socket.io-client";
let socket: any = null;
let gameData: any = null;
let lobbyData: any = null;
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
      socket.emit("resume_game", socket.id, localStorage.getItem("matchId"));
    },
    initLobby: function (name) {
      let owner = {
        id: null,
        name: localStorage.getItem("username"),
        socket: socket.id,
      };
      socket.emit("init_lobby", name, owner);
    },
    initGame: function () {
      socket.emit("init_gameData", socket.id, localStorage.getItem("username"));
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
      socket.emit("update_req", socket.id, req);
    },
    joinLobby: function (lobbyId) {
      socket.emit(
        "join_lobby",
        socket.id,
        lobbyId,
        localStorage.getItem("username")
      );
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
