import { AppDataSource } from "../Db";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { GraphNode } from "../GraphNode";
import { helpers } from "../../components/helpers";

export const run = async () => {
  // await AppDataSource.initialize();
  console.log("Running seed: InitialDataImport");
  await parseCsvIntoDb(__dirname + "/data.csv", 1, 15000);
  // Implement seeding logic here
  await AppDataSource.destroy();
};

async function parseCsvIntoDb(filePath: string, start: number, limit: number) {
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

        parentNode = GraphNode.create({ name: level1, level: 1, size: 1 });
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
          size: 0,
          parent: parentNode,
        });
        await childNode.save();
      }
      let childNode2 = await GraphNode.findOne({
        where: {
          name: level3,
          level: 3,
          parent: { id: parentNode.id },
        },
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
      if (i % 100 == 0) console.log(`Item ${i} inserted`);
    } catch (error) {
      console.error("Error processing row", row, error);
    }
  }

  // stream.on("end", resolve);
  // stream.on("error", reject);
  //   });
}
