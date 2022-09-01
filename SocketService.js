import io from "socket.io-client";

//class component for handling clients instance of socket connection and exported to any components that need to interact with said instance.
class SocketService {
  // socket instance that will persist across all components
  socket = null;
  gameData = null;
  update = this.updateData.bind(this);
  closeGame = this.closeGame.bind(this);
  resumeGame = this.resumeGame.bind(this);
  getGames = this.getGames.bind(this);
  async closeGame() {
    this.socket.emit("delete_gameData", this.gameData.id);
  }
  resumeGame() {
    this.socket.emit(
      "resume_game",
      this.socket.id,
      localStorage.getItem("matchId")
    );
  }
  async initGame() {
    this.socket.emit(
      "init_gameData",
      this.socket.id,
      localStorage.getItem("username")
    );
  }
  //method to initiate socket instance
  async connect() {
    return new Promise((rs, rj) => {
      this.socket = io();

      if (!this.socket) return rj();

      this.socket.on("connect", () => {
        rs(this.socket);
      });
    });
  }
  async getGames() {
    this.socket.emit("get_games", this.socket.id);
  }
  async updateData(req) {
    this.socket.emit("update_req", this.socket.id, req);
  }
}

export default new SocketService();
