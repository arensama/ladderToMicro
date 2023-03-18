import { Button, Col, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { shallow } from "zustand/shallow";
import useStore from "../ladder/state";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Ladder2Logic = () => {
  const [logicalCode, setLogicalCode] = useState("");
  let mark: string[] = [];
  console.log("mark", mark);
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
    return new Promise(async (resolve, reject) => {
      let result = `${""}`;
      const sources: (Node | any)[] = [];
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge.target == node?.id)
          sources.push(nodes?.find((i) => i.id == edge.source) ?? {});
      }
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        result += `${i != 0 ? " || " : ""}${await bfs(source)}`;
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
          setLogicalCode(
            (prev) =>
              prev +
              `HAL_GPIO_WritePin (GPIOA, ${node?.data?.pin}, ${result});
        `
          );
          mark.push(node.id);
        }
      }
      resolve(
        node?.type == "Input"
          ? `HAL_GPIO_ReadPin(GPIOA, ${node?.data?.pin})${
              result != "" ? ` && (${result})` : ""
            }`
          : `${result}`
      );
    });
  };
  const handleCalc = async () => {
    mark = [];
    setLogicalCode("");
    await bfs(nodes.find((i) => i.id == "Null"));
  };

  const outpins = () => {
    let res = "";
    getPins().outputs.map((pin: string, index: number) => {
      res += `${index != 0 ? " | " : ""}${pin}`;
    });
    return res;
  };
  const inpins = () => {
    let res = "";
    getPins().inputs.map((pin: string, index: number) => {
      res += `${index != 0 ? " | " : ""}${pin}`;
    });
    return res;
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
              ${logicalCode}
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
          HAL_GPIO_WritePin(GPIOA, ${outpins()}, GPIO_PIN_RESET);
          GPIO_InitStruct.Pin = ${inpins()};
          GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
          GPIO_InitStruct.Pull = GPIO_PULLUP;
          HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
        
          GPIO_InitStruct.Pin = ${outpins()};
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
    </Modal>
  );
};
export default Ladder2Logic;
