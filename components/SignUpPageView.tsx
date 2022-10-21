import styled from "styled-components";
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const SignUpPageView = (props) => {
  return (
    <div>
      <Form onSubmit={props.submit}>
        EMAIL
        <input
          onChange={(e) => props.onChange(e, "email")}
          value={props.form.email}
          name="email"
        ></input>
        USERNAME
        <input
          onChange={(e) => props.onChange(e, "name")}
          value={props.form.name}
          name="name"
        ></input>
        PASSWORD
        <input
          onChange={(e) => props.onChange(e, "password")}
          value={props.form.password}
          type="password"
          name="password"
        ></input>
        <button type="submit">Sign Up</button>
        <button onClick={() => props.setStatus("sign in")}>back</button>
      </Form>
      {props.message}
    </div>
  );
};
