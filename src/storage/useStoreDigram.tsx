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
};

export type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  //  for seprating input outputs
  getPins: () => any;
  // diagram utility
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, key: string, value: any) => void;
  getNextNodeId: () => string;
  onNodesChange: OnNodesChange;
  // for easy set
  setState: (key: string, value: any) => void;
  // debugger
  debuggerNodes: Node<NodeData>[];
  debuggerEdges: Edge[];

  debugging: boolean;
  setDebugging: (value: boolean) => void;
};

const useStoreDigram = create(
  subscribeWithSelector<RFState>((set, get) => ({
    debugging: false,
    setState: (key: string, value: any) => {
      set({
        [key]: value,
      });
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
    getNextNodeId: () => {
      const nodes: Node[] = get().nodes;
      return String(
        Math.max(
          ...nodes.map((node) =>
            Number(node.id !== "Phase" && node.id !== "Null" ? node.id : "0")
          )
        ) + 1
      );
    },
    debuggerNodes: [],
    debuggerEdges: [],

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

// useStore.subscribe(
//   (state) => [state.nodes,state.edges],
//   (state) => {
//     // useStore.setState((state) => ({
//     //   debuggerNodes: state.nodes,
//     // }));
//   },
//   {
//     equalityFn: shallow,
//   }
// );
export default useStoreDigram;
