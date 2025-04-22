import {
  Edge,
  Handle,
  Node,
  NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EmailForm, type EmailFormData } from "@/components/forms/EmailForm";
import { DelayForm, type DelayFormData } from "@/components/forms/DelayForm";

type WindowType = "OPTIONS" | "EMAIL" | "DELAY";

export function AddNodeButton({ id }: NodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [windowType, setWindowType] = useState<WindowType>("OPTIONS");
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
  const [selectedAddNodeId, setSelectedAddNodeId] = useState<string | null>(
    null
  );

  const getLastNodeBeforeAddButton = (
    addButtonId: string
  ): string | undefined => {
    const edges = getEdges();
    const nodes = getNodes();
    const edge = edges.find((e) => e.target === addButtonId);
    if (!edge) return undefined;

    const sourceNode = nodes.find((n) => n.id === edge.source);
    return sourceNode?.type;
  };

  const lastNodeType = getLastNodeBeforeAddButton(id);
  const canAddDelay = lastNodeType === "coldEmail";

  const handleAddEmailNode = (formData: EmailFormData) => {
    if (!selectedAddNodeId) return;
    console.log("selected add node id: ", selectedAddNodeId);
    const addButtonNode = getNodes().find((n) => n.id === selectedAddNodeId);
    if (!addButtonNode) return;

    const newNodeId = `coldEmail-${Date.now()}`;
    const newAddButtonId = `add-${Date.now()}`;

    const newNode: Node = {
      id: newNodeId,
      type: "coldEmail",
      position: {
        x: 150,
        y: addButtonNode.position.y,
      },
      data: formData,
      width: 250,
    };

    const newAddButton: Node = {
      id: newAddButtonId,
      type: "addButton",
      position: {
        x: 255,
        y: addButtonNode.position.y + 150,
      },
      data: {},
      width: 40,
      height: 40,
    };

    const sourceEdge = getEdges().find((e) => e.target === selectedAddNodeId);
    const newEdges: Edge[] = [
      ...getEdges().filter((e) => e.target !== selectedAddNodeId),
      ...(sourceEdge
        ? [
            {
              id: `e-${sourceEdge.source}-${newNodeId}`,
              source: sourceEdge.source,
              target: newNodeId,
            },
          ]
        : []),
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
    handleClose();
  };

  const handleAddDelayNode = (formData: DelayFormData) => {
    if (!selectedAddNodeId) return;

    const addButtonNode = getNodes().find((n) => n.id === selectedAddNodeId);
    if (!addButtonNode) return;

    const newNodeId = `waitDelay-${Date.now()}`;
    const newAddButtonId = `add-${Date.now()}`;

    const newNode: Node = {
      id: newNodeId,
      type: "waitDelay",
      position: {
        x: 150,
        y: addButtonNode.position.y,
      },
      data: formData,
      width: 250,
    };

    const newAddButton: Node = {
      id: newAddButtonId,
      type: "addButton",
      position: {
        x: 255,
        y: addButtonNode.position.y + 150,
      },
      data: {},
      width: 40,
      height: 40,
    };
    const sourceEdge = getEdges().find((e) => e.target === selectedAddNodeId);
    const newEdges: Edge[] = [
      ...getEdges().filter((e) => e.target !== selectedAddNodeId),
      ...(sourceEdge
        ? [
            {
              id: `e-${sourceEdge.source}-${newNodeId}`,
              source: sourceEdge.source,
              target: newNodeId,
            },
          ]
        : []),
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
    handleClose();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setWindowType("OPTIONS");
  };

  const handleClose = () => {
    setIsOpen(false);
    setWindowType("OPTIONS");
  };

  const handleCancel = () => {
    setWindowType("OPTIONS");
    setIsOpen(false);
  };

  const renderWindowContent = () => {
    switch (windowType) {
      case "OPTIONS":
        return (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-medium">
                Add New Node
              </DialogTitle>
              <p className="text-sm text-gray-500">
                Select the type of node you want to add to your sequence.
              </p>
            </DialogHeader>
            <div className="grid gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setWindowType("EMAIL")}
                className="w-full h-14 flex items-center justify-start px-4 hover:border-purple-200 hover:bg-purple-50 group"
              >
                <span className="text-purple-500 text-lg mr-3">✉</span>
                <div className="text-left">
                  <div className="font-medium text-gray-700 group-hover:text-purple-600">
                    Email Node
                  </div>
                  <div className="text-xs text-gray-500">
                    Add an email to your sequence
                  </div>
                </div>
              </Button>
              {canAddDelay && (
                <Button
                  variant="outline"
                  onClick={() => setWindowType("DELAY")}
                  className="w-full h-14 flex items-center justify-start px-4 hover:border-blue-200 hover:bg-blue-50 group"
                >
                  <span className="text-blue-500 text-lg mr-3">⏱</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-700 group-hover:text-blue-600">
                      Delay Node
                    </div>
                    <div className="text-xs text-gray-500">
                      Add a time delay between emails
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </>
        );
      case "EMAIL":
        return (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-medium">
                Compose Email
              </DialogTitle>
              <p className="text-sm text-gray-500">
                Create an email to be sent in your sequence.
              </p>
            </DialogHeader>
            <EmailForm onSubmit={handleAddEmailNode} onCancel={handleCancel} />
          </>
        );
      case "DELAY":
        return (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-medium">
                Set Delay
              </DialogTitle>
              <p className="text-sm text-gray-500">
                Specify how long to wait before sending the next email.
              </p>
            </DialogHeader>
            <DelayForm onSubmit={handleAddDelayNode} onCancel={handleCancel} />
          </>
        );
    }
  };

  return (
    <div className="w-full h-full">
      <Handle type="target" position={Position.Top} className="!bg-teal-500" />
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-full h-full"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAddNodeId(id);
          handleOpen();
        }}
      >
        <PlusCircle className="" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          {renderWindowContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
