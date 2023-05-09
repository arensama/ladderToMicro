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
  pin: string;
};

export type RFState = {
  run: boolean;
  thingsToDoAfterRun: boolean;
  compile: boolean;
  setState: (key: string, value: boolean) => void;
  setRun: (value: boolean) => void;
  reRun: boolean;
  nodes: Node<NodeData>[];
  Rnodes: Node<NodeData>[];
  onNodesChange: OnNodesChange;
  getNextNodeId: () => string;
  edges: Edge[];
  Redges: Edge[];
  getPins: () => any;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, key: string, value: any) => void;
};

const useStore = create(
  subscribeWithSelector<RFState>((set, get) => ({
    run: false,
    thingsToDoAfterRun: false,
    compile: false,
    setState: (key: string, value: boolean) => {
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
        if (node.type == "Input") inputs.push(node.data);
        if (node.type == "Output") outputs.push(node.data);
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
            Number(node.id != "Phase" && node.id != "Null" ? node.id : "0")
          )
        ) + 1
      );
    },
    Rnodes: [],
    Redges: [],
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
      console.log("updatenodeData");
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
const bfs = useStore.subscribe(
  (state) => ({
    run: state.run,
    //  edges: state.edges,
    nodes: state.nodes,
  }),
  (
    {
      run,
      // edges,
      nodes,
    },
    prev
  ) => {
    let mark: string[] = [];
    const edges = useStore.getState().edges;
    console.log("prev", prev.nodes, nodes);
    const bfs = async (node: Node, depth: number) => {
      return new Promise(async (resolve, reject) => {
        let result = false;
        const sources: (Node | any)[] = [];
        for (let i = 0; i < edges.length; i++) {
          const edge = edges[i];
          if (edge.target == node?.id)
            sources.push(nodes?.find((i) => i.id == edge.source) ?? {});
        }
        for (let i = 0; i < sources.length; i++) {
          const source = sources[i];
          console.log("sag2", depth, node?.id, node?.data.pin, source);
          result = result || (await bfs(source, depth + 1)) ? true : false;
        }

        if (node?.type == "Output") {
          // const isMarked = mark.findIndex((i) => node.id == i) > -1;

          // if (!isMarked) {
          const nodeIndex = nodes.findIndex((i) => i.id == node.id);
          nodes[nodeIndex].data.state = result;
          // mark.push(node.id);
          // }
        }
        console.log("sag", depth, node?.id, node?.data.pin, result);
        if (node?.id == "Phase") {
          resolve(true);
        }
        if (node?.type == "Input") {
          resolve(result && node.data.state);
        }
        resolve(result);
      });
    };
    const handleCalc = async () => {
      mark = [];
      await bfs(
        // @ts-ignore
        nodes.find((i) => i.id == "Null"),
        0
      );
      useStore.setState((state) => ({
        reRun: false,
        nodes: nodes.map((node) => ({
          ...node,
        })),
      }));
    };
    if (run) {
      console.log("bfs1", nodes);

      console.log("bfs2 things done", useStore.getState().reRun);
      if (useStore.getState().reRun) {
        console.log("bfs3 beginBFS");
        useStore.setState((state) => ({
          reRun: false,
        }));
        handleCalc();
      }
      if (!useStore.getState().thingsToDoAfterRun) {
        useStore.setState((state) => ({
          thingsToDoAfterRun: true,
          nodes: state.nodes.map((node) => ({
            ...node,
            draggable: false,
            connectable: false,
          })),
        }));
      }
    }
    if (!run) {
      if (useStore.getState().thingsToDoAfterRun) {
        console.log("bfs4 things reset");
        useStore.setState((state) => ({
          thingsToDoAfterRun: false,
          nodes: state.nodes.map((node) => ({
            ...node,
            draggable: true,
            connectable: true,
          })),
        }));
      }
    }
    // useStore.setState((state) => ({
    //   Rnodes: state.nodes.map((node) => ({
    //     ...node,
    //     draggable: false,
    //   })),
    // }));
  },
  {
    equalityFn: shallow,
  }
);
useStore.subscribe(
  (state) => [state.reRun],
  (state) => {
    console.log("reRun", state);
    // useStore.setState((state) => ({
    //   Rnodes: state.nodes,
    // }));
  },
  {
    equalityFn: shallow,
  }
);
useStore.subscribe((state) => {
  // console.log("state"/, state);
  // useStore.setState((state) => ({
  //   Rnodes: state.nodes,
  // }));
});
export default useStore;
