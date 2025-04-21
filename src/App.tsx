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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { LeadSourceNode } from "@/components/nodes/LeadSourceNode";
import { ColdEmailNode } from "@/components/nodes/ColdEmailNode";
import { WaitDelayNode } from "@/components/nodes/WaitDelayNode";
import { AddNodeButton } from "@/components/nodes/AddNodeButton";
import SaveScheduledButton from "./components/SaveScheduledButton";
import { toast } from "sonner";

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
      position: { x: 255, y: 150 },
      draggable: false,
      width: 40,
      height: 40,
      data: {},
    },
  ];
  const initialEdges: Edge[] = [
    { id: "e-lead-source-add1", source: "lead-source", target: "add-1" },
  ];
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  console.log("Nodes: ", nodes);
  console.log("Edges: ", edges);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("onConnect: ", params);
      // Only allow connection if:
      // 1. Target node doesn't already have a connection
      // 2. Source node doesn't already have a connection
      // 3. Not trying to connect waitDelay to waitDelay

      const targetConnected = edges.find((edge) => edge.target === params.target);
      const sourceConnected = edges.find((edge) => edge.source === params.source);
      
      // Check if trying to connect two waitDelay nodes by checking ID prefixes
      const isWaitDelayToWaitDelay =
        params.source?.startsWith("waitDelay-") &&
        params.target?.startsWith("waitDelay-");

      if (targetConnected) {
        console.warn("Cannot connect: Target node already has a connection");
        toast("This step already has a connection. Please remove the existing connection first.");
        return;
      }

      if (sourceConnected) {
        console.warn("Cannot connect: Source node already has a connection");
        toast("This step can only connect to one next step. Please remove the existing connection first.");
        return;
      }

      if (isWaitDelayToWaitDelay) {
        console.warn("Cannot connect: Cannot connect two delay nodes directly");
        toast("You cannot connect two delay steps directly. Please add an email step between delays.");
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
      console.log('Node change: ', changes)
      const removedNode = changes.find((node)=>node.type==='remove')
      console.log("remove node: ", removedNode)
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-[100svw] h-[100svh] border relative">
        <SaveScheduledButton nodes={nodes} edges={edges} />
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
