import Authenticator from "./authenticator";

interface ServiceClientConfig {
  serviceBaseUrl: string;
}

// ServiceClient Class
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
    headers: any = null
  ): Promise<any> {
    try {
      const token = await this.authenticator.getCurrentUserToken();
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...headers,
        },
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
