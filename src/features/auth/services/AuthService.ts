import { authClient } from "@/config/auth.config";
import { User } from "oidc-client-ts";


export const login = async (redirectPath?: string) =>  {
    await authClient.signinRedirect({state: redirectPath})
}

export const loginCallback = async () : Promise<User> => {
    const user = await authClient.signinRedirectCallback()
    if (!user) {
        throw new Error("Não foi possível efetuar o login")
    }  

    return user
}

export const logout = async () => {
    await authClient.signoutRedirect()
}

export const register = async (redirectPath?: string) => {
  await authClient.signinRedirect({
    state: redirectPath,
    extraQueryParams: {kc_action: "register"}
  })
}

export const isAuthenticated = async () => {
    const user = await authClient.getUser()
    return !!user && !user.expired
}
