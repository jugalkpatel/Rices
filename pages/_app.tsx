import { useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { Layout } from "@/components/all";
import { cache, setAuthCredentials } from "../cache";
import getAuthCredentials from "@/utils/getAuthCredentials";
import removeTokenFromLocalStorage from "@/utils/removeTokenFromLocalStorage";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      if (err.extensions.code === "TOKEN_EXPIRED") {
        // remove token and logout
        removeTokenFromLocalStorage();
        setAuthCredentials({ authorization: false, userId: "", userName: "" });

        // redirect to login
        Router.push("/access");
      }
    });
  }
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

const authLink = setContext((_, { headers }) => {
  let authCredentials = getAuthCredentials();

  return {
    headers: {
      ...headers,
      authorization:
        authCredentials && "token" in authCredentials
          ? `Bearer ${authCredentials.token}`
          : "",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>Rices</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: colorScheme === "dark" ? "dark" : "light",
            primaryColor: "orange",
            breakpoints: {
              xs: 0,
              sm: 576,
              md: 768,
              lg: 992,
              xl: 1200,
            },
          }}
          defaultProps={{
            Button: { color: "orange" },
            ActionIcon: { color: "orange" },
          }}
        >
          <NotificationsProvider>
            <ApolloProvider client={client}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ApolloProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

export default MyApp;
