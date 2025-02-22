import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { subscribeWithSelector } from "zustand/middleware";
import {
  nodes as initialNodes,
  edges as initialEdges,
} from "../ladder/initial-elements";
import { shallow } from "zustand/shallow";

export type NodeData = {
  color: string;
  state: boolean;
  name: string;
  pin: string;
  address?: string;
};

export type IStoreDiagramF = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  // diagram utility
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodesChange: OnNodesChange;
  // debugger
  // debuggerNodes: Node<NodeData>[];
  // debuggerEdges: Edge[];
  debugging: boolean;
};

type IStoreDiagramP = {
  nodes?: Node<NodeData>[];
  edges?: Edge[];
  // diagram utility
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onNodesChange?: OnNodesChange;
  // debugger
  // debuggerNodes?: Node<NodeData>[];
  // debuggerEdges?: Edge[];
  debugging?: boolean;
};
export interface IStoreDiagram extends IStoreDiagramF {
  getPins: () => any;
  setState: (key: keyof IStoreDiagramF, value: any) => void;
  updateNodeData: (nodeId: string, key: string, value: any) => void;
  getNextNodeData: (type: string) => {
    id: string;
    pin: string;
    name: string;
  };
  setDebugging: (value: boolean) => void;
  setMultiState: (
    keyVals: {
      key: keyof IStoreDiagramF;
      value: any;
    }[]
  ) => void;
}
const useStoreDiagram = create(
  subscribeWithSelector<IStoreDiagram>((set, get) => ({
    debugging: false,
    setState: (key: keyof IStoreDiagramF, value: any) => {
      set({
        [key]: value,
      });
    },
    setMultiState: (
      keyVals: {
        key: keyof IStoreDiagramF;
        value: any;
      }[]
    ) => {
      let result: IStoreDiagramP = {};
      for (let i = 0; i < keyVals.length; i++) {
        const { key, value } = keyVals[i];
        result[key] = value;
      }
      set(result);
    },
    setDebugging: (value: boolean) => {
      set({
        debugging: value,
      });
    },
    nodes: initialNodes,
    edges: initialEdges,
    getPins: () => {
      const nodes: Node[] = get().nodes;
      let inputs = [];
      let outputs = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.type === "Input") inputs.push(node.data);
        if (node.type === "Output") outputs.push(node.data);
      }
      return {
        inputs,
        outputs,
      };
    },
    getNextNodeData: (type: string) => {
      const nodes: Node[] = get().nodes;
      const id = String(
        Math.max(
          ...nodes.map((node) =>
            Number(node.id !== "Phase" && node.id !== "Null" ? node.id : "0")
          )
        ) + 1
      );
      const pin =
        "GPIO_PIN_" +
        String(
          Math.max(
            ...nodes.map((node) => {
              const res = Number(
                (node?.data?.pin ?? "GPIO_PIN_0").split("_")?.[2]
              );

              return Number.isNaN(res) ? 0 : res;
            })
          ) + 1
        );
      const name =
        (type === "Input" ? "in" : type === "Output" ? "out" : "unknown") +
        String(
          Math.max(
            ...nodes.map((node) => {
              const res =
                node.type === "Input"
                  ? Number((node?.data?.name ?? "in0").split("in")?.[1])
                  : node.type === "Output"
                  ? Number((node?.data?.name ?? "out0").split("out")?.[1])
                  : 0;
              console.log("hasan ", (node?.data?.pin ?? "in0").split("in"));
              return Number.isNaN(res) ? 0 : res;
            })
          ) + 1
        );
      return {
        id,
        name,
        pin,
      };
    },
    // debuggerNodes: initialNodes,
    // debuggerEdges: initialEdges,

    onNodesChange: (changes: NodeChange[]) => {
      // console.log("changes", changes);
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(
          {
            ...connection,
            type: "step",
          },
          get().edges
        ),
      });
    },
    updateNodeData: (nodeId: string, key: string, value: any) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [key]: value };
          }
          return node;
        }),
      });
    },
  }))
);

useStoreDiagram.subscribe(
  (state) => [state.nodes, state.edges],
  (state) => {
    console.log("normalState", state);
  },
  {
    equalityFn: shallow,
  }
);
// useStoreDiagram.subscribe(
//   (state) => [state.debuggerNodes, state.debuggerEdges],
//   (state) => {
//     console.log("debuggerState", state);
//   },
//   {
//     equalityFn: shallow,
//   }
// );
export default useStoreDiagram;
