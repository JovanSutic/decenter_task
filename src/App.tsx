import React from "react";
import AppHeader from "./components/AppHeader";
import Form from "./components/Form";
import List from "./components/List";

function App() {
  return (
    <main className="sm:w-full md:w-[600px] mx-auto box-border p-2">
      <header className="w-full">
        <AppHeader />
      </header>
      <section className="w-full">
        <Form />
      </section>

      <section className="w-full">
        <List />
      </section>
    </main>
  );
}

export default App;
