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
  run: boolean;
  thingsToDoAfterRun: boolean;
  setState: (key: string, value: any) => void;
  setRun: (value: boolean) => void;
  reRun: boolean;
  nodes: Node<NodeData>[];
  Rnodes: Node<NodeData>[];
  nodesRewrited: Node<NodeData>[];
  onNodesChange: OnNodesChange;
  getNextNodeId: () => string;
  edges: Edge[];
  Redges: Edge[];
  edgesRewrited: Edge[];
  getPins: () => any;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, key: string, value: any) => void;
};

const useStoreDigram = create(
  subscribeWithSelector<RFState>((set, get) => ({
    run: false,
    thingsToDoAfterRun: false,
    setState: (key: string, value: any) => {
      set({
        [key]: value,
      });
    },
    setRun: (value: boolean) => {
      set({
        run: value,
      });
    },
    reRun: false,
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
    Rnodes: [],
    Redges: [],
    nodesRewrited: [],
    edgesRewrited: [],
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
        reRun: true,
      });
    },
  }))
);

// useStore.subscribe(
//   (state) => [state.nodes,state.edges],
//   (state) => {
//     // console.log("reRun2", state);
//     // useStore.setState((state) => ({
//     //   Rnodes: state.nodes,
//     // }));
//   },
//   {
//     equalityFn: shallow,
//   }
// );
export default useStoreDigram;
