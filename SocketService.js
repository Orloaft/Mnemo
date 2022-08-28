import io from "socket.io-client";

//class component for handling clients instance of socket connection and exported to any components that need to interact with said instance.
class SocketService {
  // socket instance that will persist across all components
  socket = null;
  gameData = null;
  update = this.updateData.bind(this);
  async initGame() {
    this.socket.emit("init_gameData", this.socket.id);
  }
  //method to initiate socket instance
  async connect() {
    this.socket = io("/");
  }
  async updateData(req) {
    this.socket.emit("update_req", this.socket.id, req);
  }
}

export default new SocketService();
