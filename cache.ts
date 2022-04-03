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
            return setAuthorization();
          },
        },
        id: {
          read() {
            return setUserId();
          },
        },
        name: {
          read() {
            return setUserName();
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

export const setAuthorization = makeVar<boolean>(isLoggedIn);

export const setUserId = makeVar<string>(id);

export const setUserName = makeVar<string>(name);
