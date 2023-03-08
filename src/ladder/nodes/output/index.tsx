import { Col, Input, Row, Typography } from "antd";
import React, { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore, { NodeData } from "../../state";
const { Title, Text } = Typography;

function OutputNode({ id, data: { name, state } }: NodeProps<NodeData>) {
  const [nodes, updateNodeData] = useStore(
    (state) => [state.nodes, state.updateNodeData],
    shallow
  );
  const [isChanging, setIsChanging] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#4FD1C5",
        borderRadius: 10,
        padding: 8,
        width: 150,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Row gutter={[4, 4]}>
        <Col span={24}>
          {isChanging ? (
            <Input
              defaultValue={name}
              placeholder="Name"
              size="small"
              onBlur={(event) => {
                updateNodeData(id, "name", event.target.value);
                setIsChanging(false);
              }}
            />
          ) : (
            <Text onDoubleClick={() => setIsChanging(true)}>
              {name ?? "untitled"}
            </Text>
          )}
        </Col>
        <Col span={24}>
          <Text>--( )--</Text>
        </Col>
        <Col span={24}>state : {state ? "on" : "off"}</Col>
      </Row>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default OutputNode;
