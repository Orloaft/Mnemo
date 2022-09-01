import styled from "styled-components";

const MpBar = styled.div`
  display: flex;
  gap: 0.25rem;
  background-color: aliceblue;
  padding: 0.15rem;
  height: 0.5rem;
  width: 5rem;
  & :nth-child(1) {
    background-color: ${(props: { ap: number }) =>
      props.ap >= 3 ? `teal` : `black`};
  }
  & :nth-child(2) {
    background-color: ${(props: { ap: number }) =>
      props.ap >= 6 ? `teal` : `black`};
  }
  & :nth-child(3) {
    background-color: ${(props: { ap: number }) =>
      props.ap >= 9 ? `teal` : `black`};
  }
  & :nth-child(4) {
    background-color: ${(props: { ap: number }) =>
      props.ap >= 12 ? `teal` : `black`};
  }
  & :nth-child(5) {
    background-color: ${(props: { ap: number }) =>
      props.ap >= 15 ? `teal` : `black`};
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
  return (
    <>
      <MpBar ap={actionPoints}>
        <Mp /> <Mp /> <Mp /> <Mp /> <Mp />
      </MpBar>
    </>
  );
};
