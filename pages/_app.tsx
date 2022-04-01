import { useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloClient, ApolloProvider } from "@apollo/client";

import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { Layout } from "@/components/all";
import { cache } from "../cache";
import { fetchFromLocalStorage } from "@/utils/fetchFromLocalStorage";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache,
  headers: {
    authrization: fetchFromLocalStorage("rices"),
  },
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
