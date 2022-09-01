import getGameDataHandler from "./gameData";

export function getGameActionHandler() {
  return {
    gameTimer: function (roomId: string, socket: any, io: any) {
      let gameData = getGameDataHandler.getGame(roomId);
      gameData.participatingSockets.push(socket);
      gameData.enemies[0].targeted = true;
      // Update the count down every 1 second
      const x = setInterval(() => {
        if (!gameData.paused) {
          if (gameData.players[0].life <= 0) {
            gameData.enemies.forEach((enemy) => (enemy.spellInput = []));
            gameData.concluded = true;
            gameData.score = "player defeated";
            gameData.participatingSockets.forEach((socketId) => {
              io.to(socketId).emit("update_res", gameData);
            });
            getGameDataHandler.removeGame(gameData.id);
          }
          if (gameData && gameData.concluded) {
            gameData.participatingSockets.forEach((socketId) => {
              io.to(socketId).emit("update_res", gameData);
            });
            getGameDataHandler.removeGame(roomId);
            clearInterval(x);
          } else {
            gameData && (gameData.time += 1);
            if (gameData && gameData.players[0].action === "chanting") {
              gameData && (gameData.players[0].actionPoints += 3);
            }

            gameData.enemies.forEach((enemy) => {
              if (enemy.action === "chanting" && enemy.life > 0) {
                enemy.actionPoints += 1;
                if (enemy.actionPoints % 5 === 0) {
                  enemy.spellInput.push(
                    [...gameData.spellTable]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 1)[0]
                  );

                  gameData.participatingSockets.forEach((socketId) => {
                    io.to(socketId).emit("update_res", gameData);
                  });
                }
              }
              if (enemy.actionPoints >= 15) {
                enemy.action = "casting";

                gameData.participatingSockets.forEach((socketId) => {
                  io.to(socketId).emit("update_res", gameData);
                });
                setTimeout(() => {
                  switch (enemy.spell) {
                    case "missle":
                      gameData.players[0].life -= enemy.dmg;
                  }
                  enemy.spellInput = [];
                  enemy.actionPoints = 0;

                  enemy.action = "chanting";
                  gameData.participatingSockets.forEach((socketId) => {
                    io.to(socketId).emit("update_res", gameData);
                  });
                }, 1000);
              }
            });

            if (gameData && gameData.players[0].actionPoints >= 15) {
              setTimeout(() => {
                gameData.players[0].action = "casting";
              }, 1000);
            }
            gameData.participatingSockets.forEach((socketId) => {
              io.to(socketId).emit("update_res", gameData);
            });
          }
        }
      }, 1000);
    },
    handleAction: function (req, io, socketId) {
      let gameData = getGameDataHandler.getGame(req.id);

      switch (req.type) {
        case "addPlayerSocket":
          gameData && gameData.participatingSockets.push(req.socket);
          break;
        case "pause":
          gameData.paused = !gameData.paused;
          io.to(socketId).emit("update_res", gameData);
          break;
        case "spellSelect":
          gameData.players[0].spell = req.spell;
          gameData.spellReq = [...gameData.spellTable]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          io.to(socketId).emit("update_res", gameData);
          break;
        case "animate":
          gameData && (gameData.animation = req.animation);
          io.to(socketId).emit("update_res", gameData);
          setTimeout(() => {
            gameData && (gameData.animation = "normal");
            io.to(socketId).emit("update_res", gameData);
          }, req.duration);

          break;
        case "enemyClicked":
          gameData.players[0].target = req.targetIndex;
          gameData.enemies.find((enemy) => enemy.targeted) &&
            (gameData.enemies.find((enemy) => enemy.targeted).targeted = false);
          gameData.enemies[req.targetIndex].targeted = true;
          io.to(socketId).emit("update_res", gameData);
          break;
        case "enemySelect":
          let target = gameData.players[0].target;

          if (gameData.enemies.length === 1) {
            gameData.enemies[0].targeted = true;
          }
          if (req.direction === "left") {
            if (gameData.players[0].target > 0) {
              gameData.enemies[target].targeted = false;
              gameData.players[0].target--;
              gameData.enemies[target - 1].targeted = true;
            }
          } else {
            if (gameData.players[0].target < gameData.enemies.length - 1) {
              gameData.enemies[target].targeted = false;
              gameData.players[0].target++;
              gameData.enemies[target + 1].targeted = true;
            }
          }

          io.to(socketId).emit("update_res", gameData);
          break;
        case "clearMatch":
          gameData && (gameData.concluded = true);
          getGameDataHandler.removeGame(req.id);
          io.to(socketId).emit("update_res", gameData);
          break;
        case "addWord":
          gameData &&
            gameData.players[0].actionPoints >= 15 &&
            !gameData.spellInput.find((w) => w === req.word) &&
            gameData.spellInput.push(req.word);
          if (
            gameData &&
            gameData.spellInput.length === gameData.spellReq.length
          ) {
            if (gameData.spellInput.join("") === gameData.spellReq.join("")) {
              gameData.animation = "casting";
              gameData.players[0].actionPoints = 0;
              io.to(socketId).emit("update_res", gameData);
              setTimeout(() => {
                if (gameData) {
                  switch (gameData.players[0].spell) {
                    case "missle":
                      let target = gameData.enemies[gameData.players[0].target];
                      target.life -= 30;
                      if (target.life <= 0) {
                        target.spellInput = [];
                        gameData.enemies[0].targeted = true;

                        io.to(socketId).emit("update_res", gameData);
                        gameData.enemies.splice(gameData.players[0].target, 1);
                        gameData.players[0].target = 0;
                      }
                      break;
                    case "heal":
                      if (
                        gameData.players[0].life + 30 >
                        gameData.players[0].maxLife
                      ) {
                        gameData.players[0].life = gameData.players[0].maxLife;
                      } else {
                        gameData.players[0].life += 30;
                      }

                      break;
                  }

                  gameData.spellInput = [];
                  gameData.spellReq = [...gameData.spellTable]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);
                  gameData.animation = "normal";
                  gameData.players[0].action = "chanting";
                  if (
                    gameData &&
                    !gameData.enemies.find((enemy) => enemy.life > 0)
                  ) {
                    getGameDataHandler.nextRound(gameData.id) &&
                      getGameDataHandler.removeGame(gameData.id);
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
