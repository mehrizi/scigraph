import { DataSource } from "typeorm";
import { Book } from "./Book";
import { Node } from "./Node";
import { Vertice } from "./Vertice";
// import * as dotenv from 'dotenv';
import "reflect-metadata";

// dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Book, Node, Vertice],
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
  protected constructor() {}

  private async initialize() {
    try {
      await AppDataSource.initialize();
      console.log("Connection established successfully.");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
    }
  }

}
