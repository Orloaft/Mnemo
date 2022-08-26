import styled from "styled-components";

const HpBar = styled.div`
  background-color: aliceblue;
  padding: 0.25rem;
  height: 3rem;
  width: 10rem;
`;
const Hp = styled.div`
  background-color: red;
  height: 100%;
`;
export const EnemyStats = ({ enemy }: any) => {
  const { life, maxLife, name } = enemy;
  return (
    <>
      {name}
      <div>
        {life}
        <HpBar>
          <Hp style={{ width: `${(life / maxLife) * 100}%` }} />
        </HpBar>
      </div>
    </>
  );
};
