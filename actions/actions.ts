"use server";

import { In, IsNull, MoreThan } from "typeorm";
import Db from "../models/Db";
import { GraphNode } from "../models/GraphNode";
import { helpers } from "../components/helpers";
import { GraphEdge } from "../models/GraphEdge";

export type clientEdge = {
  key: string;
  source: string;
  target: string;
  attributes: any;
};
export async function getNodes() {
  await Db.getInstance();

  const items = await GraphNode.find({
    relations: ["parent"],
    where: {
      size: MoreThan(0),
      //   parent: { id: In([1, IsNull()]) },
    },
  });

  const edges: any = [];
  //   console.log(items);
  //   return {nodes:[]};
  items.map((item) => {
    if (!item.parent) return;
    edges.push({
      key: `${item.id}-${item.parent.id}`,
      source: item.parent.id,
      target: item.id,
      attributes: {
        size: 1,
      },
    });
  });
  //   console.log(items);

  return {
    nodes: items.map((item) => {
      return {
        key: item.id.toString(),
        attributes: {
          x: item.x,
          y: item.y,
          //   x: item.id * 2,
          //   y: item.id * 2,
          size: Math.ceil(item.size / 300), //Math.min(Math.ceil(item.size / 300), 20),
          label: item.name,
          color: helpers.intToHex(item.color),
        },
      };
    }),
    edges,
  };
}
export async function getPositionedNodes() {
  await Db.getInstance();
  let allNodes: GraphNode[] = [];
  let alledges: clientEdge[] = [];

  const items = await GraphNode.find({
    // relations: ["parent"],
    where: {
      level: 1,
    },
  });

  for (let i = 0; i < items.length; i++) {
    await positionLevelOneNode(items[i], i, allNodes, alledges);
  }
  // const edges: clientEdge[] = [];
  //   console.log(items);
  //   return {nodes:[]};
  // items.map((item) => {
  //   if (!item.parent) return;
  //   edges.push({
  //     key: `${item.id}-${item.parent.id}`,
  //     source: item.parent.id,
  //     target: item.id,
  //     attributes: {
  //       size: 1,
  //     },
  //   });
  // });
  //   console.log(items);

  return {
    nodes: allNodes.map((item) => {
      return {
        key: item.id.toString(),
        attributes: {
          x: item.x,
          y: item.y,
          //   x: item.id * 2,
          //   y: item.id * 2,
          size: Math.min(Math.ceil(item.size / 300), 10),
          label: item.name,
          color: item.color,
        },
      };
    }),
    edges: alledges,
  };
}

export async function positionNode(
  currentNode: GraphNode,
  parentNode: GraphNode,
  count: number,
  index: number,
  allNodes: GraphNode[],
  allEdges: clientEdge[]
) {
  const rr = 5;

  const increaseDegree = (2 * 3.14) / count;
  const r =
    (4 / currentNode.level) *
    (currentNode.level == 2
      ? 5
      : currentNode.level == 3
      ? 2 + 0.5 * Math.random()
      : 0.5 + 2 * Math.random());
  currentNode.x = parentNode.x + r * rr * Math.sin(index * increaseDegree);
  currentNode.y = parentNode.y + r * rr * Math.cos(index * increaseDegree);
  currentNode.color = helpers.colorSpin(
    parentNode.color,
    25 * Math.cos(index * increaseDegree)
    // ((3 * Math.random() + 1) * (25 * index)) / count
  );
  allNodes.push(currentNode);
  allEdges.push({
    key: `${currentNode.id}-${parentNode.id}`,
    source: parentNode.id.toString(),
    target: currentNode.id.toString(),
    attributes: {
      size: 0.4 / currentNode.level,
      color: helpers.darken(
        parentNode.color,
        25 * Math.cos(index * increaseDegree)
      ), // helpers.lighten(parentNode.color, 20),
    },
  });

  if (currentNode.level < 4) {
    const children = await GraphNode.find({
      where: { parent: { id: currentNode.id } },
    });
    for (let i = 0; i < children.length; i++) {
      await positionNode(
        children[i],
        currentNode,
        children.length,
        i,
        allNodes,
        allEdges
      );
    }
  }
  // console.log(2222, nodes[i]);
  // positionNode(nodes[i], i);
}

export async function positionLevelOneNode(
  currentNode: GraphNode,
  index: number,
  allNodes: GraphNode[],
  allEdges: clientEdge[]
) {
  const distinctColorsAsInts = [
    "#ff0000", // Red
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
    "#ff8000", // Orange
    "#8000ff", // Purple
  ];

  currentNode.x = (index % 3) * 200;
  currentNode.y = Math.floor(index / 3) * 200;
  currentNode.color = distinctColorsAsInts[index % distinctColorsAsInts.length];
  allNodes.push(currentNode);
  const children = await GraphNode.find({
    where: { parent: { id: currentNode.id } },
  });
  for (let i = 0; i < children.length; i++) {
    await positionNode(
      children[i],
      currentNode,
      children.length,
      i,
      allNodes,
      allEdges
    );
  }
  return;

  // currentNode.save();
  // console.log(2222, nodes[i]);
  // await positionNode(nodes[i]);
}
