import "@/App.css";
import { useCallback } from "react";
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
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { LeadSourceNode } from "@/components/nodes/LeadSourceNode";
import { ColdEmailNode } from "@/components/nodes/ColdEmailNode";
import { WaitDelayNode } from "@/components/nodes/WaitDelayNode";
import { AddNodeButton } from "@/components/nodes/AddNodeButton";
import SaveScheduledButton from "@/components/panels/SaveScheduledButton";
import { toast } from "sonner";
import { AddLeadSourceNode } from "@/components/nodes/AddSourceButton";
import { AddNodesPanel } from "@/components/panels/AddNodesPanel";

const nodeTypes = {
  leadSource: LeadSourceNode,
  coldEmail: ColdEmailNode,
  waitDelay: WaitDelayNode,
  addButton: AddNodeButton,
  addLeadSource: AddLeadSourceNode,
};

function App() {
  const initialNodes: Node[] = [
    {
      id: "add-lead-source",
      type: "addLeadSource",
      position: { x: 150, y: 0 },
      data: {},
      draggable: false,
      width: 250,
    },
    {
      id: "add-1",
      type: "addButton",
      position: { x: 255, y: 150 },
      draggable: false,
      width: 40,
      height: 40,
      data: {},
    },
  ];
  const initialEdges: Edge[] = [];
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const hasLeadSource = nodes.some((node) => node.type === "leadSource");
  console.log("hasLeadSource: ", hasLeadSource);
  console.log("Nodes: ", nodes);
  console.log("Edges: ", edges);
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("onConnect: ", params);
      // Only allow connection if:
      // 1. Target node doesn't already have a connection
      // 2. Source node doesn't already have a connection
      // 3. Not trying to connect waitDelay to waitDelay

      const targetConnected = edges.find(
        (edge) => edge.target === params.target
      );
      const sourceConnected = edges.find(
        (edge) => edge.source === params.source
      );

      // Check if trying to connect two waitDelay nodes by checking ID prefixes
      const isWaitDelayToWaitDelay =
        params.source?.startsWith("waitDelay-") &&
        params.target?.startsWith("waitDelay-");

      if (targetConnected) {
        console.warn("Cannot connect: Target node already has a connection");
        toast(
          "This step already has a connection. Please remove the existing connection first."
        );
        return;
      }

      if (sourceConnected) {
        console.warn("Cannot connect: Source node already has a connection");
        toast(
          "This step can only connect to one next step. Please remove the existing connection first."
        );
        return;
      }

      if (isWaitDelayToWaitDelay) {
        console.warn("Cannot connect: Cannot connect two delay nodes directly");
        toast(
          "You cannot connect two delay steps directly. Please add an email step between delays."
        );
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log("Edges Change: ", changes);
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log("Node Changes: ", changes);

      const removedLeadSource = changes.find(
        (change) => change.type === "remove" && change.id === "lead-source"
      );

      console.log("removed lead node: ", removedLeadSource);

      // If lead source is removed, replace it with an add lead source node
      if (removedLeadSource) {
        setNodes((nodes) => {
          const removedNodeIndex = nodes.findIndex(
            (node) => node.id === "lead-source"
          );
          const newNodes = [...nodes];
          newNodes[removedNodeIndex] = {
            id: "add-lead-source",
            type: "addLeadSource",
            position: nodes[removedNodeIndex].position,
            data: {},
            draggable: false,
            width: 250,
          };
          return applyNodeChanges(changes, newNodes);
        });
        return;
      }

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const handleAddLeadSource = useCallback(() => {
    setNodes((nodes) => [
      {
        id: "add-lead-source",
        type: "addLeadSource",
        position: { x: 150, y: 0 },
        data: {},
        draggable: false,
        width: 250,
      },
      ...nodes,
    ]);
  }, [setNodes]);

  const handleAddNodeButton = useCallback(() => {
    // Find the last node to position the new add button below it
    const lastNode = [...nodes].sort(
      (a, b) => (b.position.y || 0) - (a.position.y || 0)
    )[0];

    console.log("last node: ", lastNode);
    const newY = lastNode ? (lastNode.position.y || 0) + 150 : 150;
    console.log("newY: ", newY);

    setNodes((nodes) => [
      ...nodes,
      {
        id: `add-${Date.now()}`,
        type: "addButton",
        position: { x: 255, y: newY },
        data: {},
        draggable: false,
        width: 40,
        height: 40,
      },
    ]);
  }, [nodes, setNodes]);

  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-[100svw] h-[100svh] border relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Panel position="top-right">
            <SaveScheduledButton />
          </Panel>
          <Panel position="top-left">
            <AddNodesPanel
              nodes={nodes}
              onAddLeadSource={handleAddLeadSource}
              onAddNodeButton={handleAddNodeButton}
            />
          </Panel>
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
