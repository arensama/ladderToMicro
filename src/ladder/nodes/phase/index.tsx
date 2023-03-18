import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import useStore, { NodeData } from "../../state";

function PhaseNode({ id, data }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        backgroundColor: "black",
        // backgroundColor: "rgb(255, 98, 81)",

        height: 100,
        width: 2,
      }}
    >
      {/* <p style={{ color: "white" }}>Phase</p> */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default PhaseNode;
