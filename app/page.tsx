import Image from "next/image";
import { getNodes, getPositionedNodes } from "../actions/actions";
import Grapher from "../components/graph/Grapher";
import { parseCsvIntoDb, positionNodes } from "../actions/seed";
import { GraphNode } from "../models/GraphNode";
import Db from "../models/Db";

export default async function Home() {
  const db = await Db.getInstance();

  // const insertedCount = await GraphNode.count();
  // await parseCsvIntoDb(
  //   "assets/data.csv",
  //   Math.max(1, insertedCount - 400),
  //   5000
  // );

  // await positionNodes();

  // const r = await getNodes();
  const r = await getPositionedNodes();

  return (
    <div className="">
      <main className="">
        <Grapher data={r} />
      </main>
    </div>
  );
}
