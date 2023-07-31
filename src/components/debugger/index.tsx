import { Button, Col, Modal, Row } from "antd";
import useStoreDiagram from "../../storage/useStoreDiagram";
import { shallow } from "zustand/shallow";
import useStoreGlobalData from "../../storage/useStoreGlobalData";
import { useMap2Json } from "../../hooks/useMap2Json";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";

const Debugger = () => {
  // const [modal, setGlobalData] = useStoreGlobalData(
  //   (state) => [state.modal, state.setState],
  //   shallow
  // );
  const [debugging] = useStoreDiagram((state) => [state.debugging], shallow);
  const { createDebuggingDiagramData, fetchDataFromMemory, updateNodes } =
    useMap2Json();
  const { IO, emit } = useSocket();
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (debugging) {
      console.log("dbg start");
      createDebuggingDiagramData();
    }
  }, [debugging]);
  useEffect(() => {
    IO.on("memoryValues", function (data) {
      console.log("memoryValues : ", data);
      updateNodes(data);
    });
    return () => {
      IO.off("memoryValues");
    };
  }, []);
  useEffect(() => {
    let intervalId = setInterval(function () {
      if (fetching) fetchDataFromMemory();
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetching]);
  return (
    <div>
      <Button
        style={{ background: fetching ? "#41fa41" : "" }}
        onClick={() => setFetching((prev) => !prev)}
      >
        toggle fetch Data From Memory
      </Button>
    </div>
  );
};
export default Debugger;
