import { Authenticator, ServiceClient } from "@repo/web-sdk";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
export const Auth = new Authenticator(firebaseConfig);

export const Service = new ServiceClient(
  {
    serviceBaseUrl: "http://localhost:3010",
  },
  Auth
);

export default { Auth, Service };
