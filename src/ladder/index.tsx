import React from "react";
import ReactFlow, { Background, Controls, MiniMap, NodeTypes } from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import InputNode from "./nodes/input";
import useStore, { RFState } from "./state";
import PhaseNode from "./nodes/phase";
import NullNode from "./nodes/null";
import OutputNode from "./nodes/output";
import { Col, Row, Switch } from "antd";
import Navbar from "./navbar";

const nodeTypes: NodeTypes = {
  Input: InputNode,
  Output: OutputNode,
  Phase: PhaseNode,
  Null: NullNode,
};

const selector = (state: RFState) => ({
  setRun: state.setRun,
  run: state.run,
  nodes: state.nodes,
  edges: state.edges,
  Rnodes: state.Rnodes,
  Redges: state.Redges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function Flow() {
  const {
    setRun,
    run,
    nodes,
    Rnodes,
    edges,
    Redges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);
  // console.log(nodes);
  return (
    <ReactFlow
      nodes={!run ? nodes : Rnodes}
      edges={!run ? edges : Redges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Navbar />
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return String(n.style.background);
          if (n.type === "Input") return "#0041d0";
          if (n.type === "Output") return "#ff0072";
          if (n.type === "default") return "#1a192b";

          return "#eee";
        }}
        nodeColor={(n) => {
          if (n.style?.background) return String(n.style.background);

          return "#fff";
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
}

export default Flow;
