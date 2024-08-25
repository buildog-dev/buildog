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
    data: any = null
  ): Promise<any> {
    try {
      // Retrieve the current user's token using the Authenticator class
      const token = await this.authenticator.getCurrentUserToken();

      // Check if the token is available
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      // Set up the request options
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // If the request method is not GET, add the body
      if (data && method !== "GET") {
        options.body = JSON.stringify(data);
      }

      // Make the request using fetch
      const response = await fetch(`${this.serviceBaseUrl}/${endpoint}`, options);

      // Check for HTTP errors
      if (!response.ok) {
        if (response.status === 401) {
          console.log("Unauthorized User");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse and return the response data
      return await response.json();
    } catch (error) {
      console.error("Error making request:", error);
      throw error;
    }
  }
}

export default ServiceClient;
