import { Frame } from "./CharacterView";
import { Button, Form } from "./SignUpPageView";

export const GuestView = (props) => {
  return (
    <Form
      style={{ alignItems: "center" }}
      onSubmit={(e) => {
        props.submit(e);
      }}
    >
      <Frame style={{ flexDirection: "column" }}>
        Screen name
        <input
          value={props.form.email}
          onChange={(e) => {
            props.onChange(e, "email");
          }}
        ></input>
        {props.message}
      </Frame>
      <Button type="submit">Sign in</Button>
      <Button onClick={() => props.setStatus("default")}>back</Button>
    </Form>
  );
};
