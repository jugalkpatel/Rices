import { AuthCredentials } from "@/types/";

function getAuthCredentials(): AuthCredentials | undefined {
  if (typeof window !== "undefined") {
    const value = localStorage?.getItem("rices");

    if (value) {
      const { id, token, name }: AuthCredentials = JSON.parse(value);

      if (!id || !token || !name) {
        return undefined;
      }

      return { id, token, name };
    }

    return undefined;
  }

  return undefined;
}

export default getAuthCredentials;
