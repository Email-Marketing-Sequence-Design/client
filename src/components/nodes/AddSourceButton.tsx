import { NodeProps, useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LeadSourceForm,
  type LeadSourceFormData,
} from "@/components/forms/LeadSourceForm";

export function AddLeadSourceNode({ id }: NodeProps) {
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: LeadSourceFormData) => {
    // Get the current node to maintain its position
    setNodes((nodes) => {
      const currentNode = nodes.find((node) => node.id === id);
      if (!currentNode) return nodes;

      const newLeadSource = {
        id: "lead-source",
        type: "leadSource",
        position: currentNode.position,
        data: values,
        draggable: false,
        width: 250,
      };

      // Replace the add source node with the new lead source
      const updatedNodes = nodes.map((node) =>
        node.id === id ? newLeadSource : node
      );

      // Create edge to the next add button if it exists and there are no edges
      const nextAddButton = nodes.find((node) => node.type === "addButton");
      const existingEdges = getEdges();
      if (nextAddButton && existingEdges.length === 0) {
        setEdges([
          {
            id: `e-lead-source-${nextAddButton.id}`,
            source: "lead-source",
            target: nextAddButton.id,
          },
        ]);
      }

      return updatedNodes;
    });

    setIsOpen(false);
  };

  return (
    <>
      <div className="group px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-teal-200 hover:border-teal-300 transition-all w-[250px]">
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full h-full flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
        >
          <UserPlus className="h-5 w-5" />
          Add Lead Source
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-medium">
              Add Lead Source
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Set the lead source email address.
            </p>
          </DialogHeader>
          <LeadSourceForm
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
