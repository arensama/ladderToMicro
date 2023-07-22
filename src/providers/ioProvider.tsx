import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export const IoDispatcherContext = createContext<
  Dispatch<SetStateAction<Socket>>
>(() => {});
export const IoContext = createContext<Socket>(io());
// React.FC

export const IoProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Socket>(io(`ws://localhost:8080`));
  return (
    <IoDispatcherContext.Provider value={setState}>
      <IoContext.Provider value={state}>{children}</IoContext.Provider>
    </IoDispatcherContext.Provider>
  );
};
