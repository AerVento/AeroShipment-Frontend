import { JSX, createContext, useContext } from "solid-js";
import { UserRole } from "./data";
import { createStore, SetStoreFunction, Store } from "solid-js/store";

export type UserState = {
  username: string;
  role: UserRole;
  token: string;
};

interface AppState {
  user: UserState | null;
}

const StateContext =
  createContext<[Store<AppState>, SetStoreFunction<AppState>]>();

interface StateProviderProps {
  children: JSX.Element;
}

export const StateProvider = (props: StateProviderProps) => {
  const storage = localStorage.getItem("state");

  let initialState;

  if (storage === null) {
    // default state
    initialState = { user: null };
  } else {
    initialState = JSON.parse(storage);
  }

  const [state, setState] = createStore<AppState>(initialState);

  // shit AnyScript :)
  const setStorage = (...props: any[]) => {
    (setState as any)(...props);
    localStorage.setItem("state", JSON.stringify(state));
  };

  return (
    <StateContext.Provider value={[state, setStorage]}>
      {props.children}
    </StateContext.Provider>
  );
};

export const useState = () => {
  const state = useContext(StateContext);

  if (typeof state === "undefined") {
    throw new Error("`useState` can only be used in `StateProvider`");
  }

  return state;
};
