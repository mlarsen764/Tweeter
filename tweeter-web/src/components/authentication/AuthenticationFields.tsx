interface Props {
  alias: string;
  password: string;
  onAliasChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

const AuthenticationFields = ({
  alias,
  password,
  onAliasChange,
  onPasswordChange,
  onKeyDown,
}: Props) => {
  const handleAliasChange = (value: string) => {
    if (value && !value.startsWith('@')) {
      onAliasChange('@' + value);
    } else {
      onAliasChange(value);
    }
  };

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
          placeholder="@username"
          value={alias}
          onKeyDown={onKeyDown}
          onChange={(event) => handleAliasChange(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          value={password}
          onKeyDown={onKeyDown}
          onChange={(event) => onPasswordChange(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
