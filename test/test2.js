const nodes = [
  {
    id: "7",
    type: "Input",
    data: {
      pin: "GPIO_PIN_7",
      name: "in4",
    },
    position: {
      x: 220.33213870887823,
      y: -100,
    },
    width: 50,
    height: 115,
    selected: false,
    positionAbsolute: {
      x: 220.33213870887823,
      y: -100,
    },
    dragging: false,
  },
  {
    id: "Phase",
    type: "Phase",
    data: {
      state: true,
      pin: "1",
      name: "1",
    },
    position: {
      x: 0,
      y: 0,
    },
    draggable: false,
    width: 2,
    height: 100,
  },
  {
    id: "Null",
    type: "Null",
    data: {
      pin: "0",
      name: "0",
    },
    position: {
      x: 1000,
      y: 0,
    },
    width: 2,
    height: 100,
  },
  {
    id: "1",
    type: "Input",
    data: {
      pin: "GPIO_PIN_4",
      name: "in1",
    },
    position: {
      x: 50,
      y: 13,
    },
    width: 50,
    height: 115,
  },
  {
    id: "2",
    type: "Input",
    data: {
      pin: "GPIO_PIN_6",
      name: "in2",
    },
    position: {
      x: 50,
      y: 100,
    },
    width: 50,
    height: 115,
  },
  {
    id: "3",
    type: "Input",
    data: {
      pin: "GPIO_PIN_5",
      name: "in3",
    },
    position: {
      x: 250,
      y: 13,
    },
    width: 50,
    height: 115,
    selected: false,
    dragging: false,
  },
  {
    id: "4",
    type: "Output",
    data: {
      state: false,
      pin: "GPIO_PIN_1",
      name: "out1",
    },
    position: {
      x: 150,
      y: 13,
    },
    width: 50,
    height: 116,
  },
  {
    id: "5",
    type: "Output",
    data: {
      state: false,
      pin: "GPIO_PIN_2",
      name: "out2",
    },
    position: {
      x: 450,
      y: 13,
    },
    width: 50,
    height: 116,
    selected: false,
    dragging: false,
  },
  {
    id: "6",
    type: "Output",
    data: {
      state: false,
      pin: "GPIO_PIN_3",
      name: "out3",
    },
    position: {
      x: 450,
      y: 100,
    },
    width: 50,
    height: 116,
  },
];
const edges = [
  {
    id: "Phase-1",
    source: "Phase",
    target: "1",
    type: "step",
    selected: false,
  },
  {
    id: "Phase-2",
    source: "Phase",
    target: "2",
    type: "step",
    selected: false,
  },
  {
    id: "1-4",
    source: "1",
    target: "4",
    type: "step",
    selected: false,
  },
  {
    id: "2-4",
    source: "2",
    target: "4",
    type: "step",
    selected: false,
  },
  {
    id: "4-3",
    source: "4",
    target: "3",
    type: "step",
    selected: false,
  },
  {
    id: "3-5",
    source: "3",
    target: "5",
    type: "step",
    selected: false,
  },
  {
    id: "3-6",
    source: "3",
    target: "6",
    type: "step",
    selected: false,
  },
  {
    id: "6-Null",
    source: "6",
    target: "Null",
    type: "step",
    selected: false,
  },
  {
    id: "5-Null",
    source: "5",
    target: "Null",
    type: "step",
    selected: false,
  },
  {
    source: "Phase",
    sourceHandle: null,
    target: "7",
    targetHandle: null,
    type: "step",
    id: "reactflow__edge-Phase-7",
    selected: false,
  },
  {
    source: "7",
    sourceHandle: null,
    target: "5",
    targetHandle: null,
    type: "step",
    id: "reactflow__edge-7-5",
    selected: false,
  },
];

const matrix2graph = (nodes, edges) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let sources = edges.filter((i) => i.target === node.id);
    // console.log(node.id, sources);
    node.sources = sources.map((item) => item.source);
    nodes[i] = node;
  }
  return nodes;
};
const graphExtender = (graph) => {
  const reverseGraph = {};
  const result = {};
  for (let i = 0; i < graph.length; i++) {
    const node = graph[i];
    const sources = node.sources;
    let previouslyAssigned = null;
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (Object.hasOwnProperty.call(reverseGraph, source)) {
        previouslyAssigned = reverseGraph[source];
      }
    }
    result[`${node.id}`] = {
      ...node,

      sources: [],
    };
    if (previouslyAssigned) {
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        reverseGraph[source] = previouslyAssigned;
      }
      result[`${node.id}`].sources = [previouslyAssigned];
      result[previouslyAssigned].sources = [
        ...new Set([...result[previouslyAssigned].sources, ...sources]),
      ];
    } else {
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        reverseGraph[source] = `${node.id}_edge`;
      }
      result[`${node.id}`].sources = [`${node.id}_edge`];
      result[`${node.id}_edge`] = {
        ...{ pin: `${node.id}_edge`, name: `${node.id}_edge` },
        sources: sources,
      };
    }
  }
  return result;
};

let graphBeforeExtention = matrix2graph(nodes, edges);
let graph = graphExtender(graphBeforeExtention);
let mark = [];
let logical = "";
const bfs = (node, graph) => {
  return new Promise(async (resolve, reject) => {
    let logic = "";

    let sources = node.sources;
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      logic += `${i !== 0 ? " | " : ""}${await bfs(graph[source], graph)}`;
    }
    const isMarked = mark.findIndex((i) => node.id === i) > -1;
    if (!isMarked && node.id !== "Phase" && node.id !== "Null") {
      let s = `       ${node?.data?.name} =( ${
        node.type === "Input" ? `IN.${node?.data?.name.toUpperCase()} & ` : ``
      }`;
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        s += `${i !== 0 ? ` |` : ``} ${source}`;
      }
      s += ");\n";
      mark.push(node.id);
      logical += s;
    }
    resolve(
      node?.type === "Input"
        ? `${node?.data?.name} ${logic !== "" ? ` & ( ${logic})` : ""}`
        : `${logic}`
    );
  });
};
const a = async () => {
  let res = await bfs(graph["Null"], graph);
};
a();
