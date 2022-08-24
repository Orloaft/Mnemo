import styled from "styled-components";

const Hp = styled.div`
  height: 1rem;
  width: 10rem;
  background-color: red;
  border: 2px solid #ffebcd;
  border-radius: 0.25rem;
`;
const Mp = styled.div`
  height: 1rem;
  width: 10rem;
  background-color: blue;
  border: 2px solid #ffebcd;
  border-radius: 0.25rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #ffebcd;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
`;
const Class = styled.span`
  margin-top: 5%;
`;
export const Stats: React.FC = () => {
  const StatWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  `;
  return (
    <StatWrap>
      <Label>
        Hp
        <Hp></Hp>
      </Label>
      <Label>
        Mp <Mp></Mp>
      </Label>
      <Class>lvl 20 Black Mage</Class>
    </StatWrap>
  );
};
