import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { IsFollowerLambda } from "../IsFollowerLambda";

const handlerInstance = new IsFollowerLambda();
export const handler = (request: IsFollowerRequest): Promise<IsFollowerResponse> => 
  handlerInstance.handle(request);