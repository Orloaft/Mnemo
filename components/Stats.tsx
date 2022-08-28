import styled from "styled-components";
import { ActionView } from "./ActionView";
import { StatView } from "./StatView";

interface StatProps {
  character: any;
}
export const Stats: React.FC<StatProps> = ({ character }) => {
  const StatWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  `;
  return (
    <StatWrap>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <StatView enemy={character} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <ActionView enemy={character} />
      </div>
    </StatWrap>
  );
};
