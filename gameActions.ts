import getGameDataHandler from "./gameData";

export function getGameActionHandler() {
  return {
    gameTimer: function (roomId: string, io: any) {
      let gameData = getGameDataHandler.getGame(roomId);
      gameData.enemies.forEach((e) => {
        e.target = 0;
      });
      gameData.enemies[0].targeted = true;
      // Update the count down every 1 second
      const x = setInterval(() => {
        if (!gameData.paused) {
          if (gameData.players && !gameData.players.find((p) => p.life > 0)) {
            gameData.enemies.forEach((enemy) => (enemy.spellInput = []));
            gameData.concluded = true;
            gameData.score = "player defeated";
            getGameDataHandler.removeGame(gameData.id);
          }
          if (gameData && gameData.concluded) {
            io.to(roomId).emit("update_res", gameData);

            getGameDataHandler.removeGame(roomId);
            clearInterval(x);
          } else {
            gameData && (gameData.time += 1);
            gameData &&
              gameData.players.forEach((p) => {
                if (p.life > 0) {
                  if (gameData && p.action === "chanting") {
                    gameData && (p.actionPoints += 2.5);
                  }
                  if (gameData && p.actionPoints >= 15) {
                    setTimeout(() => {
                      p.action = "casting";
                    }, 1000);
                  }
                }
              });

            gameData.enemies.forEach((enemy) => {
              if (enemy.action === "chanting" && enemy.life > 0) {
                enemy.actionPoints += 1;
                if (enemy.actionPoints % 4 === 0) {
                  enemy.spellInput.push({
                    word: [...gameData.spellTable]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 1)[0],
                    isFlagged: !Math.floor(Math.random() * 4),
                  });

                  io.to(roomId).emit("update_res", gameData);
                }
              }
              if (enemy.actionPoints >= 15) {
                enemy.action = "casting";

                io.to(roomId).emit("update_res", gameData);

                setTimeout(() => {
                  switch (enemy.spell) {
                    case "missle":
                      gameData.players[enemy.target].life -= enemy.dmg;
                  }
                  enemy.spellInput = [];
                  enemy.actionPoints = 0;

                  enemy.action = "chanting";
                  enemy.target = Math.floor(
                    Math.random() * gameData.players.length
                  );
                  gameData.players[enemy.target].life <= 0 && enemy.target++;
                  io.to(roomId).emit("update_res", gameData);
                }, 1000);
              }
            });

            io.to(roomId).emit("update_res", gameData);
          }
        }
      }, 1000);
    },
    handleAction: function (req, io, playerId) {
      let gameData = getGameDataHandler.getGame(req.id);
      let player = gameData && gameData.players.find((p) => p.id === playerId);
      if (player && player.life > 0) {
        switch (req.type) {
          case "pause":
            gameData.paused = !gameData.paused;
            io.to(gameData.id).emit("update_res", gameData);
            break;
          case "spellSelect":
            console.log(req.spell);
            player.spell = req.spell;
            player.spellReq = [...gameData.spellTable]
              .sort(() => 0.5 - Math.random())
              .slice(0, 3);
            io.to(req.id).emit("update_res", gameData);
            break;
          case "animate":
            gameData && (gameData.animation = req.animation);
            io.to(req.id).emit("update_res", gameData);
            setTimeout(() => {
              gameData && (gameData.animation = "normal");
              io.to(req.id).emit("update_res", gameData);
            }, req.duration);

            break;
          case "enemyClicked":
            player.target = req.targetIndex;

            io.to(req.id).emit("update_res", gameData);
            break;
          case "enemySelect":
            if (
              player.spell.name === "missle" ||
              player.spell.name === "silence"
            ) {
              if (!gameData.enemies[player.target]) {
                player.target = 0;
              }
              if (req.direction === "left") {
                if (player.target > 0) {
                  player.target--;
                }
              } else {
                if (player.target < gameData.enemies.length - 1) {
                  player.target++;
                }
              }
            } else {
              if (req.direction === "left") {
                if (player.target > 0) {
                  player.target--;
                }
              } else {
                if (player.target < gameData.players.length - 1) {
                  player.target++;
                }
              }
            }

            io.to(req.id).emit("update_res", gameData);
            break;
          case "clearMatch":
            gameData && (gameData.concluded = true);
            getGameDataHandler.removeGame(req.id);
            io.to(req.id).emit("update_res", gameData);
            break;
          case "addWord":
            if (player.actionPoints < 15) {
              gameData.enemies.forEach((e) => {
                let match = e.spellInput[e.spellInput.length - 1];

                if (match && match.isFlagged && match.word === req.word) {
                  player.actionPoints += 5;
                  match.isFlagged = false;
                  e.spellInput.pop();
                  e.actionPoints -= 5;
                }
              });
              io.to(req.id).emit("update_res", gameData);
            } else {
              gameData &&
                player.actionPoints >= 15 &&
                !player.spellInput.find((w) => w === req.word) &&
                player.spellInput.push(req.word);
            }
            if (player && player.spellInput.length === player.spellReq.length) {
              if (player.spellInput.join("") === player.spellReq.join("")) {
                gameData.animation = "casting";
                player.actionPoints = 0;
                io.to(req.id).emit("update_res", gameData);
                setTimeout(() => {
                  if (gameData) {
                    switch (player.spell.name) {
                      case "missle":
                        let target = gameData.enemies[player.target];
                        if (!target) {
                          player.target = 0;
                          target = gameData.enemies[player.target];
                        }

                        target.life -= 10 * player.spell.lvl;
                        if (target.life <= 0) {
                          target.spellInput = [];
                          gameData.enemies[0].targeted = true;

                          io.to(req.id).emit("update_res", gameData);
                          gameData.enemies.splice(player.target, 1);
                          player.target = 0;
                        }
                        break;
                      case "heal":
                        let playerTarget = gameData.players[player.target];
                        if (playerTarget.life > 0) {
                          if (
                            playerTarget.life + 10 * player.spell.lvl >
                            playerTarget.maxLife
                          ) {
                            playerTarget.life = playerTarget.maxLife;
                          } else {
                            playerTarget.life += 10 * player.spell.lvl;
                          }
                        }
                        break;
                      case "silence":
                        let silenceTarget = gameData.enemies[player.target];
                        silenceTarget.actionPoints = 0;
                        silenceTarget.spellInput = [];
                        io.to(req.id).emit("update_res", gameData);
                        break;
                      case "blast":
                        gameData.enemies.forEach((enemy) => {
                          enemy.life -= 5 * player.spell.lvl;
                          if (enemy.life <= 0) {
                            enemy.spellInput = [];

                            io.to(req.id).emit("update_res", gameData);
                            gameData.enemies.filter((e) => e !== enemy);
                          }
                        });

                        break;
                    }

                    player.spellInput = [];
                    player.spellReq = [...gameData.spellTable]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 3);
                    gameData.animation = "normal";
                    player.action = "chanting";
                    if (
                      gameData &&
                      !gameData.enemies.find((enemy) => enemy.life > 0)
                    ) {
                      getGameDataHandler.nextRound(gameData.id) &&
                        getGameDataHandler.removeGame(gameData.id);
                    }
                    io.to(req.id).emit("update_res", gameData);
                  }
                }, 1000);
              } else {
                gameData.animation = "failed";
                io.to(req.id).emit("update_res", gameData);
                setTimeout(() => {
                  if (gameData) {
                    player.spellInput = [];
                    gameData.animation = "normal";
                    io.to(req.id).emit("update_res", gameData);
                  }
                }, 1000);
              }
            } else {
              io.to(req.id).emit("update_res", gameData);
            }
        }
      }
    },
  };
}
export default getGameActionHandler();
