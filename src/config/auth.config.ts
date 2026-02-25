import { UserManager } from "oidc-client-ts";

export const authClient = new UserManager({
  authority: "http://localhost:8080/realms/condolife",
  client_id: "condolife-web",
  redirect_uri: "http://localhost:5173/auth/callback",
  response_type: "code",
  post_logout_redirect_uri: "http://localhost:5173",
  scope: "openid profile email",
});
