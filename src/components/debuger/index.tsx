import { Col, Modal, Row } from "antd";
import useStoreDigram, { RFState } from "../../storage/useStoreDigram";
import { shallow } from "zustand/shallow";
import useStoreGlobalData from "../../storage/useStoreGlobalData";

const Debugger = () => {
  const [modal, setGlobalData] = useStoreGlobalData(
    (state) => [state.modal, state.setState],
    shallow
  );
  return (
    <Modal
      open={modal === "debug"}
      onCancel={() => setGlobalData("modal", "")}
      width={"100%"}
    ></Modal>
  );
};
export default Debugger;
