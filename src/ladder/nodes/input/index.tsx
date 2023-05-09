import { Col, Input, Row, Switch, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Handle, NodeProps, Position, useEdges } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore, { NodeData } from "../../state";
const { Title, Text } = Typography;

function InputNode({
  id,
  data: { name, pin },
  isConnectable,
}: NodeProps<NodeData>) {
  const [run, nodes, updateNodeData] = useStore(
    (state) => [state.run, state.nodes, state.updateNodeData],
    shallow
  );
  const [isChanging, setIsChanging] = useState("");
  return (
    <div
      style={{
        // backgroundColor: "#4FD1C5",
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
          {isChanging == "name" && !run ? (
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
        <Col span={24}>
          <Text>--[/ ]--</Text>
        </Col>
        <Col span={24}>
          <Switch
            onChange={(event) => {
              console.log("event", event, id);
              updateNodeData(id, "state", event);
            }}
          />
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

export default InputNode;
