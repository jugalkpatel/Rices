import { AuthCredentials } from "../types";

function setAuthCredentials(value: AuthCredentials): boolean {
  if (typeof window !== "undefined") {
    localStorage?.setItem("rices", JSON.stringify(value));

    return true;
  }

  return false;
}

export default setAuthCredentials;
