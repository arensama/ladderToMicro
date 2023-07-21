import { Col, Modal, Row } from "antd";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useSemiLogic2Cpp } from "../../hooks/useSemiLogic2Cpp";
import useStoreDigram, { RFState } from "../../storage/useStoreDigram";
import { shallow } from "zustand/shallow";
import useStoreGlobalData from "../../storage/useStoreGlobalData";
import { useEffect } from "react";
import useStoreFiles from "../../storage/useStoreFiles";

const Compiler = () => {
  const { startProcess } = useSemiLogic2Cpp();
  const [logic_c, logic_h, main_c, setStoreFiles] = useStoreFiles(
    (state) => [state.logic_c, state.logic_h, state.main_c, state.setState],
    shallow
  );
  const [modal, setGlobalData] = useStoreGlobalData(
    (state) => [state.modal, state.setState],
    shallow
  );
  useEffect(() => {
    if (modal === "compile") startProcess();
  }, [modal]);
  return (
    <Modal
      open={modal === "compile"}
      onCancel={() => setGlobalData("modal", "")}
      width={"100%"}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          LOGIC
          <SyntaxHighlighter language="cpp" style={materialDark}>
            {logic_c}
          </SyntaxHighlighter>
        </Col>
        <Col span={24}>
          STM32
          <SyntaxHighlighter language="cpp" style={materialDark}>
            {main_c}
          </SyntaxHighlighter>
        </Col>
      </Row>
    </Modal>
  );
};
export default Compiler;
