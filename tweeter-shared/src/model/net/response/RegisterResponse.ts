import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";

export interface RegisterResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly token: string | null;
}