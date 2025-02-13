import { DataSource } from "typeorm";
import { Book } from "./Book";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
// import * as dotenv from 'dotenv';
import "reflect-metadata";

// dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Book, GraphNode, GraphEdge],
  synchronize: true,
});

export default class Db {
  protected static instance: Db;

  static async getInstance(): Promise<Db> {
    if (!Db.instance) {
      Db.instance = new Db();
      await Db.instance.initialize();
      return Db.instance;
    }
    return Db.instance;
  }
  protected constructor() { }

  private async initialize() {
    try {
      await AppDataSource.initialize();
      console.log("Connection established successfully.");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
    }
  }

  public async clean(name = 'nodes') {
    // const repository = AppDataSource.getRepository(name); // Get repository
    await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`)
    await AppDataSource.query(`TRUNCATE ${name};`)
    await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`)

    // await repository.clear(); // Clear each entity table's content

  }
}
