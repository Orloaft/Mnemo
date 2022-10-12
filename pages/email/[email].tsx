import { useRouter } from "next/router";

import { SignUpMessageSent } from "../../components/email/SignUpMessageSent";

export default function EmailSentPage(props) {
  let router = useRouter();

  return <SignUpMessageSent email={router.query.email} />;
}
