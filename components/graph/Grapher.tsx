"use client";
import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import PhysicsPositioning from "@/classes/PhysicsPositioning";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";

type SigmaGraphProps = {
  data: any; // Replace 'any' with the appropriate type of your graph data
};

export default function Grapher({ data }: SigmaGraphProps): React.ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | undefined>(
    undefined
  );
  const [suggestions, setSuggestions] = useState<Set<string> | undefined>(
    undefined
  );
  const [hoveredNode, setHoveredNode] = useState<string | undefined>(undefined);
  const [hoveredNeighbors, setHoveredNeighbors] = useState<
    Set<string> | undefined
  >(undefined);
  const graph = new Graph();
  const [layout, setLayout] = useState(null);
  const [iterations, setIterations] = useState(0);
  const running = useRef(true);

  // const positions = forceAtlas2(graph, {iterations: 50});

  var renderer: Sigma | null = null;
  // var layout: FA2Layout | null = null;
  useEffect(() => {
    if (!containerRef.current) return;

    graph.import(data);

    // const l = new FA2Layout(graph, {
    //   settings: {
    //     gravity: .5,
    //     adjustSizes: true,
    //   },
    // });
    // setLayout(l);

    // // To start the layout
    // l.start();


    // graph.
    renderer = new Sigma(graph, containerRef.current, {
      maxCameraRatio: 1,
    });

    // renderer.({ worker: true, barnesHutOptimize: true });

    const handleHover = (node?: string) => {
      if (node) {
        setHoveredNode(node);
        setHoveredNeighbors(new Set(graph.neighbors(node)));
      } else {
        setHoveredNode(undefined);
        setHoveredNeighbors(undefined);
      }
      renderer?.refresh({ skipIndexation: true });
    };

    // console.log(1111, );
    renderer.getCamera().addListener("updated", function (o) {
      if (o.ratio < 1) return false;
      console.log(o);
      // renderer?.refresh({ skipIndexation: true });
    });

    renderer.on("enterNode", ({ node }) => handleHover(node));
    renderer.on("leaveNode", () => handleHover(undefined));

    renderer.setSetting("nodeReducer", (node, data) => {
      const res: Partial<any> = { ...data };
      if (
        hoveredNeighbors &&
        !hoveredNeighbors.has(node) &&
        hoveredNode !== node
      ) {
        res.label = "";
        res.color = "#f6f6f6";
      }
      if (selectedNode === node) {
        res.highlighted = true;
      } else if (suggestions && !suggestions.has(node)) {
        res.label = "";
        res.color = "#f6f6f6";
      }
      return res;
    });

    renderer.setSetting("edgeReducer", (edge, data) => {
      const res: Partial<any> = { ...data };
      if (
        hoveredNode &&
        !graph
          .extremities(edge)
          .some((n) => n === hoveredNode || graph.areNeighbors(n, hoveredNode))
      ) {
        res.hidden = true;
      }
      if (
        suggestions &&
        (!suggestions.has(graph.source(edge)) ||
          !suggestions.has(graph.target(edge)))
      ) {
        res.hidden = true;
      }
      return res;
    });

    return () => {
      renderer && renderer.kill();
    };
  }, [data]);

  const handleSearch = (query: string) => {
    graph.addNode("--111---", {
      label: "test",
      size: 10,
      color: "red",
      x: 300,
      y: 300,
    });
    return;

    setSearchQuery(query);
    if (!query) {
      setSelectedNode(undefined);
      setSuggestions(undefined);
      renderer.refresh({ skipIndexation: true });
      return;
    }

    const lcQuery = query.toLowerCase();
    const matches = graph
      .nodes()
      .map((n) => ({ id: n, label: graph.getNodeAttribute(n, "label") }))
      .filter(({ label }) => label.toLowerCase().includes(lcQuery));

    if (matches.length === 1 && matches[0].label === query) {
      setSelectedNode(matches[0].id);
      setSuggestions(undefined);
      const nodePosition = renderer.getNodeDisplayData(matches[0].id) as any;
      renderer.getCamera().animate(nodePosition, { duration: 500 });
    } else {
      setSelectedNode(undefined);
      setSuggestions(new Set(matches.map(({ id }) => id)));
    }
    renderer.refresh({ skipIndexation: true });
  };

  return (
    <div>
      <button
        onClick={() => {
          const obj = new PhysicsPositioning(graph);
          obj.runSimulation();
          renderer?.refresh();
        }}
      >
        Change
      </button>
      <button
        onClick={() => {
          layout.stop();
        }}
      >
        Stop
      </button>
      <button
        onClick={() => {
          layout.start();
        }}
      >
        start
      </button>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        value={searchQuery}
      />
      <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
}
