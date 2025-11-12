import { UserDto } from "../../dto/UserDto";

export interface FollowCountRequest {
  readonly token: string;
  readonly user: UserDto;
}