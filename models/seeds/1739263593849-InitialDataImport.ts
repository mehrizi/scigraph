import Db, { AppDataSource } from "../Db";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { GraphNode } from "../GraphNode";
import { GraphEdge } from "../GraphEdge";
import { Helpers } from "@/classes/Helpers";
import readline from "readline";

export const run = async () => {
  console.log("Running seed: InitialDataImport");
  const startTime = new Date().getTime();
  await parseCsvIntoDb(__dirname + "/data.csv");
  await Helpers.sleep(2000);
  console.log("Done InitialDataImport! Took " + (
    (new Date().getTime() - startTime
    ) / 1000 + "s"));
};

const promptForDelete = async (count: number): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`Are you sure to Delete all ${count} nodes and import again? [Y]es [C]ancel `, (inputName) => {
      rl.close();
      resolve(inputName.trim());
    });
  });
};

async function parseCsvIntoDb(filePath: string) {
  const db = await Db.getInstance();

  // Check if GraphNode table is empty and if not propmt the user to cancle the seed or
  // delete all records
  const count = await GraphNode.count()
  if (count != 0) {
    const answer = await promptForDelete(count);
    if (answer.toLowerCase() == 'y' || answer.toLowerCase() == 'yes') {
      const db = await Db.getInstance();
      await db.clean(); // Get repository
      await db.clean('edges'); // Get repository

    }
    else {
      console.log("Canceling......");
      return;

    }
  }

  //   return new Promise<void>((resolve, reject) => {
  const stream = createReadStream(filePath).pipe(
    // parse({ delimiter: ",", from_line: start, to_line: start + limit })
    parse({ delimiter: "," })
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

        parentNode = GraphNode.create({ name: level1, level: 1, weight: calcNodeWeight(1) });
        await parentNode.save();
      }

      //   parentNode.children.

      let childNode = await GraphNode.findOne({
        // relations: ["parent"],
        where: {
          name: level2,
          level: 2,
          parent: { id: parentNode.id },
        },
      });
      if (!childNode) {
        console.log("Child not found", {
          name: level2,
          level: 2,
        });
        childNode = GraphNode.create({
          name: level2,
          level: 2,
          weight: calcNodeWeight(2),
          parent: parentNode,
        });
        await childNode.save();
        await createEdge(parentNode, childNode)
      }
      let childNode2 = await GraphNode.findOne({
        where: {
          name: level3,
          level: 3,
          parent: { id: childNode.id },
        },
      });

      if (!childNode2) {
        childNode2 = GraphNode.create({
          name: level3,
          level: 3,
          weight: calcNodeWeight(3),
          parent: childNode,
        });
        await childNode2.save();
        await createEdge(childNode, childNode2)
      }

      let finalNode = await GraphNode.findOne({
        where: { name: name, level: 4 ,parent:{id:childNode2.id}},
      });
      if (!finalNode) {
        finalNode = new GraphNode();
        (finalNode.name = name),
          (finalNode.level = 4),
          (finalNode.weight = calcNodeWeight(4)),
          (finalNode.parent = childNode2),
          (finalNode.issn1 = issn1 ? parseInt(issn1) : null),
          (finalNode.srcid = srcid ? parseInt(srcid) : null),
          await finalNode.save();
          await createEdge(childNode2,finalNode)
        }

      // Update parent weights
      parentNode.weight += 1;
      await parentNode.save();
      childNode.weight += 1;
      await childNode.save();
      childNode2.weight += 1;
      await childNode2.save();
      if (i % 100 == 0) console.log(`Item ${finalNode.id} inserted`);
    } catch (error) {
      console.error("Error processing row", row, error);
    }
  }

  // stream.on("end", resolve);
  // stream.on("error", reject);
  //   });
}


async function createEdge(node1: GraphNode, node2: GraphNode) {
  const edge = new GraphEdge()
  edge.node1 = node1.id
  edge.node2 = node2.id
  edge.weight = 1
  await edge.save()

}

function calcNodeWeight(level: number): number {
  switch (level) {
    case 1:
      return 100
    case 2:
      return 50
    case 3:
      return 25
    case 4:
      return 1
    default:
      return 0

  }
}