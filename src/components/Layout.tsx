import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <main className="sm:w-full md:w-[600px] mx-auto box-border p-2">
      <header className="w-full">
        <Header />
      </header>
      <section>
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
