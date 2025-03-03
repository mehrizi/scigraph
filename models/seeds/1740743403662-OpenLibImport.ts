import { OpenLibrary } from "@/classes/OpenLibrary";
import Db, { AppDataSource } from "../Db";
import { Helpers } from "@/classes/Helpers";

export const run = async () => {
  console.log("Running seed: OpenLibImport");
  const startTime = new Date().getTime();
  const openLibrary = new OpenLibrary();
  const db = await Db.getInstance();

  let cleanDB = await Helpers.prompt("Clean DB? (y/n)");
  if (cleanDB === "y" ){
  await db.clean("books");
  await db.clean("books_subjects_subject");
  await db.clean("subject_relation");
  await db.clean("subject_relation_subject1_subject");
  await db.clean("subject_relation_subject2_subject");
  await db.clean("subject");

  }

  let storedStart = await Helpers.readFileValue("openlib-last-start.txt");
  let start: number = 0;
  if (storedStart) start = parseInt(storedStart);

  for (let i = start; i <= 987654; i++) {
    console.log(`-------- start requesting ${start} ------------`);
    await openLibrary.parseBooks(start, 100); // Start parsing books
    start += 100;
    await Helpers.writeFileValue(
      "openlib-last-start.txt",
      start.toString()
    );
  }

  // await YourMethod()
  console.log(
    "Done OpenLibImport Took " +
      ((new Date().getTime() - startTime) / 1000 + "s")
  );
};
