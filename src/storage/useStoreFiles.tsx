import { create } from "zustand";

import { subscribeWithSelector } from "zustand/middleware";

export type IStoreFiles = {
  main_c: string;
  logic_c: string;
  logic_h: string;
};
type IStoreFilesP = {
  main_c?: string;
  logic_c?: string;
  logic_h?: string;
};
interface ISetState {
  key: keyof IStoreFiles;
  value: any;
}
export interface IFileState extends IStoreFiles {
  setState: (keyVals: ISetState[]) => void;
}

const useStoreFiles = create(
  subscribeWithSelector<IFileState>((set, get) => ({
    main_c: "",
    logic_c: "",
    logic_h: "",
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

export default useStoreFiles;
