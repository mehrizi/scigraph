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

  static adjustColor(color: string | number, percent: number): string | number {
    // Convert to hex if number
    const isNumber = typeof color === "number";
    const hex = isNumber ? helpers.intToHex(color as number) : (color as string);

    // Convert to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Convert percent to decimal
    const amount = percent / 100;

    // Adjust each channel
    r = Math.min(255, Math.max(0, Math.round(r + r * amount)));
    g = Math.min(255, Math.max(0, Math.round(g + g * amount)));
    b = Math.min(255, Math.max(0, Math.round(b + b * amount)));

    // Convert back to hex
    const resultHex =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");

    // Return in the same format as input
    return isNumber ? helpers.hexToInt(resultHex) : resultHex.toUpperCase();
  }

  static lighten(color: string | number, percent: number): string | number {
    return helpers.adjustColor(color, Math.abs(percent));
  }

  static darken(color: string | number, percent: number): string | number {
    return helpers.adjustColor(color, -Math.abs(percent));
  }
}
