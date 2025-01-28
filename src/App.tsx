import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Layout from "./components/Layout";
import { useEffect } from "react";
import { store } from "./hooks/store";

function App() {
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      store.setState("isMetamaskConnected", (state) => ({
        ...state,
        provider: "Metamask",
      }));

      const handleAccountsChanged = (accounts: string[]) => {
        store.setState("isMetamaskConnected", (state) => ({
          ...state,
          isMetamaskConnected: accounts.length > 0,
        }));
      };

      const handleChainChanged = () => {
        store.setState("isMetamaskConnected", (state) => ({
          ...state,
          isMetamaskConnected: false,
        }));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    } else {
      store.setState("isMetamaskConnected", (state) => ({
        ...state,
        provider: "Infura",
      }));
      console.log("MetaMask not detected!");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":id" element={<Single />} />
      </Route>
    </Routes>
  );
}

export default App;
