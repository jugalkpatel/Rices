export type AuthMode = "LOGIN" | "REGISTER";

export type AuthCredentials = {
  token: string;
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
};

export type AuthResponse = {
  __typename: string;
  token: string;
  user: User;
};

export type AuthError = {
  __typename: string;
  message: string;
};
