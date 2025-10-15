import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";

interface OAuthButtonProps {
  provider: string;
  icon: IconName;
  onNotImplemented: (message: string) => void;
}

const OAuthButton = ({ provider, icon, onNotImplemented }: OAuthButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() =>
        onNotImplemented(`${provider} registration is not implemented.`)
      }
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`${provider.toLowerCase()}Tooltip`}>{provider}</Tooltip>}
      >
        <FontAwesomeIcon icon={["fab" as IconPrefix, icon]} />
      </OverlayTrigger>
    </button>
  );
};

export default OAuthButton;