import { useEffect } from "react";
import Form from "../components/Form";
import List from "../components/List";
import { store } from "../hooks/store";
import { State } from "../types/store.types";

const Home = () => {
  useEffect(() => {
    const currentCDP = store.getStateValue("currentCDP");
    if (currentCDP) {
      store.setState("currentCDP", (state: State) => ({
        ...state,
        currentCDP: null,
      }));
    }

    return () => {
      store.setState(
        ["currentId", "currentType", "fetchId"],
        (state: State) => ({
          ...state,
          currentId: "",
          currentType: undefined,
          fetchId: "",
        })
      );
    };
  }, []);
  return (
    <div>
      <Form />
      <List />
    </div>
  );
};

export default Home;
