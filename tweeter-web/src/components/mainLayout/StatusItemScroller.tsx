import { Status } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import StatusItem from "../statusItem/StatusItem";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useUserNavigationHook } from "../userItem/UserNavigationHook";
import { StatusItemPresenter, StatusItemView } from "../../presenter/StatusItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
  featureUrl: string;
  presenterFactory: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<Status[]>([]);
  const { navigateToUser } = useUserNavigationHook(props.featureUrl);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage
  }

  const presenterRef = useRef<StatusItemPresenter | null>(null)
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

   const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <StatusItem
            key={index}
            status={item}
            featurePath={props.featureUrl}
            onNavigateToUser={navigateToUser}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
