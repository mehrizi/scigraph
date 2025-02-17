import Graph from "graphology";
import { Helpers } from "./Helpers";

export default class PhysicsPositioning {
  private graph: Graph;
  private SPRING_CONSTANT = 0.1;
  private REPULSION_CONSTANT = 500;
  private DAMPING = 0.9;
  private IDEAL_EDGE_LENGTH = 25;
  private ITERATIONS = 20;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  private distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  private applyForces() {
    const forces: Record<string, { fx: number; fy: number }> = {};
    this.graph.forEachNode((key, node) => {
      forces[key] = { fx: 0, fy: 0 };
    });

    // Apply edge (spring) forces
    this.graph.forEachEdge((edgeKey, edgeAttr, sourceKey, targetKey) => {
      const source = this.graph.getNodeAttributes(sourceKey);
      const target = this.graph.getNodeAttributes(targetKey);
      const edgeSize = edgeAttr.size;

      let dx = target.x - source.x;
      let dy = target.y - source.y;
      let dist = this.distance(source.x, source.y, target.x, target.y);
      let targetDist = this.IDEAL_EDGE_LENGTH / edgeSize;
      let force = this.SPRING_CONSTANT * (dist - targetDist);

      if (dist > 0) {
        let fx = force * (dx / dist);
        let fy = force * (dy / dist);

        forces[sourceKey].fx += fx;
        forces[sourceKey].fy += fy;
        forces[targetKey].fx -= fx;
        forces[targetKey].fy -= fy;
      }
    });

    // Apply repulsion forces
    this.graph.forEachNode((keyA, nodeA) => {
      this.graph.forEachNode((keyB, nodeB) => {
        if (keyA !== keyB) {
          let dx = nodeB.x - nodeA.x;
          let dy = nodeB.y - nodeA.y;
          let dist = this.distance(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
          let minDist = nodeA.size + nodeB.size;

          if (dist > 0 && dist < minDist) {
            let force = this.REPULSION_CONSTANT / (dist * dist);
            let fx = force * (dx / dist);
            let fy = force * (dy / dist);

            forces[keyA].fx -= fx;
            forces[keyA].fy -= fy;
            forces[keyB].fx += fx;
            forces[keyB].fy += fy;
          }
        }
      });
    });

    return forces;
  }

  private updatePositions(forces: Record<string, { fx: number; fy: number }>) {
    this.graph.forEachNode((key, node) => {
      let { fx, fy } = forces[key];
      let vx = fx * this.DAMPING;
      let vy = fy * this.DAMPING;

      this.graph.setNodeAttribute(key, "x", node.x + vx);
      this.graph.setNodeAttribute(key, "y", node.y + vy);
    });
  }

  public runSimulation() {
    for (let i = 0; i < this.ITERATIONS; i++) {
      const forces = this.applyForces();
      this.updatePositions(forces);
    }
  }
}
