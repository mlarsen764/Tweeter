import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito"
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  })
  it("enables the sign in button if both alias and password fields have text", async () => {
    const { signInButton } = await fillLoginFields();
    expect(signInButton).toBeEnabled();
  })
  it("disables sign in button if either the alias or the password field is cleared", async () => {
    const { signInButton, aliasField, passwordField } = await fillLoginFields();
    expect(signInButton).toBeEnabled();

    await userEvent.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await userEvent.type(aliasField, "a");
    expect(signInButton).toBeEnabled();

    await userEvent.clear(passwordField);
    expect(signInButton).toBeDisabled();
  })
    it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
      const mockPresenter = mock<LoginPresenter>();
      const mockPresenterInstance = instance(mockPresenter);

      const originalUrl = "http://somewhere.com";
      const alias = "@alias"
      const password = "myPassword"
      const { signInButton, aliasField, passwordField } = renderLoginAndGetElement(originalUrl, mockPresenterInstance);

      await userEvent.type(aliasField, alias);
      await userEvent.type(passwordField, password);
      await userEvent.click(signInButton);

      verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();

  })
})

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!! presenter ? <Login originalUrl={originalUrl} presenter={presenter} /> : (<Login originalUrl={originalUrl} />)}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(originalUrl: string, presenter?: LoginPresenter) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign In/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}

async function fillLoginFields() {
  const { signInButton, aliasField, passwordField } = renderLoginAndGetElement("/");
  await userEvent.type(aliasField, "a");
  await userEvent.type(passwordField, "b");
  return { signInButton, aliasField, passwordField };
}