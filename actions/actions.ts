"use server";

import { Helpers } from "@/classes/Helpers";
import { ClientEdge, ClientNode, HexColor } from "@/classes/types";
import Db from "@/models/Db";
import { GraphNode } from "@/models/GraphNode";

export async function getPositionedNodes() {
  await Db.getInstance();
  let allNodes: ClientNode[] = [];
  let alledges: ClientEdge[] = [];

  const items = await GraphNode.find({
    where: { level: 1 },
  });

  for (let i = 0; i < items.length; i++) {
    await positionLevelOneNode(items[i], i, allNodes, alledges);
  }

  return {
    nodes: allNodes,
    edges: alledges,
  };
}

export async function positionNode(
  currentNode: GraphNode,
  parentNode: GraphNode,
  parentClientNode: ClientNode,
  count: number,
  index: number,
  allNodes: ClientNode[],
  allEdges: ClientEdge[]
) {
  const increaseDegree = (2 * Math.PI) / count;
  const r = (5 / Math.pow(currentNode.level+1,1.5)) * ( parentNode.weight/100 +(count/100)*Math.random())
  // const r =
  //   (4 / currentNode.level) *
  //   (currentNode.level === 2
  //     ? 2 + 3 * Math.random()
  //     : currentNode.level === 3
  //       ? 1 + 1 * Math.random()
  //       : 0.5 + 2 * Math.random());

  const x = parentClientNode.attributes.x + r * Math.sin(index * increaseDegree);
  const y = parentClientNode.attributes.y + r * Math.cos(index * increaseDegree);
  const color = Helpers.colorSpin(parentClientNode.attributes.color, 5 * Math.cos(index * increaseDegree));

  const node = {
    key: currentNode.id.toString(),
    attributes: {
      x,
      y,
      size: Math.min(Math.ceil(currentNode.weight/ 10), 10),
      label: currentNode.name,
      color,
    },
  }
  allNodes.push(node);

  allEdges.push({
    key: `${currentNode.id}-${parentNode.id}`,
    source: parentNode.id.toString(),
    target: currentNode.id.toString(),
    attributes: {
      size: 4 / currentNode.level,
      color: "#ccc"// Helpers.darken(parentClientNode.attributes.color, 25 * Math.cos(index * increaseDegree)),
    },
  });

  if (currentNode.level < 3) {
    const children = await GraphNode.find({ where: { parent: { id: currentNode.id } } });
    
    for (let i = 0; i < children.length; i++) {
      await positionNode(children[i], currentNode, node, children.length, i, allNodes, allEdges);
    }
  }
}

export async function positionLevelOneNode(
  currentNode: GraphNode,
  index: number,
  allNodes: ClientNode[],
  allEdges: ClientEdge[]
) {
  const distinctColorsAsInts: HexColor[] = [
    "#fea3aa",
    "#f8b88b",
    "#faf884",
    "#baed91",
    "#b2cefe",
    "#f2a2e8",
  ];

  const x = (index % 3) * 200;
  const y = Math.floor(index / 3) * 200;
  const color = distinctColorsAsInts[index % distinctColorsAsInts.length];

  const node = {
    key: currentNode.id.toString(),
    attributes: {
      x,
      y,
      size: Math.min(Math.ceil(currentNode.weight / 300), 20),
      label: currentNode.name,
      color,
    },
  };
  allNodes.push(node);

  const children = await GraphNode.find({ where: { parent: { id: currentNode.id } } });
  for (let i = 0; i < children.length; i++) {
    await positionNode(children[i], currentNode, node, children.length, i, allNodes, allEdges);
  }
}
