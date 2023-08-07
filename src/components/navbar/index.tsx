import { Button, Card, Col, Row, Switch } from "antd";
import { shallow } from "zustand/shallow";
import useStoreDiagram, { IStoreDiagram } from "../../storage/useStoreDiagram";
import useStoreGlobalData from "../../storage/useStoreGlobalData";
import SaveCCode from "../saveCCode";
import ReadMapFile from "../readMapFile";
import Debugger from "../debugger";

const Navbar = () => {
  const [debugging, setDebugging, onNodesChange, getNextNodeData] =
    useStoreDiagram(
      (state: IStoreDiagram) => [
        state.debugging,
        state.setDebugging,
        state.onNodesChange,
        state.getNextNodeData,
      ],
      shallow
    );
  const [compilerModal, mapModal, setGlobalData] = useStoreGlobalData(
    (state) => [state.compilerModal, state.mapModal, state.setState],
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
                          id: getNextNodeData("Input").id,
                          type: "Input",
                          data: {pin: getNextNodeData("Input").pin,name: getNextNodeData("Input").name,},
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
                          id: getNextNodeData("Output").id,
                          type: "Output",
                          data: { state: false ,pin: getNextNodeData("Output").pin,name: getNextNodeData("Output").name,},
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
          <Col>
            <Row>
              <Col span={24}>Debug</Col>
              <Col span={24}>
                <Switch
                  checked={debugging}
                  onChange={(event) => setDebugging(event)}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              {/* <Col span={24}>Compile</Col> */}
              <Col span={24}>
                <Button
                  onClick={() =>
                    setGlobalData([
                      {
                        key: "compilerModal",
                        value: true,
                      },
                    ])
                  }
                >
                  Compile
                </Button>
                {/* <Switch
                  checked={compilerModal}
                  onChange={(event) =>
                    setGlobalData([
                      {
                        key: "compilerModal",
                        value: event,
                      },
                    ])
                  }
                /> */}
              </Col>
            </Row>
          </Col>
          {/* <Col>
            <Row>
              <Col span={24}>Debug</Col>
              <Col span={24}>
                <Switch
                  checked={}
                  onChange={
                    (event) => {}
                    // setGlobalData("modal", event === true ? "debug" : "")
                  }
                />
              </Col>
            </Row>
          </Col> */}
          <Col>
            <SaveCCode />
          </Col>
          <Col>
            <ReadMapFile />
          </Col>
          <Col>
            <Debugger />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default Navbar;
