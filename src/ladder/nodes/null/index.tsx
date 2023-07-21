import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import useStoreDigram, { NodeData } from "../../../storage/useStoreDigram";

function NullNode({ id, data }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        // backgroundColor: "rgb(58, 136, 254)",
        backgroundColor: "black",
        height: 100,
        width: 2,
      }}
    >
      <Handle type="target" position={Position.Left} />
      {/* <p style={{ color: "white" }}>Null</p> */}
    </div>
  );
}

export default NullNode;
