import { PostStatusRequest, PostStatusResponse, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
  const statusService = new StatusService();
  await statusService.postStatus(AuthToken.fromJson(request.token)!, Status.fromDto(request.newStatus)!);

  return {
    success: true,
    message: null
  }
}