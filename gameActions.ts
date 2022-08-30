import getGameDataHandler from "./gameData";

export function getGameActionHandler() {
  return {
    gameTimer: function (roomId: string, socket: any, io: any) {
      let gameData = getGameDataHandler.getGame(roomId);
      gameData.enemies[0].targeted = true;
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
            gameData && (gameData.player.actionPoints += 3);
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

                io.to(socket).emit("update_res", gameData);
              }
            }
            if (enemy.actionPoints >= 15) {
              enemy.action = "casting";

              io.to(socket).emit("update_res", gameData);
              setTimeout(() => {
                switch (enemy.spell) {
                  case "missle":
                    gameData.player.life -= enemy.dmg;
                }
                enemy.spellInput = [];
                enemy.actionPoints = 0;

                enemy.action = "chanting";
                io.to(socket).emit("update_res", gameData);
              }, 1000);
            }
          });

          if (gameData && gameData.player.actionPoints >= 15) {
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
        case "enemySelect":
          let target = gameData.player.target;

          if (gameData.enemies.length === 1) {
            gameData.enemies[0].targeted = true;
          }
          if (req.direction === "left") {
            if (gameData.player.target > 0) {
              gameData.enemies[target].targeted = false;
              gameData.player.target--;
              gameData.enemies[target - 1].targeted = true;
            }
          } else {
            if (gameData.player.target < gameData.enemies.length - 1) {
              gameData.enemies[target].targeted = false;
              gameData.player.target++;
              gameData.enemies[target + 1].targeted = true;
            }
          }
          console.log(target);
          io.to(socketId).emit("update_res", gameData);
          break;
        case "clearMatch":
          gameData && (gameData.concluded = true);
          io.to(socketId).emit("update_res", gameData);
          break;
        case "addWord":
          gameData.player.actionPoints >= 15 &&
            !gameData.spellInput.find((w) => w === req.word) &&
            gameData.spellInput.push(req.word);
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
                      let target = gameData.enemies[gameData.player.target];
                      target.life -= 30;
                      if (target.life <= 0) {
                        target.spellInput = [];
                        gameData.enemies[0].targeted = true;

                        io.to(socketId).emit("update_res", gameData);
                        gameData.enemies.splice(gameData.player.target, 1);
                        gameData.player.target = 0;
                      }
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
                  if (
                    gameData &&
                    !gameData.enemies.find((enemy) => enemy.life > 0)
                  ) {
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
