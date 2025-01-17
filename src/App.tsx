import React from "react";
import MetaMaskStatus from "./components/MetaMaskStatus";
import Form from "./components/Form";

function App() {
  return (
    <main className="sm:w-full md:w-[600px] mx-auto box-border p-2">
      <header className="w-full ">
        <MetaMaskStatus />
      </header>
      <section>
        <Form />
      </section>
    </main>
  );
}

export default App;
