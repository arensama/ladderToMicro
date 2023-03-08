import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import useStore, { NodeData } from "../../state";

function NullNode({ id, data }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        backgroundColor: "rgb(58, 136, 254)",
        borderRadius: 5,
        height: 100,
        padding: 10,
        width: 40,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <p style={{ color: "white" }}>Null</p>
    </div>
  );
}

export default NullNode;
