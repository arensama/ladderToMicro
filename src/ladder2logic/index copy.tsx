import { Button, Col, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore from "../ladder/state";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
interface IBFS {
  stm32: string;
  logic: string;
}
const Ladder2Logic = () => {
  const [locialCode, setLogicalCode] = useState("");
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

  const bfs = async (node?: Node) => {
    return new Promise<IBFS>(async (resolve, reject) => {
      let stm32 = `${""}`;
      let logic = `${""}`;
      const sources: (Node | any)[] = [];
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge.target == node?.id)
          sources.push(nodes?.find((i) => i.id == edge.source) ?? {});
      }
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        stm32 += `${i != 0 ? " || " : ""}${(await bfs(source)).stm32}`;
        logic += `${i != 0 ? " || " : ""}${(await bfs(source)).logic}`;
      }

      if (node?.type == "Output") {
        const isMarked = mark.findIndex((i) => node.id == i) > -1;
        console.log(
          "log",
          mark,
          isMarked,
          node.id,
          mark.findIndex((i) => node.id)
        );
        if (!isMarked) {
          setstm32Code(
            (prev) =>
              prev +
              `                  HAL_GPIO_WritePin (GPIOA, ${node?.data?.pin}, ${stm32});\n`
          );
          setLogicalCode(
            (prev) =>
              prev + `                    ${node?.data?.name}= ${logic};\n`
          );
          mark.push(node.id);
        }
      }
      resolve({
        stm32:
          node?.type == "Input"
            ? `HAL_GPIO_ReadPin(GPIOA, ${node?.data?.pin})${
                stm32 != "" ? ` & (${stm32})` : ""
              }`
            : `${stm32}`,
        logic:
          node?.type == "Input"
            ? `${node?.data?.name} ${logic != "" ? ` & (${logic})` : ""}`
            : `${logic}`,
      });
    });
  };
  const handleCalc = async () => {
    mark = [];
    setstm32Code("");
    setLogicalCode("");
    await bfs(nodes.find((i) => i.id == "Null"));
  };

  const outpins = () => {
    let stm32 = "";
    let logic = "bool ";
    getPins().outputs.map((data: any, index: number) => {
      stm32 += `${index != 0 ? " | " : ""}${data.pin}`;
      logic += `${index != 0 ? " , " : ""}${data.name}=false`;
    });
    logic += ";";

    return { stm32, logic };
  };
  const inpins = () => {
    let stm32 = "";
    let logic = "bool ";
    getPins().inputs.map((data: any, index: number) => {
      stm32 += `${index != 0 ? " | " : ""}${data.pin}`;
      logic += `${index != 0 ? " , " : ""}${data.name}=false`;
    });
    logic += ";";
    return { stm32, logic };
  };
  useEffect(() => {
    if (compile) handleCalc();
  }, [compile]);
  const logic = () => {};

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
            {`
              #include<bits/stdc++.h>
              using namespace std;
              int main(){
                ${outpins().logic}
                ${inpins().logic}
                while (1){
                  
${locialCode}
                }
              }
            `}
          </SyntaxHighlighter>
        </Col>
        <Col span={24}>
          STM32
          <SyntaxHighlighter language="cpp" style={materialDark}>
            {`
        #include "main.h"
        #include <string.h>
        #include <stdlib.h>
        #include <stdio.h>
        #define C1_Pin GPIO_PIN_0
        
        void SystemClock_Config(void);
        static void MX_GPIO_Init(void);
          // HAL_GPIO_WritePin (R2_GPIO_Port, R2_Pin, GPIO_PIN_SET);  // Pull the R2 High
          
          // if (!(HAL_GPIO_ReadPin (C1_GPIO_Port, C1_Pin)))   // if the Col 1 is low
        int main(void)
        {
          HAL_Init();
          SystemClock_Config();
          MX_GPIO_Init();
           while (1)
            {
${stm32Code}
            }
        }
        void SystemClock_Config(void)
        {
          RCC_OscInitTypeDef RCC_OscInitStruct = {0};
          RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};
          RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
          RCC_OscInitStruct.HSIState = RCC_HSI_ON;
          RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
          RCC_OscInitStruct.PLL.PLLState = RCC_PLL_NONE;
          if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
          {
            Error_Handler();
          }
          RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                                      |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
          RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_HSI;
          RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
          RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV1;
          RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;
          if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_0) != HAL_OK)
          {
            Error_Handler();
          }
        }
        
        static void MX_GPIO_Init(void)
        {
          GPIO_InitTypeDef GPIO_InitStruct = {0};
          __HAL_RCC_GPIOD_CLK_ENABLE();
          __HAL_RCC_GPIOA_CLK_ENABLE();
          HAL_GPIO_WritePin(GPIOA, ${outpins().stm32}, GPIO_PIN_RESET);
          GPIO_InitStruct.Pin = ${inpins().stm32};
          GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
          GPIO_InitStruct.Pull = GPIO_PULLUP;
          HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
        
          GPIO_InitStruct.Pin = ${outpins().stm32};
          GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
          GPIO_InitStruct.Pull = GPIO_NOPULL;
          GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
          HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
        
        }
        
        void Error_Handler(void)
        {
          __disable_irq();
          while (1)
          {
          }
        }
        
        #ifdef  USE_FULL_ASSERT
        void assert_failed(uint8_t *file, uint32_t line)
        {
        }
        #endif
`}
          </SyntaxHighlighter>
        </Col>
      </Row>
    </Modal>
  );
};
export default Ladder2Logic;
