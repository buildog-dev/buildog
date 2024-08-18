export interface SignInResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
}

export interface RefreshTokenResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  userId: string;
}

export interface SendVerificationEmailResponse {
  email: string;
}

export interface SignUpResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
}

export interface FirebaseTokenPayload {
  aud: string; // Audience (usually the project ID)
  auth_time: number; // Authentication time as a Unix timestamp
  email: string; // User's email address
  email_verified: boolean; // Indicates whether the email is verified
  exp: number; // Expiration time as a Unix timestamp
  firebase: {
    identities: {
      [key: string]: string[]; // The identities associated with the user
    };
    sign_in_provider: string; // The sign-in provider used (e.g., 'password')
  };
  iat: number; // Issued at time as a Unix timestamp
  iss: string; // Issuer URL
  sub: string; // Subject (user ID)
  user_id: string; // User ID (same as `sub`)
}

export async function signInWithRestAPI(
  email: string,
  password: string,
  apiKey: string
): Promise<SignInResponse> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message);
  }

  const data = await response.json();
  return data as SignInResponse;
}

export async function refreshTokenWithRestAPI(
  refreshToken: string,
  apiKey: string
): Promise<RefreshTokenResponse> {
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message);
  }

  const data = await response.json();
  return data as RefreshTokenResponse;
}

async function sendVerificationEmailWithRestAPI(
  idToken: string,
  apiKey: string
): Promise<SendVerificationEmailResponse> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType: "VERIFY_EMAIL",
        idToken: idToken,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message);
  }

  const data = await response.json();
  return data as SendVerificationEmailResponse;
}

export async function signUpAndSendVerificationWithRestAPI(
  email: string,
  password: string,
  apiKey: string
): Promise<SignUpResponse> {
  const signUpResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    }
  );

  if (!signUpResponse.ok) {
    const errorData = await signUpResponse.json();
    throw new Error(errorData.error.message);
  }

  const signUpData = (await signUpResponse.json()) as SignUpResponse;

  // Send verification email
  await sendVerificationEmailWithRestAPI(signUpData.idToken, apiKey);

  return signUpData;
}
