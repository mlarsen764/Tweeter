import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { AuthenticationView } from "./Presenter";
import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { Buffer } from "buffer";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private userService: UserService;

  public constructor(view: RegisterView) {
    super(view);
    this.userService = new UserService();
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  }

  public handleImageFile(file: File | undefined): void {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];
        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");
        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ): Promise<void> {
    await this.doAuthenticationOperation(
      () => this.userService.register(firstName, lastName, alias, password, imageBytes, imageFileExtension),
      rememberMe,
      "register user"
    );
  };
}