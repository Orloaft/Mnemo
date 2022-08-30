import styled from "styled-components";

const HpBar = styled.div`
  background-color: aliceblue;
  padding: 0.15rem;
  height: 0.5rem;
  width: 5rem;
`;
const Hp = styled.div`
  -webkit-transition: width 0.3s ease;
  -o-transition: width 0.3 ease;
  transition: width 0.3 ease;
  background-color: red;
  height: 100%;
`;
export const StatView = ({ enemy }: any) => {
  const { life, maxLife, name } = enemy;

  return (
    <>
      <span style={{ fontSize: "1rem" }}>{name}</span>
      <div>
        <HpBar>
          <Hp
            style={{ width: `${(life > 0 && (life / maxLife) * 100) || 0}%` }}
          />
        </HpBar>
      </div>
    </>
  );
};
