import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { AmazonProvider } from "../context/amazonContext";

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider serverUrl={serverUrl} appId={appId}>
      <AmazonProvider>
        <Component {...pageProps} />
      </AmazonProvider>
    </MoralisProvider>
  );
}

export default MyApp;
