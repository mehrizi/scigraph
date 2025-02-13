import { Helpers } from "@/classes/Helpers";
import { helpers } from "../../classes/helpers";
import { AppDataSource } from "../Db";
import { GraphNode } from "../GraphNode";

export const run = async () => {
  console.log("Running seed: Positioning");
  const startTime = new Date().getTime();
  await Helpers.sleep(2000);
  console.log("Done Positioning! Took "+(
    (new Date().getTime() - startTime
  )/1000+"s"  ));
};

async function positionNode(currentNode: GraphNode) {
  const rr = 15;
  let count = await GraphNode.count({
    where: { parent: { id: currentNode.id } },
  });

  let nodes = await GraphNode.find({
    // take: 10000,
    where: { parent: { id: currentNode.id } },
  });
  const increaseDegree = (2 * 3.14) / count;
  for (let i = 0; i < nodes.length; i++) {
    if (i > 100) {
      return;
    }
    const node = nodes[i];
    const r = (4 / currentNode.level) * Math.max(0.3, Math.random());
    node.x = currentNode.x + r * rr * Math.sin(i * increaseDegree);
    node.y = currentNode.y + r * rr * Math.cos(i * increaseDegree);
    node.color = Helpers.hexToInt(
      Helpers.lighten(currentNode.color, 100 / count)
    );
    // node.y = Math.floor(i / 8) * 100;
    await node.save();
    if (node.level < 4) await positionNode(node);
    // console.log(2222, nodes[i]);
    // positionNode(nodes[i], i);
  }

  //   console.log(234, nodes);
  return;
}

async function positionNodes() {
  const distinctColorsAsInts = [
    0xff0000, // Red
    0x00ff00, // Green
    0x0000ff, // Blue
    0xffff00, // Yellow
    0xff00ff, // Magenta
    0x00ffff, // Cyan
    0xff8000, // Orange
    0x8000ff, // Purple
  ];
  let nodes = await GraphNode.find({
    where: { level: 1 },
  });

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.x = (i % 3) * 200;
    node.y = Math.floor(i / 3) * 200;
    node.color = distinctColorsAsInts[i % distinctColorsAsInts.length];
    node.save();
    // console.log(2222, nodes[i]);
    await positionNode(nodes[i]);
  }

  return;
}
