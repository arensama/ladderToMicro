import { create } from "zustand";

import { subscribeWithSelector } from "zustand/middleware";

export type IGlobalData = {
  modal: string;
};
export interface IGlobalState extends IGlobalData {
  setState: (key: keyof IGlobalData, value: any) => void;
}

const useStoreGlobalData = create(
  subscribeWithSelector<IGlobalState>((set, get) => ({
    modal: "",
    setState: (key: string, value: any) => {
      set({
        [key]: value,
      });
    },
  }))
);

// useStoreGlobalData.subscribe(
//   (state) => [state.nodes,state.edges],
//   (state) => {
//     // console.log("reRun2", state);
//     // useStoreGlobalData.setState((state) => ({
//     //   Rnodes: state.nodes,
//     // }));
//   },
//   {
//     equalityFn: shallow,
//   }
// );
export default useStoreGlobalData;
