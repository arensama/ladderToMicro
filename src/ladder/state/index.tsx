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
} from "../initial-elements";
import { shallow } from "zustand/shallow";

export type NodeData = {
  color: string;
  state: boolean;
  name: string;
};

export type RFState = {
  run: boolean;
  setRun: (value: boolean) => void;
  nodes: Node<NodeData>[];
  Rnodes: Node<NodeData>[];
  onNodesChange: OnNodesChange;

  edges: Edge[];
  Redges: Edge[];

  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, key: string, value: any) => void;
};

const useStore = create(
  subscribeWithSelector<RFState>((set, get) => ({
    run: false,
    setRun: (value: boolean) => {
      set({
        run: value,
      });
    },
    nodes: initialNodes,
    edges: initialEdges,
    Rnodes: [],
    Redges: [],
    onNodesChange: (changes: NodeChange[]) => {
      console.log("changes", changes);
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
        edges: addEdge(connection, get().edges),
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
const dfs = useStore.subscribe(
  (state) => [state.edges, state.nodes],
  ([edges, nodes], prev) => {
    console.log(edges);
    useStore.setState((state) => ({
      Rnodes: state.nodes.map((node) => ({
        ...node,
        draggable: false,
      })),
    }));
  },
  {
    equalityFn: shallow,
  }
);
useStore.subscribe(
  (state) => [state.Rnodes],
  (state) => {
    console.log("Rnodes", state);
    // useStore.setState((state) => ({
    //   Rnodes: state.nodes,
    // }));
  },
  {
    equalityFn: shallow,
  }
);
useStore.subscribe((state) => {
  console.log("state", state);
  // useStore.setState((state) => ({
  //   Rnodes: state.nodes,
  // }));
});
export default useStore;