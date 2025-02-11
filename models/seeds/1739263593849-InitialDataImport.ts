import { AppDataSource } from "../Db";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { GraphNode } from "../GraphNode";
import { helpers } from "../../components/helpers";

export const run = async () => {
  console.log("Running seed: InitialDataImportoooooooooooooooooo");

  await AppDataSource.initialize();
  console.log("Running seed: InitialDataImport");
  await parseCsvIntoDb("../../assets/data.csv", 1, 15000);
  // Implement seeding logic here
  await AppDataSource.destroy();
};

async function parseCsvIntoDb(filePath: string, start: number, limit: number) {
  //   return new Promise<void>((resolve, reject) => {
  const stream = createReadStream(filePath).pipe(
    parse({ delimiter: ",", from_line: start, to_line: start + limit })
  );

  const arrayItems = await stream.toArray();
  for (let i = 0; i < arrayItems.length; i++) {
    //   console.log(row);
    //   return;
    const row = arrayItems[i];

    try {
      const [level1, level2, level3, , name, issn1, , , srcid] = row;

      let parentNode = await GraphNode.findOne({
        where: { name: level1, level: 1 },
      });
      if (!parentNode) {
        console.log(`[${i}]Parent not found`, { name: level1, level: 1 });

        parentNode = GraphNode.create({ name: level1, level: 1, size: 1 });
        await parentNode.save();
      }

      //   parentNode.children.

      let childNode = await GraphNode.findOne({
        // relations: ["parent"],
        where: {
          name: level2,
          level: 2,
          // parentId:parentNode.id
        },
      });
      if (!childNode) {
        console.log("Child not found", {
          name: level2,
          level: 2,
          parent: parentNode,
        });
        childNode = GraphNode.create({
          name: level2,
          level: 2,
          size: 0,
          parent: parentNode,
        });
        await childNode.save();
      }
      let childNode2 = await GraphNode.findOne({
        where: { name: level3, level: 3 },
      });
      if (!childNode2) {
        childNode2 = GraphNode.create({
          name: level3,
          level: 3,
          size: 0,
          parent: childNode,
        });
        await childNode2.save();
      }

      let finalNode = await GraphNode.findOne({
        where: { name: name, level: 4 },
      });
      if (!finalNode) {
        finalNode = new GraphNode();
        (finalNode.name = name),
          (finalNode.level = 4),
          (finalNode.size = 1),
          (finalNode.parent = childNode2),
          (finalNode.issn1 = issn1 ? parseInt(issn1) : null),
          (finalNode.srcid = srcid ? parseInt(srcid) : null),
          await finalNode.save();
      }

      // Update parent sizes
      parentNode.size += 1;
      await parentNode.save();
      childNode.size += 1;
      await childNode.save();
      childNode2.size += 1;
      await childNode2.save();
    } catch (error) {
      console.error("Error processing row", row, error);
    }
  }

  // stream.on("end", resolve);
  // stream.on("error", reject);
  //   });
}
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
    node.color = helpers.hexToInt(
      helpers.lighten(currentNode.color, 100 / count)
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
