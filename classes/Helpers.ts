import tinycolor from "tinycolor2";
import { HexColor } from "./types";
import * as fs from "fs/promises";
import * as path from "path";

export class Helpers {
  static async sleep(millis: number) {
    // sleep
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

  static hexToInt(hex: string): number {
    // Remove # if present
    const cleanHex = hex.replace("#", "");

    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      throw new Error("Invalid hex color format");
    }

    return parseInt(cleanHex, 16);
  }

  static intToHex(int: number): HexColor {
    // Validate range
    if (int < 0 || int > 0xffffff) {
      throw new Error("Color value out of range");
    }

    return `#${int.toString(16).padStart(6, "0").toUpperCase()}`;
  }

  static lighten(color: string | number, percent: number): HexColor {
    if (typeof color === "number") {
      color = Helpers.intToHex(color);
    }

    const colorObj = tinycolor(color);

    return colorObj.lighten(percent).toString() as HexColor;
  }
  static colorSpin(color: string | number, percent: number): HexColor {
    if (typeof color === "number") {
      color = Helpers.intToHex(color);
    }

    const colorObj = tinycolor(color);
    return colorObj.spin(percent).toString() as HexColor;
  }

  static darken(color: string | number, percent: number): HexColor {
    if (typeof color === "number") {
      color = Helpers.intToHex(color);
    }

    const colorObj = tinycolor(color);

    return colorObj.darken(percent).toString() as HexColor;
  }

  /**
   * Reads the value from a file.
   * @param filePath The path to the file.
   * @returns A promise that resolves to the file content as a string, or `null` if the file does not exist.
   */
  static async readFileValue(filePath: string): Promise<string | null> {
    try {
      const resolvedPath = path.resolve(filePath);
      const content = await fs.readFile(resolvedPath, "utf-8");
      return content;
    } catch (error) {
      return null;

      if (error.code === "ENOENT") {
        // File does not exist
      }
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  /**
   * Writes a value to a file.
   * @param filePath The path to the file.
   * @param value The value to write to the file.
   * @returns A promise that resolves when the write operation is complete.
   */
  static async writeFileValue(filePath: string, value: string): Promise<void> {
    try {
      const resolvedPath = path.resolve(filePath);
      await fs.writeFile(resolvedPath, value, "utf-8");
    } catch (error) {
      throw new Error(`Failed to write to file: ${error.message}`);
    }
  }
}
