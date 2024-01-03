import Authenticator from "./authenticator";
import axios, { Method } from "axios";

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
    method: Method = "GET",
    data: any = null
  ): Promise<any> {
    try {
      let token = this.authenticator.getAccessToken();

      if (this.authenticator.isTokenExpired()) {
        await this.authenticator.getRefreshToken();
        token = this.authenticator.getAccessToken();
      }

      const response = await axios({
        method,
        url: `${this.serviceBaseUrl}/${endpoint}`,
        headers: { Authorization: `Bearer ${token}` },
        data,
      });

      return response.data;
    } catch (error) {
      // if (axios.isAxiosError(error) && error.response?.status === 401) {
      //   console.log("Unautorized User");
      // await this.authenticator.refreshToken();
      // return this.makeAuthenticatedRequest(endpoint, method, data);
      // } else {
      throw error;
      // }
    }
  }
}
export default ServiceClient;
