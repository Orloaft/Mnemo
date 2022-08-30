import styled, { keyframes } from "styled-components";
import { uuid } from "uuidv4";
import { ActionView } from "./ActionView";
import { FailedSpell, Spell } from "./BattleView";
import { Frame } from "./CharacterView";
import { StatView } from "./StatView";
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
const EnemyImage = styled(Frame)`
  animation: ${emerge};
  animationduration: 2s;
  animationiterationcount: once;
  background: linear-gradient(to right, #868f96 0%, #596164 100%);
  display: flex;
  flex-direction: column;
  border-color: ${(props: { targeted: boolean }) =>
    props.targeted ? `white` : `black`};
`;
export const EnemyView = ({ enemies }) => {
  return (
    <Frame
      style={{
        display: "flex",
        gap: "1rem",
        minHeight: "5rem",
      }}
    >
      {enemies.map((enemy) => {
        if (enemy.targeted) {
          return (
            <EnemyImage key={uuid()} targeted={true}>
              <img
                style={{
                  objectFit: "cover",
                  width: "6rem",
                }}
                src={`${enemy.name}.png`}
              />
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  minHeight: "5rem",
                  flexDirection: "column",
                }}
              >
                <StatView enemy={enemy} />
                <ActionView enemy={enemy} />
              </div>{" "}
              <div
                style={{ position: "absolute", transform: "translate(10rem)" }}
              >
                {enemy.spellInput.map((s) => {
                  switch (enemy.action) {
                    case "casting":
                      return <Spell key={uuid()}>{s}</Spell>;
                    case "failed":
                      return <FailedSpell key={uuid()}>{s}</FailedSpell>;
                    case "chanting":
                      return <p key={uuid()}>{s}</p>;
                  }
                })}
              </div>
            </EnemyImage>
          );
        }
        return (
          <EnemyImage key={uuid()} targeted={false}>
            <img
              style={{
                objectFit: "cover",
                width: "6rem",
              }}
              src={`${enemy.name}.png`}
            />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                minHeight: "5rem",
                flexDirection: "column",
              }}
            >
              <StatView enemy={enemy} />
              <ActionView enemy={enemy} />
            </div>{" "}
            <div
              style={{ position: "absolute", transform: "translate(10rem)" }}
            >
              {enemy.spellInput.map((s) => {
                switch (enemy.action) {
                  case "casting":
                    return <Spell key={uuid()}>{s}</Spell>;
                  case "failed":
                    return <FailedSpell key={uuid()}>{s}</FailedSpell>;
                  case "chanting":
                    return <p key={uuid()}>{s}</p>;
                }
              })}
            </div>
          </EnemyImage>
        );
      })}
    </Frame>
  );
};
