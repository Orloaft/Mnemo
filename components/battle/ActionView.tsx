import styled from "styled-components";
import { PlayerView } from "./PlayerView";

const MpBar = styled.div`
  display: flex;
  gap: 0.25rem;
  background: transparent;
  padding: 0.15rem;
  height: 0.5rem;
  width: 5rem;
  & :nth-child(1) {
    background-color: ${(props: { ap: number, overcharge: number }) =>
      props.ap >= 3 ? `#71fef0` : `black`};
  }
  & :nth-child(2) {
    background-color: ${(props: { ap: number, overcharge: number }) =>
      props.ap >= 6 ? `#71fef0` : `black`};
  }
  & :nth-child(3) {
    background-color: ${(props: { ap: number, overcharge: number }) =>
      props.ap >= 9 ? `#71fef0` : `black`};
  }
  & :nth-child(4) {
    background-color: ${(props: { ap: number, overcharge: number }) =>
      props.ap >= 12 ? `#71fef0` : `black`};
  }
  & :nth-child(5) {
    background-color: ${(props: { ap: number, overcharge: number }) =>
      props.ap >= 15 ? `#71fef0` : `black`};
  }
  & :nth-child(6) {
    background-color: ${(props: {ap: number, overcharge: number }) =>
      props.overcharge >= 1 ? `orange` : `black`};
  }
  & :nth-child(7) {
    background-color: ${(props: { ap: number,overcharge: number }) =>
      props.overcharge >= 2 ? `orange` : `black`};
  }
`;
const Mp = styled.div`
  width: 18%;
  background-color: blue;
  height: 100%;
  // -webkit-transition: width 1.25s linear;
  // -o-transition: width 1.25s linear;
  // transition: width 1.25s linear;
`;

export const ActionView = ({ enemy }: any) => {
  const { action, actionPoints, speed } = enemy;
  if(enemy.id){ // quick hack for rendering alternate view for player since only players have ids at this time
    return (
      <>
        <MpBar ap={actionPoints} overcharge={enemy.overcharge}>
          <Mp /> <Mp /> <Mp /> <Mp /> <Mp /><Mp /> <Mp />
        </MpBar>
      </>
    );
  } else {

 
  return (
    <>
      <MpBar ap={actionPoints} overcharge={0}>
        <Mp /> <Mp /> <Mp /> <Mp /> <Mp />
      </MpBar>
    </>
  );
}
};
