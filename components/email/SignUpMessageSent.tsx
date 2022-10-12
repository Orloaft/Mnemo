import Link from "next/link";

export const SignUpMessageSent = (props) => {
  return (
    <>
      <p>An email has been sent to {props.email} .</p>
      <p>Follow the instructions in the email to activate your new account.</p>
      <Link href="/">back</Link>
    </>
  );
};
