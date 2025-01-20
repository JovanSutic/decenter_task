import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Layout from "./components/Layout";
import { initWeb3 } from "./utils/web3Instance";

function App() {
  useEffect(() => {
    initWeb3();
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
