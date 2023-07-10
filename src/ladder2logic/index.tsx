import { Button, Col, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore from "../ladder/state";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useLogic } from "./logic";

const Ladder2Logic = () => {
  const [locialCode, setLogicalCode] = useState<{
    result: string;
    newNodes: string[];
  }>({
    result: "",
    newNodes: [],
  });
  const [finalStruct, setFinalStruct] = useState("");
  const [stm32Code, setstm32Code] = useState("");
  const { handle } = useLogic();
  const [BeforeNodes, BeforeEdges, compile, setState, getPins] = useStore(
    (state) => [
      state.nodes,
      state.edges,
      state.compile,
      state.setState,
      state.getPins,
    ],
    shallow
  );

  const handleCalc = async () => {
    setstm32Code("");
    setLogicalCode({
      result: "",
      newNodes: [],
    });
    setFinalStruct("");
    let res = await handle(BeforeNodes, BeforeEdges);
    setLogicalCode({
      result: res?.result ?? "",
      newNodes: res?.newNodes ?? [],
    });
  };

  const outpins = () => {
    let stm32 = "";
    let logic = "int ";
    let structLogic = "int ";
    let stm32InStruct = "";
    let outStruct = "";
    getPins().outputs.map((data: any, index: number) => {
      stm32InStruct += `        HAL_GPIO_WritePin(GPIOA, ${
        data.pin
      }, o.${data.name.toUpperCase()});\n`;
      stm32 += `${index != 0 ? " | " : ""}${data.pin}`;
      logic += `${index != 0 ? " , " : ""}${data.name}=0`;
      structLogic += `${index != 0 ? " , " : ""}${data.name.toUpperCase()}`;
      outStruct += `${index != 0 ? " , " : ""}${data.name}`;
    });
    logic += ";";
    structLogic += ";";

    return { stm32, logic, structLogic, outStruct, stm32InStruct };
  };
  const inpins = () => {
    let stm32 = "";
    let stm32InStruct = "";
    let logic = "int ";
    let structLogic = "int ";
    getPins().inputs.map((data: any, index: number) => {
      stm32InStruct += `${index != 0 ? " , " : ""}HAL_GPIO_ReadPin(GPIOA,${
        data.pin
      })`;
      stm32 += `${index != 0 ? " | " : ""}${data.pin}`;
      logic += `${index != 0 ? " , " : ""}${data.name}=0`;
      structLogic += `${index != 0 ? " , " : ""}${data.name.toUpperCase()}`;
    });
    logic += ";\n       ";
    logic += "int ";
    const newNodes = locialCode.newNodes;
    for (let i = 0; i < newNodes.length; i++) {
      const newNode = newNodes[i];
      logic += `${i != 0 ? " , " : ""}${newNode}=0`;
    }
    logic += ";";
    structLogic += ";";
    return { stm32, logic, structLogic, stm32InStruct };
  };
  useEffect(() => {
    if (compile) handleCalc();
  }, [compile]);
  useEffect(() => {
    if (locialCode?.result && locialCode?.result != "")
      setFinalStruct(`
    struct inputs {
       ${inpins().structLogic}
    };
    struct outputs {
       ${outpins().structLogic}
    };
    struct outputs logic(struct inputs IN) {
       ${inpins().logic}
       ${outpins().logic}
${locialCode?.result}
       struct outputs OUT ={${outpins().outStruct}};
       return OUT;
    }`);
  }, [locialCode]);
  useEffect(() => {
    if (finalStruct)
      setstm32Code(`
    #include "stm32f1xx_hal.h" 
    ${finalStruct}
    int main(void) 
    { 
      HAL_Init(); 
       
      // Enable GPIOA clock 
      __HAL_RCC_GPIOA_CLK_ENABLE(); 
       
      // Configure Pins as input 
      GPIO_InitTypeDef GPIO_InitStruct = {0}; 
      GPIO_InitStruct.Pin = ${inpins().stm32}; 
      GPIO_InitStruct.Mode = GPIO_MODE_INPUT; 
      GPIO_InitStruct.Pull = GPIO_PULLDOWN; 
      HAL_GPIO_Init(GPIOA, &GPIO_InitStruct); 
       
      // Configure Pins as output 
      GPIO_InitStruct.Pin = ${outpins().stm32}; 
      GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP; 
      GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW; 
      HAL_GPIO_Init(GPIOA, &GPIO_InitStruct); 
     
      while (1) 
      { 
        struct inputs in = {${inpins().stm32InStruct}};
        struct outputs o = logic(in);
${outpins().stm32InStruct}
      } 
    }

    `);
  }, [finalStruct, handleCalc]);

  return (
    <Modal
      open={compile}
      onCancel={() => setState("compile", false)}
      width={"100%"}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          LOGIC
          <SyntaxHighlighter language="cpp" style={materialDark}>
            {finalStruct}
          </SyntaxHighlighter>
        </Col>
        <Col span={24}>
          STM32
          <SyntaxHighlighter language="cpp" style={materialDark}>
            {stm32Code}
          </SyntaxHighlighter>
        </Col>
      </Row>
    </Modal>
  );
};
export default Ladder2Logic;
