import React from "react";
import { Edge, MarkerType, Node } from "reactflow";

export const nodes: Node[] = [
  {
    id: "Phase",
    type: "Phase",
    data: { state: true , pin: "1", name: "1" },
    position: { x: 0, y: 0 },
    draggable: false,
  },
  {
    id: "Null",
    type: "Null",
    data: { pin: "0", name: "0" },
    position: { x: 1000, y: 0 },
  },
  {
    id: "1",
    type: "Input",
    data: { pin: "GPIO_PIN_4", name: "in1" },
    position: { x: 50, y: 13 },
  },
  {
    id: "2",
    type: "Input",
    data: { pin: "GPIO_PIN_6", name: "in2" },
    position: { x: 50, y: 100 },
  },
  {
    id: "3",
    type: "Input",
    data: { pin: "GPIO_PIN_5", name: "in3" },
    position: { x: 250, y: 13 },
  },
  {
    id: "4",
    type: "Output",
    data: { state: false, pin: "GPIO_PIN_1", name: "out1" },
    position: { x: 150, y: 13 },
  },
  {
    id: "5",
    type: "Output",
    data: { state: false, pin: "GPIO_PIN_2", name: "out2" },
    position: { x: 450, y: 13 },
  },
  {
    id: "6",
    type: "Output",
    data: { state: false, pin: "GPIO_PIN_3", name: "out3" },
    position: { x: 450, y: 100 },
  },
  {
    id: "7",
    type: "Input",
    data: {
      pin: "GPIO_PIN_7",
      name: "in4",
    },
    position: {
      x: 220.33213870887823,
      y: -100,
    },
    width: 50,
    height: 115,
    selected: false,
    positionAbsolute: {
      x: 220.33213870887823,
      y: -100,
    },
    dragging: false,
  },
];

export const edges: Edge[] = [
  {
    id: "Phase-1",
    source: "Phase",
    target: "1",
    type: "step",
  },
  {
    id: "Phase-2",
    source: "Phase",
    target: "2",
    type: "step",
  },
  {
    id: "1-4",
    source: "1",
    target: "4",
    type: "step",
  },
  {
    id: "2-4",
    source: "2",
    target: "4",
    type: "step",
  },
  {
    id: "4-3",
    source: "4",
    target: "3",
    type: "step",
  },
  {
    id: "3-5",
    source: "3",
    target: "5",
    type: "step",
  },
  {
    id: "3-6",
    source: "3",
    target: "6",
    type: "step",
  },
  {
    id: "6-Null",
    source: "6",
    target: "Null",
    type: "step",
  },
  {
    id: "5-Null",
    source: "5",
    target: "Null",
    type: "step",
  },
  {
    source: "Phase",
    sourceHandle: null,
    target: "7",
    targetHandle: null,
    type: "step",
    id: "reactflow__edge-Phase-7",
    selected: false,
  },
  {
    source: "7",
    sourceHandle: null,
    target: "5",
    targetHandle: null,
    type: "step",
    id: "reactflow__edge-7-5",
    selected: false,
  },
];

export const pins = {
  output: ["GPIO_PIN_4", "GPIO_PIN_5"],
  input: ["GPIO_PIN_1", "GPIO_PIN_2", "GPIO_PIN_3"],
};
