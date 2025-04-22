import { Handle, Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { Pencil, UserCircle } from "lucide-react";

export function LeadSourceNode({
  data,
  id,
}: NodeProps<Node<LeadSourceFormData>>) {
  const [isOpen, setIsOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSubmit = (values: LeadSourceFormData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: values };
        }
        return node;
      })
    );
    setIsOpen(false);
  };

  return (
    <div className="group relative px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-teal-200 hover:border-teal-300 transition-all">
      {/* Action Buttons */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-teal-500"
          onClick={() => setIsOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Node Content */}
      <div className="mb-2 font-medium text-teal-600 flex items-center">
        <UserCircle className="h-5 w-5 mr-2" />
        Lead Source
      </div>

      {data.email && (
        <div className="text-sm text-gray-600 truncate">
          <span className="font-medium">Email:</span> {data.email}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />

      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-medium">
              Edit Lead Source
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Modify the lead source email address.
            </p>
          </DialogHeader>
          <LeadSourceForm
            defaultValues={data}
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
