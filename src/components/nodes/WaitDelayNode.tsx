import { Handle, Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DelayForm, type DelayFormData } from "@/components/forms/DelayForm";
import { Pencil, Trash2, Clock } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/modals/DeleteConfirmationDialog";

export function WaitDelayNode({ data, id }: NodeProps<Node<DelayFormData>>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { setNodes, deleteElements } = useReactFlow();

  const handleSubmit = (values: DelayFormData) => {
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

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
    setIsDeleteOpen(false);
  };

  return (
    <div className="group relative px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-blue-200 hover:border-blue-300 transition-all">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-blue-500"
      />

      {/* Action Buttons */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-blue-500"
          onClick={() => setIsOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-red-500"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Node Content */}
      <div className="mb-2 font-medium text-blue-600 flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        Wait/Delay
      </div>

      {data.value > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Duration:</span> {data.value} {data.unit}.
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-blue-500"
      />

      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-medium">Edit Delay</DialogTitle>
            <p className="text-sm text-gray-500">
              Modify the waiting duration.
            </p>
          </DialogHeader>
          <DelayForm
            defaultValues={data}
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
