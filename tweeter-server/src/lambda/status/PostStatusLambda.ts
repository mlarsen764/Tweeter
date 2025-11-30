import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { PostStatusLambda } from "../PostStatusLambda";

const handlerInstance = new PostStatusLambda();
export const handler = (request: PostStatusRequest): Promise<PostStatusResponse> => 
  handlerInstance.handle(request);