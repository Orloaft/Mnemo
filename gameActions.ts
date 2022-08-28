import getGameDataHandler from "./gameData";

export function getGameActionHandler() {
  return {
    gameTimer: function (roomId: string, socket: any, io: any) {
      let gameData = getGameDataHandler.getGame(roomId);

      // Update the count down every 1 second
      const x = setInterval(() => {
        if (gameData.player.life <= 0) {
          gameData.concluded = true;
          gameData.score = "player defeated";
          io.to(socket).emit("update_res", gameData);
        }
        if (gameData && gameData.concluded) {
          console.log("clearing timer");
          io.to(socket).emit("update_res", gameData);
          clearInterval(x);
        } else {
          gameData && (gameData.time += 1);
          if (gameData && gameData.player.action === "chanting") {
            gameData && (gameData.player.actionPoints += 1);
          }
          if (gameData && gameData.enemy.action === "chanting") {
            gameData.enemy.actionPoints += 1;
          }
          if (gameData && gameData.enemy.action === "casting") {
          }

          if (
            gameData &&
            gameData.enemy.actionPoints >= 15 - gameData.enemy.speed
          ) {
            gameData.enemy.action = "casting";
            io.to(socket).emit("update_res", gameData);
            setTimeout(() => {
              gameData.enemy.actionPoints = 0;
              gameData.player.life -= 10;
              gameData.enemy.action = "chanting";
              io.to(socket).emit("update_res", gameData);
            }, 1000);
          }
          if (
            gameData &&
            gameData.player.actionPoints >= 15 - gameData.player.speed
          ) {
            setTimeout(() => {
              gameData.player.action = "casting";
            }, 1000);
          }
          io.to(socket).emit("update_res", gameData);
        }
      }, 1000);
    },
    handleAction: function (req, io, socketId) {
      let gameData = getGameDataHandler.getGame(req.id);

      switch (req.type) {
        case "spellSelect":
          gameData.player.spell = req.spell;
          io.to(socketId).emit("update_res", gameData);
          break;
        case "animate":
          gameData && (gameData.animation = req.animation);
        case "clearMatch":
          gameData && (gameData.concluded = true);
          io.to(socketId).emit("update_res", gameData);

        case "addWord":
          gameData && gameData.spellInput.push(req.word);
          if (
            gameData &&
            gameData.spellInput.length === gameData.spellReq.length
          ) {
            if (gameData.spellInput.join("") === gameData.spellReq.join("")) {
              gameData.animation = "casting";
              gameData.player.actionPoints = 0;
              io.to(socketId).emit("update_res", gameData);
              setTimeout(() => {
                if (gameData) {
                  switch (gameData.player.spell) {
                    case "missle":
                      gameData.enemy.life -= 30;
                      break;
                    case "heal":
                      if (gameData.player.life + 30 > gameData.player.maxLife) {
                        gameData.player.life = gameData.player.maxLife;
                      } else {
                        gameData.player.life += 30;
                      }

                      break;
                  }

                  gameData.spellInput = [];
                  gameData.spellReq = [...gameData.spellTable]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);
                  gameData.animation = "normal";
                  gameData.player.action = "chanting";
                  if (gameData && gameData.enemy.life <= 0) {
                    getGameDataHandler.nextRound(gameData.id);
                  }
                  io.to(socketId).emit("update_res", gameData);
                }
              }, 1000);
            } else {
              gameData.animation = "failed";
              io.to(socketId).emit("update_res", gameData);
              setTimeout(() => {
                if (gameData) {
                  gameData.spellInput = [];
                  gameData.animation = "normal";
                  io.to(socketId).emit("update_res", gameData);
                }
              }, 1000);
            }
          } else {
            io.to(socketId).emit("update_res", gameData);
          }
      }
    },
  };
}
export default getGameActionHandler();
