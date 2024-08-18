import { Authenticator, ServiceClient } from "@repo/web-sdk";

export const Auth = new Authenticator({ firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY });

export const Service = new ServiceClient(
  {
    serviceBaseUrl: "http://localhost:3010",
  },
  Auth
);

export default { Auth, Service };
