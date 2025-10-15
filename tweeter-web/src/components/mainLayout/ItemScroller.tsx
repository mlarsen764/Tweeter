import { useState, useEffect, useRef, ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { PagedItemPresenter, PagedItemView } from "../../presenter/PagedItemPresenter";
import { Service } from "../../model.service/Service";

interface Props<T> {
  featureUrl: string;
  presenterFactory: (view: PagedItemView<T>) => PagedItemPresenter<T, Service>;
  renderItem: (item: T, index: number, featureUrl: string) => ReactNode;
}

const ItemScroller = <T,>(props: Props<T>) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage
  }

  const presenterRef = useRef<PagedItemPresenter<T, Service> | null>(null)
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

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
        {items.map((item, index) => props.renderItem(item, index, props.featureUrl))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;