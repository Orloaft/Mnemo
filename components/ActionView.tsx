import styled from "styled-components";

const MpBar = styled.div`
  background-color: aliceblue;
  padding: 0.15rem;
  height: 0.75rem;
  width: 10rem;
`;
const Mp = styled.div`
  background-color: yellow;
  height: 100%;
  -webkit-transition: width 1s ease;
  -o-transition: width 1s ease;
  transition: width 1s ease;
`;

export const ActionView = ({ enemy }: any) => {
  const { action, actionPoints, speed } = enemy;
  return (
    <>
      <MpBar>
        <Mp style={{ width: `${(actionPoints / (15 - speed)) * 101}%` }} />
      </MpBar>
    </>
  );
};