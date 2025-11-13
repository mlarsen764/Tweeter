import { TweeterResponse } from "./TweeterResponse";
import { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusItemResponse extends TweeterResponse {
  readonly items: StatusDto[];
  readonly hasMore: boolean;
}