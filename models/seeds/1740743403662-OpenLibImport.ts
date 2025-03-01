import { OpenLibrary } from "@/classes/OpenLibrary";
import Db, { AppDataSource } from "../Db";

export const run = async () => {
  console.log("Running seed: OpenLibImport");
  const startTime = new Date().getTime();
  const openLibrary = new OpenLibrary();
    const db = await Db.getInstance();
    await db.clean('books');
    await db.clean('books_subjects_subject');
    await db.clean('subject_relation');
    await db.clean('subject_relation_subject1_subject');
    await db.clean('subject_relation_subject2_subject');
    await db.clean('subject');
    // return;

  
    await openLibrary.parseBooks(100, 100); // Start parsing books
  // await YourMethod()
  console.log("Done OpenLibImport Took "+(
    (new Date().getTime() - startTime
  )/1000+"s"  ));
};