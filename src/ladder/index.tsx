import React from "react";
import ReactFlow, { Background, Controls, MiniMap, NodeTypes } from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import InputNode from "./nodes/input";
import useStoreDigram, { RFState } from "../storage/useStoreDigram";
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

const selector = (state: RFState) => ({
  setDebugging: state.setDebugging,
  debugging: state.debugging,
  nodes: state.nodes,
  edges: state.edges,
  debuggerNodes: state.debuggerNodes,
  debuggerEdges: state.debuggerEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function Flow() {
  const {
    setDebugging,
    debugging,
    nodes,
    debuggerNodes,
    edges,
    debuggerEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStoreDigram(selector, shallow);
  // console.log(nodes);
  return (
    <ReactFlow
      nodes={!debugging ? nodes : debuggerNodes}
      edges={!debugging ? edges : debuggerEdges}
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
