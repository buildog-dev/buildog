import { EventEmitter } from "events";
import axios from "axios";
interface SignUpConfig {
  signUpBaseUrl: string;
}

interface Credentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class SignUp extends EventEmitter {
  private authEndpoint: string;

  constructor(config: SignUpConfig) {
    super();
    this.authEndpoint = config.signUpBaseUrl;
  }

  async signUp(credentials: Credentials): Promise<{
    isSignedIn: boolean;
    error?: {
      error?: string;
      error_description: string;
    };
  }> {
    try {
      const response = await axios.post(this.authEndpoint + "/auth/signup", credentials);

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
}

export default SignUp;
