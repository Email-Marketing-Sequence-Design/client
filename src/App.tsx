import "@/App.css";
import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { LeadSourceNode } from "@/components/nodes/LeadSourceNode";
import { ColdEmailNode } from "@/components/nodes/ColdEmailNode";
import { WaitDelayNode } from "@/components/nodes/WaitDelayNode";
import { AddNodeButton } from "@/components/nodes/AddNodeButton";
import { NodeSelector } from "@/components/NodeSelector";
import SaveScheduledButton from "./components/SaveScheduledButton";

const nodeTypes = {
  leadSource: LeadSourceNode,
  coldEmail: ColdEmailNode,
  waitDelay: WaitDelayNode,
  addButton: AddNodeButton,
};

function App() {
  const initialNodes: Node[] = [
    {
      id: "lead-source",
      type: "leadSource",
      position: { x: 150, y: 0 },
      data: {
        email: "",
      },
      draggable: false,
      width: 250,
    },
    {
      id: "add-1",
      type: "addButton",
      position: { x: 255, y: 100 },
      draggable: false,
      width: 40,
      height: 40,
      data: { onClick: () => handleAddButtonClick("add-1") },
    },
  ];
  const initialEdges: Edge[] = [
    { id: "e-lead-source-add1", source: "lead-source", target: "add-1" },
  ];
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedAddNodeId, setSelectedAddNodeId] = useState<string | null>(
    null
  );

  console.log("Nodes: ", nodes);
  console.log("Edges: ", edges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const selectedNode = changes.find(
        (change) => change.type === "select" && change.selected === true
      );

      if (
        selectedNode &&
        "id" in selectedNode &&
        selectedNode.id.startsWith("add-")
      ) {
        setSelectedAddNodeId(selectedNode.id);
      } else {
        setSelectedAddNodeId(null);
      }

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const handleAddButtonClick = (nodeId: string) => {
    setSelectedAddNodeId(nodeId);
  };

  const getLastNodeBeforeAddButton = (addButtonId: string): string | undefined => {
    const edge = edges.find(e => e.target === addButtonId);
    if (!edge) return undefined;
    
    const sourceNode = nodes.find(n => n.id === edge.source);
    return sourceNode?.type;
  };

  const handleAddNode = (type: "coldEmail" | "waitDelay") => {
    if (!selectedAddNodeId) return;

    const addButtonNode = nodes.find((n) => n.id === selectedAddNodeId);
    if (!addButtonNode) return;

    const lastNodeType = getLastNodeBeforeAddButton(selectedAddNodeId);

    if (
      (type === "waitDelay" && lastNodeType !== "coldEmail") ||
      (!lastNodeType && type === "waitDelay")
    ) {
      console.log("Invalid node sequence");
      return;
    }

    const newNodeId = `${type}-${Date.now()}`;
    const newAddButtonId = `add-${Date.now()}`;

    const newNode: Node = {
      id: newNodeId,
      type,
      position: {
        x: 150,
        y: addButtonNode.position.y,
      },
      data:
        type === "coldEmail"
          ? {
              subject: "",
              body: "",
            }
          : {
              value: 1,
              unit: "days",
            },
      width: 250,
    };

    const newAddButton: Node = {
      id: newAddButtonId,
      type: "addButton",
      position: {
        x: 255,
        y: addButtonNode.position.y + 100,
      },
      data: {
        onClick: () => handleAddButtonClick(newAddButtonId),
      },
      width: 40,
      height: 40,
    };

    const newEdges: Edge[] = [
      ...edges.filter((e) => e.target !== selectedAddNodeId),
      {
        id: `e-${
          edges.find((e) => e.target === selectedAddNodeId)?.source
        }-${newNodeId}`,
        source: edges.find((e) => e.target === selectedAddNodeId)?.source ?? "",
        target: newNodeId,
      },
      {
        id: `e-${newNodeId}-${newAddButtonId}`,
        source: newNodeId,
        target: newAddButtonId,
      },
    ];

    setNodes((nodes) => [
      ...nodes.filter((n) => n.id !== selectedAddNodeId),
      newNode,
      newAddButton,
    ]);
    setEdges(newEdges);
    setSelectedAddNodeId(null);
  };

  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-[80svw] h-[100svh] border relative">
      <SaveScheduledButton nodes={nodes} edges={edges}/>
        {selectedAddNodeId && (
          <NodeSelector 
            onSelect={handleAddNode}
            lastNodeType={getLastNodeBeforeAddButton(selectedAddNodeId)}
          />
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
