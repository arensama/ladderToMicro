import React from "react";
import { Edge, MarkerType, Node } from "reactflow";

export const nodes: Node[] = [
  {
    id: "Phase",
    type: "Phase",
    data: {},
    position: { x: 0, y: 0 },
    draggable: false,
  },
  {
    id: "Null",
    type: "Null",
    data: {},
    position: { x: 1000, y: 0 },
  },
  {
    id: "1",
    type: "Input",
    data: {},
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    type: "Output",
    data: { state: false },
    position: { x: 450, y: 0 },
  },
];

export const edges: Edge[] = [
  {
    id: "reactflow__edge-Phase-2",
    source: "Phase",
    target: "1",
  },
  {
    id: "reactflow__edge-1-2",
    source: "1",
    target: "2",
  },
  {
    id: "reactflow__edge-2-Null",
    source: "2",
    target: "Null",
  },
];
