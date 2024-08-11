import { Authenticator, ServiceClient } from "@repo/web-sdk";

export const Auth = new Authenticator({
  authEndpoint: "http://localhost:3010",
});

export const Service = new ServiceClient(
  {
    serviceBaseUrl: "http://localhost:3010",
  },
  Auth
);

export default { Auth, Service };
