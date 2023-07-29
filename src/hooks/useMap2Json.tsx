import { shallow } from "zustand/shallow";
import useStoreFiles from "../storage/useStoreFiles";
import useStoreDigram from "../storage/useStoreDigram";

export const useMap2Json = () => {
  const [inputAdress, outputAdress] = useStoreFiles(
    (state) => [state.inputAdress, state.outputAdress],
    shallow
  );
  const [nodes, edges, getPins] = useStoreDigram(
    (state) => [state.nodes, state.edges, state.getPins],
    shallow
  );
};
