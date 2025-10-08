import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";

export const useUserNavigationHook = (featurePath: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(listener);
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    await presenterRef.current!.navigateToUser(event, authToken!, displayedUser!, featurePath);
  };

  return { navigateToUser };
};