import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { LogoutLambda } from "../LogoutLambda";

const handlerInstance = new LogoutLambda();
export const handler = (request: LogoutRequest): Promise<LogoutResponse> => 
  handlerInstance.handle(request);