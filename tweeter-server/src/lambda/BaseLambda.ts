import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../model/service/auth/AuthorizationService";

export abstract class BaseLambda<TRequest, TResponse> {
  protected daoFactory = new DynamoDAOFactory();
  protected authService = new AuthorizationService(this.daoFactory.getAuthTokenDAO());

  public async handle(request: TRequest): Promise<TResponse> {
    await this.authenticate(request);
    return await this.executeOperation(request);
  }

  protected async authenticate(request: TRequest): Promise<void> {
    const token = this.extractToken(request);
    await this.authService.validateToken(token);
  }

  protected abstract extractToken(request: TRequest): string;
  protected abstract executeOperation(request: TRequest): Promise<TResponse>;
}