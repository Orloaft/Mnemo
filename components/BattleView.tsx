import { useEffect, useState } from "react";
import styled from "styled-components";
import { backgroundGradient, otherGradient } from "../utils/styleUtils";
import { Frame } from "./CharacterView";
import SocketService from "../SocketService";

interface clickProps {
  clicked?: boolean;
  onClick?: () => void;
}
export const BattleView = () => {
  const WordBox = styled(Frame)`
    background: ${(props: clickProps) =>
      props.clicked ? otherGradient : backgroundGradient};
  `;
  const wordArr =
    `Lorem ipsum dolor sit amet adipisicing elit. Aut blanditiis sunt quisquam molestiae magnam`.split(
      " "
    );
  const [wordPool, setWordPool] = useState<string[]>([]);
  const [gameState, setGameState] = useState<any>(null);
  const { socket, updateData } = SocketService as any;
  useEffect(() => {
    socket &&
      socket.on("update_res", (obj: object) => {
        setGameState(obj);
        socket.gameData = obj;
        console.log(obj);
      });
  }, []);
  return (
    <Frame>
      {gameState && gameState.spellInput.map((el: string) => <p>{el}</p>)}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: ".5rem",
        }}
      >
        {wordArr.map((w) => {
          if (wordPool.find((e) => e === w)) {
            return (
              <WordBox
                style={{ cursor: "default", color: "black" }}
                key={w}
                clicked
              >
                {w}
              </WordBox>
            );
          } else {
            return (
              <WordBox
                style={{ cursor: "grab" }}
                onClick={() =>
                  updateData({ type: "addWord", word: w, id: gameState.id })
                }
                key={w}
              >
                {w}
              </WordBox>
            );
          }
        })}
      </div>
    </Frame>
  );
};
