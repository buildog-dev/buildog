import Authenticator from "./authenticator";

interface ServiceClientConfig {
  serviceBaseUrl: string;
}

class ServiceClient {
  private serviceBaseUrl: string;
  private authenticator: Authenticator;

  constructor(config: ServiceClientConfig, authenticator: Authenticator) {
    this.serviceBaseUrl = config.serviceBaseUrl;
    this.authenticator = authenticator;
  }

  async makeAuthenticatedRequest(
    endpoint: string,
    method: string = "GET",
    data: any = null,
    headers: { [key: string]: string } = {}
  ): Promise<any> {
    try {
      const token = await this.authenticator.getCurrentUserToken();
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      // Default headers
      const defaultHeaders: { [key: string]: string } = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Combine default headers with dynamic headers passed as argument
      const finalHeaders = { ...defaultHeaders, ...headers };

      const options: RequestInit = {
        method,
        headers: finalHeaders,
      };

      if (data && method !== "GET") {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.serviceBaseUrl}/${endpoint}`, options);

      if (!response.ok) {
        if (response.status === 401) {
          console.log("Unauthorized User");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error making request:", error);
      throw error;
    }
  }
}

export default ServiceClient;
