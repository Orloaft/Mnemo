import styled, { keyframes } from "styled-components";
import { setOnKeyDown, useMountEffect } from "../utils/jsUtils";
import { otherGradient, backgroundGradient } from "../utils/styleUtils";
import { Frame } from "./CharacterView";
import SocketService from "../SocketService";

const wiggle = keyframes`
0% { transform: rotate(0deg); }
25% { transform: rotate(-5deg); }
50% { transform: rotate(0deg); }
75% { transform: rotate(5deg); }
100% { transform: rotate(0deg); }
`;
const Table = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  position: relative;
  & :nth-child(even) {
    animation-delay: 1.5s;
  }
`;
const WordBox = styled(Frame)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  min-width: 20%;
  //   animation: ${wiggle};
  //   animation-duration: 4s;
  //   animation-iteration-count: infinite;
  //   animation-timing-function: ease-in-out;
  background: ${(props: clickProps) =>
    props.clicked ? otherGradient : backgroundGradient};
`;
interface clickProps {
  clicked?: boolean;
  onClick?: () => void;
}
export const SpellTable = ({ id, spells, spellInput, clickHandler }) => {
  function installUndoHandler() {
    setOnKeyDown(async (e) => {
      if (e.key === "q") {
        console.log({ es: e });
        clickHandler("lorem");
      }
      if (e.key === "w") {
        console.log({ es: e });
        clickHandler("ipsum");
      }
      if (e.key === "e") {
        console.log({ es: e });
        clickHandler("dolor");
      }
      if (e.key === "r") {
        clickHandler("sit");
      }
      if (e.key === "a") {
        clickHandler("amet");
      }
      if (e.key === "s") {
        clickHandler("adipisicing");
      }
      if (e.key === "d") {
        clickHandler("elit");
      }
      if (e.key === "f") {
        clickHandler("aut");
      }
      if (e.keyCode === 38) {
        console.log({ es: e });
        SocketService.update({
          type: "spellSelect",
          spell: "missle",
          id: id,
        });
      }
      if (e.keyCode === 40) {
        console.log({ es: e });
        SocketService.update({
          type: "spellSelect",
          spell: "heal",
          id: id,
        });
      }
      if (e.keyCode === 37) {
        console.log({ es: e });
        SocketService.update({
          type: "enemySelect",
          direction: "left",
          id: id,
        });
      }
      if (e.keyCode === 39) {
        console.log({ es: e });
        SocketService.update({
          type: "enemySelect",
          direction: "right",
          id: id,
        });
      }
    });
  }
  useMountEffect(() => {
    installUndoHandler();
  });
  return (
    <Table>
      {spells.map((w: string) => {
        if (spellInput.find((e: string) => e === w)) {
          return (
            <WordBox key={w} style={{ color: "black" }} clicked>
              {w}
            </WordBox>
          );
        } else {
          return (
            <WordBox
              key={w}
              onClick={() => {
                clickHandler(w);
              }}
            >
              {w}
            </WordBox>
          );
        }
      })}
    </Table>
  );
};
