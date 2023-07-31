import React from "react";
import ReactFlow, { Background, Controls, MiniMap, NodeTypes } from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import InputNode from "./nodes/input";
import useStoreDiagram, { IStoreDiagram } from "../storage/useStoreDiagram";
import PhaseNode from "./nodes/phase";
import NullNode from "./nodes/null";
import OutputNode from "./nodes/output";
import { Col, Row, Switch } from "antd";

const nodeTypes: NodeTypes = {
  Input: InputNode,
  Output: OutputNode,
  Phase: PhaseNode,
  Null: NullNode,
};

const selector = (state: IStoreDiagram) => ({
  setDebugging: state.setDebugging,
  debugging: state.debugging,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function Flow() {
  const {
    setDebugging,
    debugging,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStoreDiagram(selector, shallow);
  // console.log(nodes);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
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
