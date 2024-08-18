import { EventEmitter } from "events";
import { jwtDecode } from "jwt-decode";
import { FirebaseError } from "firebase/app";
import {
  FirebaseTokenPayload,
  refreshTokenWithRestAPI,
  signInWithRestAPI,
  signUpAndSendVerificationWithRestAPI,
} from "./firebase";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthenticatorConfig {
  firebaseApiKey: string;
}

interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class Authenticator extends EventEmitter {
  private firebaseApiKey: string;
  private accessToken: string | null;
  private refreshToken: string | null;

  constructor(config: AuthenticatorConfig) {
    super();
    this.firebaseApiKey = config.firebaseApiKey;
    this.accessToken =
      typeof window !== "undefined" ? this.loadAccessTokenFromLocalStorage() : null;
    this.refreshToken =
      typeof window !== "undefined" ? this.loadRefreshTokenFromLocalStorage() : null;
  }

  async login(credentials: LoginCredentials): Promise<{
    auth: boolean;
    error?: {
      error?: string;
      error_description: string;
    };
  }> {
    try {
      const { email, password } = credentials;
      const response = await signInWithRestAPI(email, password, this.firebaseApiKey);

      const decodeJWT: FirebaseTokenPayload = jwtDecode(response.idToken);
      if (!decodeJWT.email_verified) {
        return {
          auth: false,
          error: {
            error_description: "Email is not verified.",
          },
        };
      }

      this.accessToken = response.idToken;
      this.refreshToken = response.refreshToken;
      this.saveTokensToLocalStorage(this.accessToken, this.refreshToken);

      this.emit("authenticated");
      return { auth: true };
    } catch (error: unknown) {
      this.emit("authentication_failed");

      if (error instanceof FirebaseError) {
        return {
          auth: false,
          error: {
            error_description: error.message,
            error: error.code,
          },
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
    isSignedUp: boolean;
    error?: {
      error?: string;
      error_description: string;
    };
  }> {
    try {
      const { email, password } = credentials;
      await signUpAndSendVerificationWithRestAPI(email, password, this.firebaseApiKey);

      return { isSignedUp: true };
    } catch (error: any) {
      this.emit("sign up failed", error);

      // Check if the error has the expected structure
      if (error.response && typeof error.response.code === "string") {
        return {
          isSignedUp: false,
          error: error.response.data,
        };
      } else {
        // Handle unexpected error formats
        return {
          isSignedUp: false,
          error: {
            error_description: "An unknown error occurred",
          },
        };
      }
    }
  }

  private saveTokensToLocalStorage(accessToken: string | null, refreshToken: string | null) {
    if (accessToken && refreshToken) {
      localStorage.setItem(
        "buildog-sdk",
        JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
      );
    }
  }

  async getRefreshToken(): Promise<void> {
    try {
      const response = await refreshTokenWithRestAPI(
        this.refreshToken as string,
        this.firebaseApiKey
      );

      this.accessToken = response.idToken;
      this.refreshToken = response.refreshToken;
      this.saveTokensToLocalStorage(this.accessToken, this.refreshToken);

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
    this.emit("authentication_failed");
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
