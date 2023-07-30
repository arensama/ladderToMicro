import { shallow } from "zustand/shallow";
import useStoreFiles from "../storage/useStoreFiles";
import useStoreDiagram, { NodeData } from "../storage/useStoreDiagram";
import { Node } from "reactflow";
import { useState } from "react";
import { useSocket } from "./useSocket";

export const useMap2Json = () => {
  const [inputAddress, outputAddress] = useStoreFiles(
    (state) => [state.inputAddress, state.outputAddress],
    shallow
  );
  const [nodes, edges, setMultiState, getPins] = useStoreDiagram(
    (state) => [state.nodes, state.edges, state.setMultiState, state.getPins],
    shallow
  );
  const { IO, emit } = useSocket();
  const [addresses, setAddresses] = useState<{
    input: string[];
    output: string[];
  }>({
    input: [],
    output: [],
  });
  const createDebuggingDiagramData = () => {
    let address = {
      input: inputAddress,
      output: outputAddress,
    };
    let adrs: {
      input: string[];
      output: string[];
    } = {
      input: [],
      output: [],
    };
    let debuggingNodes: Node<NodeData>[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === "Input") {
        const addressInt = parseInt(address.input, 16);
        debuggingNodes.push({
          ...node,
          data: {
            ...node.data,
            address: address.input,
          },
        });
        adrs.input.push(address.input);
        const nextAddress = (addressInt + 4)
          .toString(16)
          .padStart(address.output.length - 2, "0");

        address.input = "0x" + nextAddress;
      } else if (node.type === "Output") {
        const addressInt = parseInt(address.output, 16);
        debuggingNodes.push({
          ...node,
          data: {
            ...node.data,
            address: address.output,
          },
        });
        adrs.output.push(address.output);
        const nextAddress = (addressInt + 4)
          .toString(16)
          .padStart(address.output.length - 2, "0");

        address.output = "0x" + nextAddress;
      } else {
        debuggingNodes.push({
          ...node,
        });
      }
    }
    setAddresses(adrs);
    return {
      debuggingNodes: nodes,
    };
  };
  const updateNodeDataFromMemory = () => {
    // Generate GDB commands to read each address
    console.log("addresses", addresses);
    const inputCommands = addresses.input.map((addr, index) => {
      return `x /1xw ${addr} `;
    });
    const outputCommands = addresses.output.map((addr, index) => {
      return `x /1xw ${addr} `;
    });
    const commands = [...inputCommands, ...outputCommands];
    // Write commands to a GDB script file
    const script =
      "target extended-remote localhost:4242\n" +
      "monitor reset halt\n" +
      commands.join("\n") +
      "\nquit\n";
    console.log("script", script);
    emit("createMemoryGDB", {
      script,
    });
  };
  const map2json = () => {
    setAddresses({
      input: [],
      output: [],
    });
    console.log("dbg map2json");
    const data = createDebuggingDiagramData();
    // console.log("dbg nodes", debuggerNodes);
    setMultiState([
      {
        key: "debuggerNodes",
        value: data.debuggingNodes,
      },
      {
        key: "debuggerEdges",
        value: [],
      },
    ]);
  };
  return { map2json, updateNodeDataFromMemory };
};
