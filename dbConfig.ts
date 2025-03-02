import fs from "fs";
import path from "path";
import readline from "readline";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { AppDataSource } from "./models/Db";
import { exit } from "process";

const args = process.argv.slice(2);
const options = args.reduce((acc, arg) => {
  const [key, value] = arg.split("=");
  acc[key.replace("--", "")] = value || true;
  return acc;
}, {} as Record<string, string | boolean>);
console.log(options);
exit;
const promptForName = async (): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter the seed name: ", (inputName) => {
      rl.close();
      resolve(inputName.trim());
    });
  });
};

const createSeed = async (name?: string) => {
  if (!name) {
    name = await promptForName();
  }
  const timestamp = Date.now();
  const seedFileName = `${timestamp}-${name}.ts`;
  const seedDir = path.join(__dirname, "models", "seeds");
  const seedFilePath = path.join(seedDir, seedFileName);

  if (!fs.existsSync(seedDir)) {
    fs.mkdirSync(seedDir, { recursive: true });
  }

  const seedTemplate = `import { AppDataSource } from "../Db";

export const run = async () => {
  console.log("Running seed: ${name}");
  const startTime = new Date().getTime();
  // await YourMethod()
  console.log("Done ${name} Took "+(
    (new Date().getTime() - startTime
  )/1000+"s"  ));
};`;

  fs.writeFileSync(seedFilePath, seedTemplate);

  console.log(`Seed file created: ${seedFilePath}`);
};

const runSeed = async (dataSource: DataSource, name?: string) => {
  try {
    // await dataSource.initialize();
    const seedDir = path.join("./", "models", "seeds");
    const seedFiles = fs.readdirSync(seedDir);
    // .find((file) => file.includes(`-${name}.ts`));

    // console.log(path.join(seedDir, file));
    // return;
    const modules = import.meta.glob("./models/seeds/*.ts", { eager: true });
    // console.log(modules);

    let fileNotFound = true;
    for (const modPath in modules) {
      if (name && !modPath.includes(`-${name}.ts`)) continue;

      fileNotFound = false;
      await modules[modPath].run();
    }

    if (fileNotFound) {
      throw new Error("Seed file not found");
    }

    exit();
  } catch (error) {
    console.error("Error running seed:", error);
  } finally {
    await dataSource.destroy();
  }
};

(async () => {
  if (options["create:seed"]) {
    await createSeed(options["name"]);
  }
  if (options["run:seed"]) {
    await runSeed(AppDataSource, options["name"]);
  }
})();
