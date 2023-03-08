import { Button, Card, Col, Row, Switch } from "antd";
import { shallow } from "zustand/shallow";
import useStore, { RFState } from "../state";

const Navbar = () => {
  const [setRun, onNodesChange] = useStore(
    (state: RFState) => [state.setRun, state.onNodesChange],
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
        >
          <Col>
            <Row>
              <Col>
                <Button
                  onClick={() =>
                    onNodesChange([
                      {
                        type: "add",
                        item: {
                          id: "4",
                          type: "Output",
                          data: { state: false },
                          position: { x: 450, y: 0 },
                        },
                      },
                    ])
                  }
                >
                  +
                </Button>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col span={24}>Run</Col>
              <Col span={24}>
                <Switch onChange={(event) => setRun(event)} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default Navbar;
