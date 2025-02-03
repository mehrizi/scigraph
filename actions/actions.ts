"use server";

import { In, IsNull, MoreThan } from "typeorm";
import Db from "../models/Db";
import { GraphNode } from "../models/GraphNode";
import { helpers } from "../components/helpers";

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
          size: Math.ceil(item.size / 300),//Math.min(Math.ceil(item.size / 300), 20),
          label: item.name,
          color: helpers.intToHex(item.color),
        },
      };
    }),
    edges,
  };
}
