import { create } from "zustand";

import { subscribeWithSelector } from "zustand/middleware";

export type IGlobalData = {
  compilerModal: boolean;
  mapModal: boolean;
};
type IStoreFilesP = {
  compilerModal?: boolean;
  mapModal?: boolean;
};
interface ISetState {
  key: keyof IGlobalData;
  value: any;
}
export interface IGlobalState extends IGlobalData {
  setState: (keyVals: ISetState[]) => void;
}

const useStoreGlobalData = create(
  subscribeWithSelector<IGlobalState>((set, get) => ({
    compilerModal: false,
    mapModal: false,
    setState: (keyVals: ISetState[]) => {
      let result: IStoreFilesP = {};
      for (let i = 0; i < keyVals.length; i++) {
        const { key, value } = keyVals[i];
        result[key] = value;
      }
      set(result);
    },
  }))
);

// useStoreGlobalData.subscribe(
//   (state) => [state.nodes,state.edges],
//   (state) => {
//     // useStoreGlobalData.setState((state) => ({
//     //   Rnodes: state.nodes,
//     // }));
//   },
//   {
//     equalityFn: shallow,
//   }
// );
export default useStoreGlobalData;
