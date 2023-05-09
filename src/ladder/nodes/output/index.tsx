import { Col, Input, Row, Typography } from "antd";
import React, { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore, { NodeData } from "../../state";
const { Title, Text } = Typography;

function OutputNode({
  id,
  data: { name, state, pin },
  isConnectable,
}: NodeProps<NodeData>) {
  const [nodes, updateNodeData, run] = useStore(
    (state) => [state.nodes, state.updateNodeData, state.run],
    shallow
  );
  const [isChanging, setIsChanging] = useState("");

  return (
    <div
      style={{
        // backgroundColor: "#4FD1C5",
        // borderRadius: 10,
        // padding: 8,
        width: 50,
        paddingBottom: 20,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Row gutter={[4, 4]}>
        <Col span={24}>
          {isChanging == "pin" && !run ? (
            <Input
              defaultValue={pin}
              placeholder="Pin"
              size="small"
              onBlur={(event) => {
                updateNodeData(id, "pin", event.target.value);
                setIsChanging("");
              }}
            />
          ) : (
            <Text
              onDoubleClick={() => setIsChanging("pin")}
              style={{ fontSize: 8 }}
            >
              {pin ?? "untitled"}
            </Text>
          )}
        </Col>
        <Col span={24}>
          {isChanging == "name" ? (
            <Input
              defaultValue={name}
              placeholder="Name"
              size="small"
              onBlur={(event) => {
                updateNodeData(id, "name", event.target.value);
                setIsChanging("");
              }}
            />
          ) : (
            <Text onDoubleClick={() => setIsChanging("name")}>
              {name ?? "untitled"}
            </Text>
          )}
        </Col>
        <Col span={24} style={{ paddingBottom: 7 }}>
          <Text>--( )--</Text>
        </Col>
        <Col span={24}>
          {state ? (
            <span style={{ color: "green" }}>on</span>
          ) : (
            <span style={{ color: "red" }}>off</span>
          )}
        </Col>
      </Row>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default OutputNode;
