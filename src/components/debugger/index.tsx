import { Button, Col, Modal, Row } from "antd";
import useStoreDiagram from "../../storage/useStoreDiagram";
import { shallow } from "zustand/shallow";
import useStoreGlobalData from "../../storage/useStoreGlobalData";
import { useMap2Json } from "../../hooks/useMap2Json";
import { useEffect } from "react";

const Debugger = () => {
  // const [modal, setGlobalData] = useStoreGlobalData(
  //   (state) => [state.modal, state.setState],
  //   shallow
  // );
  const [debugging] = useStoreDiagram((state) => [state.debugging], shallow);
  const { map2json, updateNodeDataFromMemory } = useMap2Json();
  useEffect(() => {
    if (debugging) {
      console.log("dbg start");
      map2json();
    }
  }, [debugging]);
  return (
    <div>
      <Button onClick={() => updateNodeDataFromMemory()}>
        updateNodeDataFromMemory
      </Button>
    </div>
  );
};
export default Debugger;
