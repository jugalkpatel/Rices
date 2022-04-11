import { AuthCredentials } from "../types";

function setAuthCredentialsInLocalStorage(value: AuthCredentials): boolean {
  if (typeof window !== "undefined") {
    localStorage?.setItem("rices", JSON.stringify(value));

    return true;
  }

  return false;
}

export default setAuthCredentialsInLocalStorage;
