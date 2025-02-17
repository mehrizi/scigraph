"use client";
import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import PhysicsPositioning from "@/classes/PhysicsPositioning";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import NoverlapLayout from "graphology-layout-noverlap/worker";
import circular from "graphology-layout/circular";
import random from "graphology-layout/random";
import circlepack from "graphology-layout/circlepack";
import ForceSupervisor from "graphology-layout-force/worker";

type SigmaGraphProps = {
  data: any; // Replace 'any' with the appropriate type of your graph data
};

export type AlgorithTypes = "noverlap" | "fa2" | "force";
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
  graph.import(data);

  const [algorithm, setAlgorithm] = useState<AlgorithTypes>("noverlap");
  const [noverlapLayout, setNoverlapLayout] = useState<NoverlapLayout | null>(
    null
  );
  const [fa2Layout, setFa2Layout] = useState<FA2Layout | null>(null);
  const [forceLayout, setForceLayout] = useState<FA2Layout | null>(null);
  const [layout, setLayout] = useState(null);
  const [running, setRunning] = useState(false);
  const [renderer, setRenderer] = useState<Sigma | null>(null);

  // const positions = forceAtlas2(graph, {iterations: 50});

  // var renderer: Sigma | null = null;
  // var layout: FA2Layout | null = null;
  useEffect(() => {
    if (!containerRef.current) return;

    // random.assign(graph);
    // circlepack.assign(graph);
    // circular.assign(graph);

    const l1 = new NoverlapLayout(graph);
    setNoverlapLayout(l1);

    const l2 = new FA2Layout(graph, {
      settings: {
        gravity: 10,
        adjustSizes: true,
        scalingRatio: 0.5,
      },
    });
    setFa2Layout(l2);

    const l3 = new ForceSupervisor(graph);
    setForceLayout(l3);

    // // To start the layout
    // l.start();

    // graph.
    const rendererInstance = new Sigma(graph, containerRef.current, {
      maxCameraRatio: 1,
    });

    setRenderer(rendererInstance);

    // rendererInstance.({ worker: true, barnesHutOptimize: true });

    const handleHover = (node?: string) => {
      if (node) {
        // console.log(graph.neighbors(node));

        setHoveredNode(node);
        setHoveredNeighbors(new Set(graph.neighbors(node)));
      } else {
        setHoveredNode(undefined);
        setHoveredNeighbors(undefined);
      }
      rendererInstance?.refresh({ skipIndexation: true });
    };

    // console.log(1111, );
    rendererInstance.getCamera().addListener("updated", function (o) {
      if (o.ratio < 1) return false;
      console.log(o);
      // rendererInstance?.refresh({ skipIndexation: true });
    });

    rendererInstance.on("enterNode", (props) => {
      // Get all edges connected to this node
      const connectedEdges = graph.edges().filter((edge) => {
        const [source, target] = graph.extremities(edge);
        return source === props.node || target === props.node;
      });

      // Highlight these edges by setting an attribute
      connectedEdges.forEach((edge) => {
        graph.setEdgeAttribute(
          edge,
          "old_color",
          graph.getEdgeAttribute(edge, "color")
        );
        graph.setEdgeAttribute(edge, "color", "#ff0000");
      });

      graph.neighbors(props.node).forEach((n) => {
        graph.setNodeAttribute(n, "highlighted", true);
      });
      // handleHover(node)
      // node.
      // graph.edge();
      // graph.neighbors(props.node).forEach((n) => {
      //   graph.setNodeAttribute(n, "highlighted", true);
      // });
      console.log(props);
    });
    rendererInstance.on("leaveNode", (props) => {
      const connectedEdges = graph.edges().filter((edge) => {
        const [source, target] = graph.extremities(edge);
        return source === props.node || target === props.node;
      });

      // Highlight these edges by setting an attribute
      connectedEdges.forEach((edge) => {
        // graph.setEdgeAttribute(edge, "highlighted", false);
        // Optionally set other attributes like color
        graph.setEdgeAttribute(
          edge,
          "color",
          graph.getEdgeAttribute(edge, "old_color")
        );
      });

      graph.neighbors(props.node).forEach((n) => {
        graph.setNodeAttribute(n, "highlighted", false);
      });
    });

    // rendererInstance.setSetting("nodeReducer", (node, data) => {
    //   // if (hoveredNode) console.log(hoveredNode);
    //   // console.log(node);

    //   const res: Partial<any> = { ...data };
    //   if (
    //     hoveredNeighbors &&
    //     !hoveredNeighbors.has(node) &&
    //     hoveredNode !== node
    //   ) {
    //     res.label = "";
    //     res.color = "#f6f6f6";
    //   }
    //   if (selectedNode === node) {
    //     console.log(hoveredNode);
    //     res.highlighted = true;
    //   } else if (suggestions && !suggestions.has(node)) {
    //     res.label = "";
    //     res.color = "#f6f6f6";
    //   }
    //   return res;
    // });

    rendererInstance.setSetting("edgeReducer", (edge, data) => {
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
      rendererInstance && rendererInstance.kill();
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

  const toggleStart = () => {
    setRunning(!running);
    if (algorithm == "fa2" && fa2Layout) {
      if (running) fa2Layout.stop();
      else fa2Layout.start();
    }
    if (algorithm == "noverlap" && noverlapLayout) {
      if (running) noverlapLayout.stop();
      else noverlapLayout.start();
    }
    if (algorithm == "force" && forceLayout) {
      if (running) forceLayout.stop();
      else forceLayout.start();
    }
  };
  return (
    <div>
      <div className="fixed top-1-left-1 z-50">
        {renderer && (
          <button
            className="py-2 px-3 border border-gray-400 m-2"
            onClick={() => {
              console.log(graph);

              const obj = new PhysicsPositioning(graph);
              obj.runSimulation();
              renderer?.refresh();
            }}
          >
            Change
          </button>
        )}
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value={"fa2"}>FA2</option>
          <option value={"noverlap"}>Noverlap</option>
          <option value={"force"}>force</option>
        </select>

        {running && (
          <button
            className="py-2 px-3 border border-gray-400 m-2"
            onClick={toggleStart}
          >
            Stop
          </button>
        )}
        {!running && (
          <button
            className="py-2 px-3 border border-gray-400 m-2"
            onClick={toggleStart}
          >
            start
          </button>
        )}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
          value={searchQuery}
        />
      </div>
      <div
        ref={containerRef}
        className="fixed z-10"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
