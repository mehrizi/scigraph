export default class Benchmark {
  protected static instance: Benchmark;
  static getInstance(): Benchmark {
    if (!Benchmark.instance) {
      Benchmark.instance = new Benchmark();
      return Benchmark.instance;
    }
    return Benchmark.instance;
  }
  protected events: BenchmarkEvent[] = [];
  protected logToConsole: boolean = true;

  protected constructor() {
    this.addEventStart("Start");
  }

  addEventStart(title: string) {
    const lastEvent = this.events[this.events.length - 1];
    const milis = Date.now();
    this.events.push({ title, milis });

    if (this.events.length > 2 && this.logToConsole && this.events.length > 1) {
      console.log(
        `[${((milis - lastEvent.milis) / 1000).toFixed(1)}s] ${
          lastEvent.title
        } finished`
      );
    }
  }

  getElapsed(): number {
    return Date.now() - this.events[0].milis;
  }

  reset() {
    if (this.logToConsole) {
      const lastEvent = this.events[this.events.length - 1];
      const milis = Date.now();
      console.log(
        `[${((milis - lastEvent.milis) / 1000).toFixed(1)}s] ${
          lastEvent.title
        } finished`
      );
      console.log(`----- Benchmark Reset ------`);
    }
    this.events = [];
    this.addEventStart("Start");
  }
}

export type BenchmarkEvent = {
  title: string;
  milis: number;
};
