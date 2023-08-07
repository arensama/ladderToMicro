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
    let debuggingNodes: Node<NodeData>[] = nodes;
    for (let i = 0; i < debuggingNodes.length; i++) {
      let node = debuggingNodes[i];
      if (node.type === "Input") {
        const addressInt = parseInt(address.input, 16);
        node.data.address = address.input;
        adrs.input.push(address.input);
        const nextAddress = (addressInt + 4)
          .toString(16)
          .padStart(address.output.length - 2, "0");
        address.input = "0x" + nextAddress;
      } else if (node.type === "Output") {
        const addressInt = parseInt(address.output, 16);
        node.data.address = address.output;
        adrs.output.push(address.output);
        const nextAddress = (addressInt + 4)
          .toString(16)
          .padStart(address.output.length - 2, "0");

        address.output = "0x" + nextAddress;
      }
      debuggingNodes[i] = node;
    }
    setAddresses(adrs);
    console.log("nodes modified", debuggingNodes);
    setMultiState([
      {
        key: "nodes",
        value: [...debuggingNodes],
      },
    ]);
  };
  const fetchDataFromMemory = () => {
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
  const updateNodes = (data: { adr: string; val: string }[],nodes:Node[]) => {
    console.log("sss nodes", nodes);
    console.log("sss data", data);
    const newNodeData = nodes;
    for (let i = 0; i < newNodeData.length; i++) {
      const node = newNodeData[i];
      if (node?.data?.address) {
        const newData = data.find(
          (i) =>
            parseInt(i.adr, 16) ===
            parseInt(node?.data?.address ?? "0x000000", 16)
        );
        console.log("newDAta1 ", newData);

        if (newData)
          node.data.state = newData.val[newData.val.length - 1] === "1";
      }

      newNodeData[i] = node;
    }
    console.log("sss newdata", newNodeData);
    setMultiState([
      {
        key: "nodes",
        value: [...newNodeData],
      },
    ]);
  };

  return { createDebuggingDiagramData, fetchDataFromMemory, updateNodes };
};
