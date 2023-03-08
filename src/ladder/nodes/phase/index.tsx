import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import useStore, { NodeData } from "../../state";

function PhaseNode({ id, data }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        backgroundColor: "rgb(255, 98, 81)",
        borderRadius: 5,
        height: 100,
        width: 40,
        padding: 10,
      }}
    >
      <p style={{ color: "white" }}>Phase</p>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default PhaseNode;
