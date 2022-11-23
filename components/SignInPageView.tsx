import { Frame } from "./CharacterView";
import { Button, Form } from "./SignUpPageView";

export const SignInPageView = (props) => {
  return (
    <Form
      style={{ alignItems: "center" }}
      onSubmit={(e) => {
        props.submit(e);
      }}
    >
      <Frame style={{ flexDirection: "column" }}>
        EMAIL
        <input
          value={props.form.email}
          onChange={(e) => {
            props.onChange(e, "email");
          }}
        ></input>
        PASSWORD
        <input
          value={props.form.password}
          onChange={(e) => {
            props.onChange(e, "password");
          }}
          type="password"
        ></input>
        {props.message}
      </Frame>
      <Button type="submit">Sign in</Button>
      <Button onClick={() => props.setStatus("default")}>back</Button>
    </Form>
  );
};
