export type HexColor = `#${string}`;

export type ClientEdge = {
  key: string;
  source: string;
  target: string;
  attributes: {
    size: number;
    color: HexColor;
  };
};

export type ClientNode = {
  key: string;
  attributes: {
    x: number;
    y: number;
    size: number;
    label: string;
    color: HexColor;
  };
};

