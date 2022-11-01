import styled, { keyframes } from "styled-components";
import { uuid } from "uuidv4";
import { ActionView } from "./ActionView";
import { FailedSpell, Spell } from "./BattleView";
import { Frame } from "./CharacterView";
import { StatView } from "./StatView";
import SocketService from "../SocketService";
const collapse = keyframes`
0%{ 
    opacity:1
}
20%
{  opacity:.8
}
40%
{  opacity:.6
}
60%
{  opacity:.4
}
80%
{ opacity:.2
}
100%
{  opacity:0
}
`;
const emerge = keyframes`
0%{ 
    transform: scale(0)
}
20%
{ transform: scale(.15)
}
40%
{ transform: scale(.25)
}
60%
{ transform: scale(.45)
}
80%
{ transform: scale(.75)
}
100%
{ transform: scale(1)
}
`;
const Modifiers = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
const EnemyImage = styled(Frame)`
  margin: 0;
  padding: 0.25rem;
  position: relative;
  background: linear-gradient(to right, #868f96 0%, #596164 100%);
  display: flex;
  width: 30%;
  border: ${(props: { targeted: boolean }) =>
    props.targeted ? `2px solid white` : ``};
  @media (min-width: 48rem) {
    & p {
      font-size: 1rem;
    }
    width: 20%;
  }
`;
const DyingEnemyImage = styled(EnemyImage)`
  animation: ${collapse};
  animation-duration: 1s;
  animation-iteration-count: once;
  animation-timing-function: linear;
`;
export const EnemyView = ({ player, enemies, id }) => {
  return (
    <div
      key={uuid()}
      style={{
        display: "flex",
        gap: ".1rem",

        width: "100%",
      }}
    >
      {enemies.map((enemy, i) => {
        if (enemy.life <= 0) {
          return (
            <DyingEnemyImage key={uuid()} targeted={true}>
              <Modifiers>
                {enemy.modifiers.map((mod) => (
                  <span key={uuid()}>{mod}</span>
                ))}
              </Modifiers>
              <img
                style={{
                  objectFit: "cover",
                  position: "absolute",
                  height: "auto",
                  width: "45%",
                  left: "50%",
                  bottom: 0,
                  zIndex: 0,
                }}
                src={`${enemy.name}.png`}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: "2",
                  display: "flex",
                  gap: ".1rem",
                  minHeight: "5rem",
                  flexDirection: "column",
                }}
              >
                <StatView enemy={enemy} />
                <ActionView enemy={enemy} />
                <div
                  style={{
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    fontSize: ".5rem",
                    maxWidth: "100%",
                    gap: ".25rem",
                    lineHeight: ".5rem",
                  }}
                >
                  {enemy.spellInput.map((s) => {
                    switch (enemy.action) {
                      case "casting":
                        return (
                          <Spell key={uuid()} style={{ margin: 0 }}>
                            {s.word}
                          </Spell>
                        );
                      case "failed":
                        return (
                          <FailedSpell key={uuid()} style={{ margin: 0 }}>
                            {s.word}
                          </FailedSpell>
                        );
                      case "chanting":
                        return (
                          <div key={uuid()}>
                            {(s.isFlagged && (
                              <p
                                key={uuid()}
                                style={{ margin: 0, color: "yellow" }}
                              >
                                {s.word}
                              </p>
                            )) || (
                              <p key={uuid()} style={{ margin: 0 }}>
                                {s.word}
                              </p>
                            )}
                          </div>
                        );
                    }
                  })}
                </div>
              </div>
            </DyingEnemyImage>
          );
        }
        if (
          (player &&
            player.target === i &&
            (player.spell.name === "missle" ||
              player.spell.name === "silence" ||
              player.spell.name === "curse")) ||
          player.spell.name === "blast"
        ) {
          return (
            <EnemyImage key={uuid()} targeted={true}>
              <Modifiers>
                {enemy.modifiers.map((mod) => (
                  <span key={uuid()}>{mod}</span>
                ))}
              </Modifiers>
              <img
                style={{
                  objectFit: "cover",
                  position: "absolute",
                  height: "auto",
                  width: "45%",
                  left: "50%",
                  bottom: 0,
                  zIndex: 0,
                }}
                src={`${enemy.name}.png`}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: "2",
                  display: "flex",
                  gap: ".1rem",
                  minHeight: "5rem",
                  flexDirection: "column",
                }}
              >
                <StatView enemy={enemy} />
                <ActionView enemy={enemy} />
                <div
                  style={{
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    fontSize: ".5rem",
                    maxWidth: "100%",
                    gap: ".25rem",
                    lineHeight: ".5rem",
                  }}
                >
                  {enemy.spellInput.map((s) => {
                    switch (enemy.action) {
                      case "casting":
                        return (
                          <Spell key={uuid()} style={{ margin: 0 }}>
                            {s.word}
                          </Spell>
                        );
                      case "failed":
                        return (
                          <FailedSpell key={uuid()} style={{ margin: 0 }}>
                            {s.word}
                          </FailedSpell>
                        );
                      case "chanting":
                        return (
                          <div key={uuid()}>
                            {(s.isFlagged && (
                              <p
                                key={uuid()}
                                style={{ margin: 0, color: "yellow" }}
                              >
                                {s.word}
                              </p>
                            )) || (
                              <p key={uuid()} style={{ margin: 0 }}>
                                {s.word}
                              </p>
                            )}
                          </div>
                        );
                    }
                  })}
                </div>
              </div>
            </EnemyImage>
          );
        } else {
          return (
            <EnemyImage
              key={uuid()}
              onClick={() => {
                SocketService.update({
                  type: "enemyClicked",
                  targetIndex: i,
                  id: id,
                });
              }}
              targeted={false}
            >
              <Modifiers>
                {enemy.modifiers.map((mod) => (
                  <span key={uuid()}>{mod}</span>
                ))}
              </Modifiers>
              <img
                style={{
                  objectFit: "cover",
                  position: "absolute",
                  height: "auto",
                  width: "45%",
                  left: "50%",
                  bottom: 0,
                  zIndex: 0,
                }}
                src={`${enemy.name}.png`}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: "2",
                  display: "flex",
                  gap: ".1rem",
                  minHeight: "5rem",
                  flexDirection: "column",
                }}
              >
                <StatView enemy={enemy} />
                <ActionView enemy={enemy} />
                <div
                  style={{
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    fontSize: ".5rem",
                    maxWidth: "100%",
                    gap: ".25rem",
                    lineHeight: ".5rem",
                  }}
                >
                  {enemy.spellInput.map((s) => {
                    switch (enemy.action) {
                      case "casting":
                        return (
                          <Spell key={uuid()} style={{ margin: 0 }}>
                            {s.word}
                          </Spell>
                        );
                      case "failed":
                        return (
                          <FailedSpell key={uuid()} style={{ margin: 0 }}>
                            {s.word}
                          </FailedSpell>
                        );
                      case "chanting":
                        return (
                          <>
                            {(s.isFlagged && (
                              <p
                                key={uuid()}
                                style={{ margin: 0, color: "yellow" }}
                              >
                                {s.word}
                              </p>
                            )) || (
                              <p key={uuid()} style={{ margin: 0 }}>
                                {s.word}
                              </p>
                            )}
                          </>
                        );
                    }
                  })}
                </div>
              </div>
            </EnemyImage>
          );
        }
      })}
    </div>
  );
};
