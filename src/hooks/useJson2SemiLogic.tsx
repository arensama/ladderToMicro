import { Edge, Node } from "reactflow";
export interface IGraph extends Node {
  sources: string[];
}

export interface IExtendedGraph extends Node {
  sources: string[];
}

export interface IJson2SemiLogicResult {
  result: string;
  newNodes: string[];
}
export const useJson2SemiLogic = () => {
  let mark: Map<string, string> = new Map();
  const matrix2graph = (nodes: Node[], edges: Edge[]): IGraph[] => {
    let result: IGraph[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let sources = edges
        .filter((i) => i.target === node.id)
        .map((item) => item.source);
      result.push({ ...node, sources });
    }
    return result;
  };
  const graphExtender = (
    graph: IGraph[]
  ): {
    result: Map<string, IExtendedGraph>;
    newNodes: string[];
  } => {
    const reverseGraph: Map<string, string> = new Map();
    const result: Map<string, IExtendedGraph> = new Map();
    let newNodes: string[] = [];
    for (let i = 0; i < graph.length; i++) {
      const node = graph[i];
      const sources = node.sources;
      let previouslyAssigned: string = "";
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const newNode = reverseGraph.get(source);
        if (newNode) {
          previouslyAssigned = newNode;
        }
      }
      result.set(`${node.id}`, {
        ...node,

        sources: [],
      });
      if (previouslyAssigned) {
        // let newSources = [];
        for (let i = 0; i < sources.length; i++) {
          const source = sources[i];
          reverseGraph.set(source, previouslyAssigned);
        }
        let prev = result.get(`${node.id}`);
        if (prev) {
          // let prevAss = result.get(previouslyAssigned);
          let sourceSet = new Set([previouslyAssigned]);
          result.set(`${node.id}`, {
            ...prev,
            sources: Array.from(sourceSet),
          });
        }
      } else {
        for (let i = 0; i < sources.length; i++) {
          const source = sources[i];
          reverseGraph.set(source, `edge_${node.id}`);
        }
        let prev = result.get(`${node.id}`);
        if (prev)
          result.set(`${node.id}`, {
            ...prev,
            sources: [`edge_${node.id}`],
          });
        if (node.id !== "Null" && node.id !== "Phase")
          newNodes.push(`edge_${node.id}`);
        result.set(`edge_${node.id}`, {
          id: `edge_${node.id}`,
          position: { x: 2, y: 3 },
          data: {
            pin: `edge_${node.id}`,
            name: `edge_${node.id}`,
          },
          sources: sources,
        });
      }
    }
    return { result, newNodes };
  };
  const bfs = (node: IExtendedGraph, graph: Map<string, IExtendedGraph>) => {
    return new Promise(async (resolve, reject) => {
      let logic = "";
      let sources = node.sources;
      const isMarked = mark.get(node.id);
      if (isMarked) resolve(isMarked);
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const newNode = graph.get(source);
        if (newNode)
          logic += `${i !== 0 ? " | " : ""}${await bfs(newNode, graph)}`;
      }
      if (!isMarked) {
        if (
          node.id !== "Phase" &&
          node.id !== "edge_Phase" &&
          node.id !== "Null" &&
          node.id !== "edge_Null"
        ) {
          let s = `         ${node?.data?.name}=(${
            node.type === "Input"
              ? `IN.${node?.data?.name.toUpperCase()} & `
              : ``
          }`;
          for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            let newNode = graph.get(source);
            s += `${i !== 0 ? ` |` : ``}${newNode?.data?.name}`;
          }
          s += ");\n";
          mark.set(node.id, s);
        }
      }
      resolve(
        node?.type === "Input"
          ? `${node?.data?.name} ${logic !== "" ? ` & (${logic})` : ""}`
          : `${logic}`
      );
    });
  };
  const json2semiLogic = async (
    nodes: Node[],
    edges: Edge[]
  ): Promise<IJson2SemiLogicResult> => {
    mark = new Map();
    let graphBeforeExtention = matrix2graph(nodes, edges);
    let { result: graph, newNodes } = graphExtender(graphBeforeExtention);
    let nullnode = graph.get("Null");
    if (nullnode) {
      await bfs(nullnode, graph);
      let res = "";
      mark.forEach((value: string, key: string, map: Map<string, string>) => {
        res += value;
      });
      return { result: res ?? "", newNodes };
    } else return { result: "", newNodes: [] };
  };
  return {
    json2semiLogic,
  };
};
