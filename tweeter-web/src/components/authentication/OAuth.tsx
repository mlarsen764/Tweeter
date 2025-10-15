import { useMessageActions } from "../toaster/MessageHooks";
import OAuthButton from "./OAuthButton";

const OAuth = ({ oAuthHeading }: { oAuthHeading: string }) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(
      message,
      3000,
      "text-white bg-primary",
    );
  };

  return (
    <>
      <h1 className="h4 mb-3 fw-normal">Or</h1>
      <h1 className="h5 mb-3 fw-normal">{oAuthHeading}</h1>

      <div className="text-center mb-3">
        <OAuthButton provider="Google" icon="google" onNotImplemented={displayInfoMessageWithDarkBackground} />
        <OAuthButton provider="Facebook" icon="facebook" onNotImplemented={displayInfoMessageWithDarkBackground} />
        <OAuthButton provider="Twitter" icon="twitter" onNotImplemented={displayInfoMessageWithDarkBackground} />
        <OAuthButton provider="LinkedIn" icon="linkedin" onNotImplemented={displayInfoMessageWithDarkBackground} />
        <OAuthButton provider="GitHub" icon="github" onNotImplemented={displayInfoMessageWithDarkBackground} />
      </div>
    </>
  );
};

export default OAuth;
