import styled from "styled-components";

const HpBar = styled.div`
  background-color: aliceblue;
  padding: 0.15rem;
  height: 0.75rem;
  width: 10rem;
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
      {name}
      <div>
        <HpBar>
          <Hp style={{ width: `${(life / maxLife) * 100}%` }} />
        </HpBar>
      </div>
    </>
  );
};
