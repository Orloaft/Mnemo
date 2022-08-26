import styled from "styled-components";

const HpBar = styled.div`
  background-color: aliceblue;
  padding: 0.25rem;
  height: 3rem;
  width: 10rem;
`;
const Hp = styled.div`
  background-color: yellow;
  height: 100%;
`;

export const EnemyAction = ({ enemy }: any) => {
  const { action, actionPoints, speed } = enemy;
  return (
    <>
      <p>{action}</p>
      <p>{actionPoints}</p>
      <HpBar>
        <Hp style={{ width: `${(actionPoints / (15 - speed)) * 100}%` }} />
      </HpBar>
    </>
  );
};
