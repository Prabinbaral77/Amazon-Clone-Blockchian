import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { AmazonProvider } from "../context/amazonContext";
import { ModalProvider } from "react-simple-hook-modal";

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider serverUrl={serverUrl} appId={appId}>
      <AmazonProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </AmazonProvider>
    </MoralisProvider>
  );
}

export default MyApp;
