import { InMemoryCache, makeVar } from "@apollo/client";
import getAuthCredentials from "@/utils/getAuthCredentials";

type UserCredentials = {
  isLoggedIn: boolean;
  id: string;
  name: string;
};

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return authorizationVar();
          },
        },
        id: {
          read() {
            return userIdVar();
          },
        },
        name: {
          read() {
            return userNameVar();
          },
        },
      },
    },
  },
});

function getUserCredentails(): UserCredentials {
  const authCredentials = getAuthCredentials();

  if (!authCredentials) {
    return { isLoggedIn: false, id: "", name: "" };
  }

  const { id, name, token } = authCredentials;

  return { id: id || "", isLoggedIn: !!token || false, name: name || "" };
}

const { id, isLoggedIn, name } = getUserCredentails();

export const authorizationVar = makeVar<boolean>(isLoggedIn);

export const userIdVar = makeVar<string>(id);

export const userNameVar = makeVar<string>(name);

// TODO: make a function setUserCredentials
export function setAuthCredentials({
  authorization,
  userId,
  userName,
}: {
  authorization: boolean;
  userId: string;
  userName: string;
}): void {
  authorizationVar(authorization);

  userIdVar(userId);

  userNameVar(userName);
}
