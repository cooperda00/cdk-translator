import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env.USER_POOL_CLIENT_ID!,
      userPoolId: process.env.USER_POOL_ID!,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Authenticator.Provider>
  );
}
