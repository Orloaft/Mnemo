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
          onChange={(e) => {
            props.onChange(e, "name");
          }}
        ></input>
        {props.message}
      </Frame>
      <Button type="submit">Sign in</Button>
      <Button onClick={() => props.setStatus("default")}>back</Button>
    </Form>
  );
};
