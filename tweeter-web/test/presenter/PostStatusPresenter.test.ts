import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const statusString = "Hello, world!";
  const user = new User("John", "Doe", "@johndoe", "");
  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);
    when(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  })
  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(statusString, user, authToken);
    verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
  })
  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(statusString, user, authToken);
    const [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual(statusString);
  })
  it("the presenter tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(statusString, user, authToken);
    verify(mockPostStatusPresenterView.deleteMessage("messageId123")).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  })
  it("the presenter tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    when(mockService.postStatus(anything(), anything())).thenThrow(new Error("An error occurred"));;
    await postStatusPresenter.submitPost(statusString, user, authToken);
    verify(mockPostStatusPresenterView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
  })
})