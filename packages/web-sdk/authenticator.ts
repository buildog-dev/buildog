import axios from "axios";
import { EventEmitter } from "events";
import { jwtDecode } from "jwt-decode";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthenticatorConfig {
  authEndpoint: string;
}

interface SignUpConfig {
  signUpBaseUrl: string;
}

interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class Authenticator extends EventEmitter {
  private authEndpoint: string;
  private accessToken: string | null;
  private refreshToken: string | null;

  constructor(config: AuthenticatorConfig) {
    super();
    this.authEndpoint = config.authEndpoint;
    this.accessToken =
      typeof window !== "undefined" ? this.loadAccessTokenFromLocalStorage() : null;
    this.refreshToken =
      typeof window !== "undefined" ? this.loadRefreshTokenFromLocalStorage() : null;
  }

  async Login(credentials: LoginCredentials): Promise<{
    auth: boolean;
    error?: {
      error?: string;
      error_description: string;
    };
  }> {
    try {
      const response = await axios.post(this.authEndpoint + "/auth/login", credentials);
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      localStorage.setItem("buildog-sdk", JSON.stringify(response.data));
      this.emit("authenticated");

      return { auth: true };
    } catch (error: any) {
      this.emit("authentication_failed");

      // Check if the error has the expected structure
      if (error.response && typeof error.response.code === "string") {
        return {
          auth: false,
          error: error.response.data,
        };
      } else {
        // Handle unexpected error formats
        return {
          auth: false,
          error: {
            error_description: "An unknown error occurred",
          },
        };
      }
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<{
    isSignedIn: boolean;
    error?: {
      error?: string;
      error_description: string;
    };
  }> {
    try {
      await axios.post(this.authEndpoint + "/auth/signup", credentials);

      return { isSignedIn: true };
    } catch (error: any) {
      this.emit("sign up failed", error);

      // Check if the error has the expected structure
      if (error.response && typeof error.response.code === "string") {
        return {
          isSignedIn: false,
          error: error.response.data,
        };
      } else {
        // Handle unexpected error formats
        return {
          isSignedIn: false,
          error: {
            error_description: "An unknown error occurred",
          },
        };
      }
    }
  }

  async getRefreshToken(): Promise<void> {
    try {
      const response = await axios.post(
        this.authEndpoint + "/auth/refresh",
        { refresh_token: this.refreshToken },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      this.accessToken = response.data.access_token;

      localStorage.setItem(
        "buildog-sdk",
        JSON.stringify({
          refresh_token: this.refreshToken,
          ...response.data,
        })
      );

      this.emit("refresh");
    } catch (error) {
      this.emit("refresh_failed");
    }
  }

  emitInitialState() {
    if (this.accessToken && !this.isTokenExpired()) {
      this.emit("authenticated");
    } else {
      this.emit("authentication_failed");
    }
  }

  removeLocalStoragedToken() {
    localStorage.removeItem("buildog-sdk");
    this.emit("authentication_failed");
  }

  onAuthenticationChange(callback: (eventType: string, data?: any) => void) {
    this.on("authenticated", () => callback("authenticated"));
    this.on("authentication_failed", () =>
      callback("authentication_failed", {
        error: "Authentication failed",
      })
    );
    this.on("refresh", () => callback("refresh"));
    this.on("refresh_failed", () =>
      callback("refresh_failed", {
        error: "Refresh failed",
      })
    );
    this.emitInitialState();
  }

  async logout(): Promise<void> {
    return this.removeLocalStoragedToken();
  }

  hasExpired(unixTimestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return unixTimestamp < now;
  }

  isTokenExpired(): boolean {
    const decodedHeader = jwtDecode(this.accessToken as string);
    return this.hasExpired(decodedHeader.exp as number);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private loadAccessTokenFromLocalStorage(): string | null {
    const storedData = localStorage.getItem("buildog-sdk");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData.access_token;
    }
    return null;
  }

  private loadRefreshTokenFromLocalStorage(): string | null {
    const storedData = localStorage.getItem("buildog-sdk");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData.refresh_token;
    }
    return null;
  }
}

export default Authenticator;
