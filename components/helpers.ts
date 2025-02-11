import tinycolor from "tinycolor2";

export class helpers {
  static hexToInt(hex: string): number {
    // Remove # if present
    const cleanHex = hex.replace("#", "");

    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      throw new Error("Invalid hex color format");
    }

    return parseInt(cleanHex, 16);
  }

  static intToHex(int: number): string {
    // Validate range
    if (int < 0 || int > 0xffffff) {
      throw new Error("Color value out of range");
    }

    return `#${int.toString(16).padStart(6, "0").toUpperCase()}`;
  }

  static lighten(color: string | number, percent: number): string  {
    if (typeof color === "number") {
      color = helpers.intToHex(color);
    }

    const colorObj = tinycolor(color);

    return colorObj.lighten(percent).toString();
  }
  static colorSpin(color: string | number, percent: number): string  {
    if (typeof color === "number") {
      color = helpers.intToHex(color);
    }

    const colorObj = tinycolor(color);
    return colorObj.spin(percent).toString();
  }

  static darken(color: string | number, percent: number): string  {
    if (typeof color === "number") {
      color = helpers.intToHex(color);
    }

    const colorObj = tinycolor(color);

    return colorObj.darken(percent).toString();
  }
}
