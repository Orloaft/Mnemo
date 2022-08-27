import styled from "styled-components";

const HpBar = styled.div`
  background-color: aliceblue;
  padding: 0.25rem;
  height: 1.5rem;
  width: 10rem;
`;
const Hp = styled.div`
  background-color: yellow;
  height: 100%;
  -webkit-transition: width 1.5s linear;
  -o-transition: width 1.5s linear;
  transition: width 1.5s linear;
`;

export const EnemyAction = ({ enemy }: any) => {
  const { action, actionPoints, speed } = enemy;
  return (
    <>
      <HpBar>
        <Hp style={{ width: `${(actionPoints / (15 - speed)) * 100}%` }} />
      </HpBar>
    </>
  );
};
