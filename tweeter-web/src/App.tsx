import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { useUserNavigationHook } from "./components/userItem/UserNavigationHook";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { User } from "tweeter-shared/dist/model/domain/User";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <FeedRoute key={`feed-${displayedUser!.alias}`} />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <StoryRoute key={`story-${displayedUser!.alias}`} />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <FolloweesRoute key={`followees-${displayedUser!.alias}`} />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <FollowersRoute key={`followers-${displayedUser!.alias}`} />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

const createRoute = <T,>(featureUrl: string, presenterFactory: (view: PagedItemView<T>) => any, renderItem: (item: T, index: number, featureUrl: string) => JSX.Element) => () => (
  <ItemScroller<T>
    featureUrl={featureUrl}
    presenterFactory={presenterFactory}
    renderItem={renderItem}
  />
);

const renderStatus = (status: Status, index: number, featureUrl: string) => {
  const { navigateToUser } = useUserNavigationHook(featureUrl);
  return <StatusItem key={index} status={status} featurePath={featureUrl} onNavigateToUser={navigateToUser} />;
};

const renderUser = (user: User, index: number, featureUrl: string) => (
  <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
    <UserItem user={user} featurePath={featureUrl} />
  </div>
);

const FeedRoute = createRoute("/feed", (view: PagedItemView<Status>) => new FeedPresenter(view), renderStatus);
const StoryRoute = createRoute("/story", (view: PagedItemView<Status>) => new StoryPresenter(view), renderStatus);
const FolloweesRoute = createRoute("/followees", (view: PagedItemView<User>) => new FolloweePresenter(view), renderUser);
const FollowersRoute = createRoute("/followers", (view: PagedItemView<User>) => new FollowerPresenter(view), renderUser);

export default App;
