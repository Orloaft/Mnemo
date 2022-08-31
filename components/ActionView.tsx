import styled from "styled-components";

const MpBar = styled.div`
  background-color: aliceblue;
  padding: 0.15rem;
  height: 0.5rem;
  width: 5rem;
`;
const Mp = styled.div`
  background-color: blue;
  height: 100%;
  -webkit-transition: width 1.25s linear;
  -o-transition: width 1.25s linear;
  transition: width 1.25s linear;
`;

export const ActionView = ({ enemy }: any) => {
  const { action, actionPoints, speed } = enemy;
  return (
    <>
      <MpBar>
        <Mp style={{ width: `${(actionPoints / 15) * 100}%` }} />
      </MpBar>
    </>
  );
};
