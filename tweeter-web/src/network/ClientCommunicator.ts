import { TweeterRequest, TweeterResponse } from "tweeter-shared";

export class ClientCommunicator {
  private SERVER_URL: string;

  public constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }

  public async doPost<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ | undefined,
    endpoint: string,
    headers?: Headers
  ): Promise<RES> {
    if (headers && req) {
      headers.append("Content-type", "application/json");
    } else if (req) {
      headers = new Headers({
        "Content-type": "application/json",
      });
    }

    const url = this.getUrl(endpoint);
    const params = this.getParams(
      "POST",
      headers,
      req ? JSON.stringify(req) : req
    );

    try {
      const resp: Response = await fetch(url, params);

      if (resp.ok) {
        // Be careful with the return type here. resp.json() returns Promise<any> which means there is no type checking on response.
        const response: RES = await resp.json();
        return response;
      } else {
        // Try to parse the error response
        try {
          const errorResponse = await resp.json();
          // If it has an errorMessage field, it's from API Gateway error handling
          if (errorResponse.errorMessage) {
            throw new Error(errorResponse.errorMessage);
          }
          // If it has success field, it's our structured response
          if (errorResponse.hasOwnProperty('success')) {
            return errorResponse as RES;
          }
          // Fallback for other error formats
          throw new Error(errorResponse.message || 'Unknown error');
        } catch (parseError) {
          // If we can't parse the error response, throw a generic error
          throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }
      }
    } catch (error) {
      console.error(error);
      // Don't wrap the error if it's already our custom error
      if ((error as Error).message.includes('Client communicator')) {
        throw error;
      }
      throw new Error(
        `Client communicator ${params.method} failed:\n${
          (error as Error).message
        }`
      );
    }
  }

  private getUrl(endpoint: string): string {
    return this.SERVER_URL + endpoint;
  }

  private getParams(
    method: string,
    headers?: Headers,
    body?: BodyInit
  ): RequestInit {
    const params: RequestInit = { method: method };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}