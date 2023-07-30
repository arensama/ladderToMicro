import { useEffect, useState } from "react";
import { IJson2SemiLogicResult, useJson2SemiLogic } from "./useJson2SemiLogic";
import useStoreDiagram from "../storage/useStoreDiagram";
import { shallow } from "zustand/shallow";
import useStoreFiles from "../storage/useStoreFiles";
export const useSemiLogic2Cpp = () => {
  const { json2semiLogic } = useJson2SemiLogic();
  const [BeforeNodes, BeforeEdges, getPins] = useStoreDiagram(
    (state) => [state.nodes, state.edges, state.getPins],
    shallow
  );
  const [logic_c, logic_h, main_c, setStoreFiles] = useStoreFiles(
    (state) => [state.logic_c, state.logic_h, state.main_c, state.setState],
    shallow
  );
  const outpins = (semiLogic: IJson2SemiLogicResult) => {
    let stm32 = "";
    let logic = "int ";
    let structLogic = "int ";
    let stm32InStruct = "";
    let instance = "";
    let outStruct = "";
    getPins().outputs.map((data: any, index: number) => {
      stm32InStruct += `          HAL_GPIO_WritePin(GPIOA, ${
        data.pin
      }, RNoutputInstance.${data.name.toUpperCase()});\n`;
      stm32 += `${index !== 0 ? " | " : ""}${data.pin}`;
      logic += `${index !== 0 ? " , " : ""}${data.name}=0`;
      structLogic += `${index !== 0 ? " , " : ""}${data.name.toUpperCase()}`;
      outStruct += `${index !== 0 ? " , " : ""}${data.name}`;
      instance += `${index !== 0 ? " , " : ""}0`;
    });
    logic += ";";
    structLogic += ";";

    return { stm32, logic, structLogic, outStruct, stm32InStruct, instance };
  };
  const inpins = (semiLogic: IJson2SemiLogicResult) => {
    let stm32 = "";
    let stm32InStruct = "";
    let logic = "int ";
    let structLogic = "int ";
    let instance = "";
    getPins().inputs.map((data: any, index: number) => {
      stm32InStruct += `${index !== 0 ? " , " : ""}HAL_GPIO_ReadPin(GPIOA,${
        data.pin
      })`;
      stm32 += `${index !== 0 ? " | " : ""}${data.pin}`;
      logic += `${index !== 0 ? " , " : ""}${data.name}=0`;
      structLogic += `${index !== 0 ? " , " : ""}${data.name.toUpperCase()}`;
      instance += `${index !== 0 ? " , " : ""}0`;
    });
    logic += ";\n       ";
    logic += "  int ";
    const newNodes = semiLogic.newNodes;
    for (let i = 0; i < newNodes.length; i++) {
      const newNode = newNodes[i];
      logic += `${i !== 0 ? " , " : ""}${newNode}=0`;
    }
    logic += ";";
    structLogic += ";";
    return { stm32, logic, structLogic, stm32InStruct, instance };
  };
  const assembleLogic_cNh = (
    semiLogic: IJson2SemiLogicResult
  ): Promise<{ c: string; h: string; globalDefinition: string }> => {
    return new Promise(async (resolve, reject) => {
      let inpinsRES = inpins(semiLogic);
      let outpinsRES = outpins(semiLogic);
      let file_c = `
      struct RNinputs {
         ${inpinsRES.structLogic}
      };
      struct RNoutputs {
         ${outpinsRES.structLogic}
      };
      struct RNoutputs logic(struct RNinputs IN) {
         ${inpinsRES.logic}
         ${outpinsRES.logic}
${semiLogic?.result}
         struct RNoutputs OUT ={${outpinsRES.outStruct}};
         return OUT;
      }`;

      let file_h = `
      #ifndef LOGIC_H
      #define LOGIC_H

      struct RNinputs {
         ${inpinsRES.structLogic}
      };
      struct RNoutputs {
         ${outpinsRES.structLogic}
      };
      struct RNoutputs logic(struct RNinputs IN);

      #endif /* LOGIC_H */
      `;
      let globalDefinition = `
      struct RNinputs RNinputInstance={
         ${inpinsRES.instance}
      };
      struct RNoutputs RNoutputInstance={
         ${outpinsRES.instance}
      };`;
      resolve({ c: file_c, h: file_h, globalDefinition });
    });
  };
  const assembleMain_c = (
    semiLogic: IJson2SemiLogicResult,
    globalDefinition: string
  ): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      let inpinsRES = inpins(semiLogic);
      let outpinsRES = outpins(semiLogic);
      let file_c = `
      #include "stm32f1xx_hal.h" 
      #include "logic.h"
      ${globalDefinition}
      int main(void) 
      { 
        HAL_Init(); 
         
        // Enable GPIOA clock 
        __HAL_RCC_GPIOA_CLK_ENABLE(); 
         
        // Configure Pins as input 
        GPIO_InitTypeDef GPIO_InitStruct = {0}; 
        GPIO_InitStruct.Pin = ${inpinsRES.stm32}; 
        GPIO_InitStruct.Mode = GPIO_MODE_INPUT; 
        GPIO_InitStruct.Pull = GPIO_PULLDOWN; 
        HAL_GPIO_Init(GPIOA, &GPIO_InitStruct); 
         
        // Configure Pins as output 
        GPIO_InitStruct.Pin = ${outpinsRES.stm32}; 
        GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP; 
        GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW; 
        HAL_GPIO_Init(GPIOA, &GPIO_InitStruct); 
       
        while (1) 
        { 
          RNinputInstance = (struct RNinputs){${inpinsRES.stm32InStruct}};
          RNoutputInstance = (struct RNoutputs)logic(RNinputInstance);
${outpinsRES.stm32InStruct}
        } 
      }
  
      `;
      resolve(file_c);
    });
  };
  const startProcess = async () => {
    // clear states
    setStoreFiles([
      {
        key: "main_c",
        value: "",
      },
      {
        key: "logic_h",
        value: "",
      },
      {
        key: "logic_c",
        value: "",
      },
    ]);
    // translation
    let semiLogic = await json2semiLogic(BeforeNodes, BeforeEdges);
    let logics = await assembleLogic_cNh(semiLogic);
    let main = await assembleMain_c(semiLogic, logics.globalDefinition);
    // saving result
    setStoreFiles([
      {
        key: "main_c",
        value: main,
      },
      {
        key: "logic_h",
        value: logics.h,
      },
      {
        key: "logic_c",
        value: logics.c,
      },
    ]);
  };
  return {
    startProcess,
  };
};
