import { Button, Card, Col, Row, Switch } from "antd";
import { shallow } from "zustand/shallow";
import useStoreDigram, { RFState } from "../../storage/useStoreDigram";
import useStoreGlobalData from "../../storage/useStoreGlobalData";
import Saver from "../saver";

const Navbar = () => {
  const [setRun, onNodesChange, getNextNodeId] = useStoreDigram(
    (state: RFState) => [
      state.setRun,
      state.onNodesChange,
      state.getNextNodeId,
    ],
    shallow
  );
  const [modal, setGlobalData] = useStoreGlobalData(
    (state) => [state.modal, state.setState],
    shallow
  );
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        zIndex: 10,
        position: "absolute",
        top: 0,
        width: "100%",
      }}
    >
      <Card
        style={{
          margin: 10,
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          width: "100%",
        }}
      >
        <Row
          style={{
            padding: 10,
          }}
          align="middle"
        >
          <Col>
            <Row gutter={[16, 16]}>
              <Col>
                <Button
                  onClick={() =>
                    onNodesChange([
                      {
                        type: "add",
                        item: {
                          id: getNextNodeId(),
                          type: "Input",
                          data: {},
                          position: { x: 0, y: -100 },
                        },
                      },
                    ])
                  }
                >
                  --[/ ]--
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    onNodesChange([
                      {
                        type: "add",
                        item: {
                          id: getNextNodeId(),
                          type: "Output",
                          data: { state: false },
                          position: { x: 0, y: -100 },
                        },
                      },
                    ])
                  }
                >
                  --( )--
                </Button>
              </Col>
            </Row>
          </Col>
          {/* <Col>
            <Row>
              <Col span={24}>Run</Col>
              <Col span={24}>
                <Switch onChange={(event) => setRun(event)} />
              </Col>
            </Row>
          </Col> */}
          <Col>
            <Row>
              <Col span={24}>Compile</Col>
              <Col span={24}>
                <Switch
                  checked={modal === "compile"}
                  onChange={(event) =>
                    setGlobalData("modal", event === true ? "compile" : "")
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col span={24}>Debug</Col>
              <Col span={24}>
                <Switch
                  checked={modal === "debug"}
                  onChange={(event) =>
                    setGlobalData("modal", event === true ? "debug" : "")
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Saver />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default Navbar;