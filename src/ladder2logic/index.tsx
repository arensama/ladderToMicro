import { Button, Col, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore from "../ladder/state";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Ladder2Logic = () => {
  const [locialCode, setLogicalCode] = useState("");
  const [finalStruct, setFinalStruct] = useState("");
  const [stm32Code, setstm32Code] = useState("");
  let mark: string[] = [];
  // console.log("mark", mark);
  const [nodes, edges, compile, setState, getPins] = useStore(
    (state) => [
      state.nodes,
      state.edges,
      state.compile,
      state.setState,
      state.getPins,
    ],
    shallow
  );

  const bfs = async (node: Node) => {
    return new Promise<string>(async (resolve, reject) => {
      let logic = `${""}`;
      const sources: (Node | any)[] = [];
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge.target == node?.id)
          sources.push(nodes?.find((i) => i.id == edge.source) ?? {});
      }
      let children :string[]= [];
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        logic += `${i != 0 ? " | " : ""}${(await bfs(source))}`;
        
        children.push(source.data.name);
      }
      const isMarked = mark.findIndex((i) => node.id == i) > -1;
      if (!isMarked &&(node.id!="Phase"&& node.id!="Null")) {
        console.log("log2",node.data.name,children)
        let s = `              ${node.data.name} =( ${node.type=="Input"?`IN.${node.data.name.toUpperCase()} & `:``}`;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
            s+= `${i!=0?` |`:``} ${child}`
        }
        s+=');\n';
        mark.push(node.id);
        setLogicalCode(prev=>(prev+s))
      }
      resolve(
          node?.type == "Input"
            ? `${node?.data?.name} ${logic != "" ? ` & ( ${logic})` : ""}`
            : `${logic}`,
      );
    });
  };
  const handleCalc = async () => {
    mark = [];
    setstm32Code("");
    setLogicalCode("");
    setFinalStruct("");
    // @ts-ignore
    await bfs(nodes.find((i) => i.id == "Null"));
  };

  const outpins = () => {
    let stm32 = "";
    let logic = "bool ";
    let structLogic = "bool ";
    let stm32InStruct = "";
    let outStruct = "";
    getPins().outputs.map((data: any, index: number) => {
      stm32InStruct += `        HAL_GPIO_WritePin(GPIOA, ${data.pin}, o.${data.name.toUpperCase()});\n`;
      stm32 += `${index != 0 ? " | " : ""}${data.pin}`;
      logic += `${index != 0 ? " , " : ""}${data.name}=0`;
      structLogic += `${index != 0 ? " , " : ""}${data.name.toUpperCase()}`;
      outStruct += `${index != 0 ? " , " : ""}${data.name}`;
    });
    logic += ";";
    structLogic += ";";

    return { stm32, logic ,structLogic,outStruct,stm32InStruct};
  };
  const inpins = () => {
    let stm32 = "";
    let stm32InStruct = "";
    let logic = "bool ";
    let structLogic = "bool ";
    getPins().inputs.map((data: any, index: number) => {
      stm32InStruct += `${index != 0 ? " , " : ""}HAL_GPIO_ReadPin(GPIOA,${data.pin})`;
      stm32 += `${index != 0 ? " | " : ""}${data.pin}`;
      logic += `${index != 0 ? " , " : ""}${data.name}=0`;
      structLogic += `${index != 0 ? " , " : ""}${data.name.toUpperCase()}`;

    });
    logic += ";";
    structLogic += ";";
    return { stm32, logic,structLogic ,stm32InStruct};
  };
  useEffect(() => {
    if (compile) handleCalc();
  }, [compile]);
  useEffect(() => {
    if (locialCode) setFinalStruct(`
    struct inputs {
       ${inpins().structLogic}
    };
    struct outputs {
       ${outpins().structLogic}
    };
    struct outputs logic(struct inputs IN) {
       ${inpins().logic}
       ${outpins().logic}
${locialCode}
       struct outputs OUT ={${outpins().outStruct}};
       return OUT;
    }`);
  }, [locialCode]);
  useEffect(() => {
    if (finalStruct) setstm32Code(`
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
      GPIO_InitStruct.Pull = GPIO_PULLUP; 
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
  }, [finalStruct]);
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
