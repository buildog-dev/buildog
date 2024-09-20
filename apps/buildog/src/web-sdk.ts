import { User, Authenticator, ServiceClient } from "@repo/web-sdk";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PULIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

export const Auth = new Authenticator(firebaseConfig);
export const Service = new ServiceClient(
  {
    serviceBaseUrl: process.env.NEXT_PUBLIC_SERVICE_BASE_URL,
  },
  Auth
);

export type { User };
export default { Auth, Service };
