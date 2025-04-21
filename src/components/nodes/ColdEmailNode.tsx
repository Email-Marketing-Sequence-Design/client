import { Handle, Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailForm, type EmailFormData } from "@/components/forms/EmailForm";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/modals/DeleteConfirmationDialog";

export function ColdEmailNode({ data, id }: NodeProps<Node<EmailFormData>>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { setNodes, deleteElements } = useReactFlow();

  const handleSubmit = (values: EmailFormData) => {
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
    <div className="group relative px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-purple-200 hover:border-purple-300 transition-all">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-purple-500"
      />

      {/* Action Buttons */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-purple-500"
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
      <div className="mb-2 font-medium text-purple-600 flex items-center">
        <span className="text-lg mr-2">✉</span>
        Cold Email
      </div>

      {data.subject && (
        <div className="space-y-1 text-sm text-gray-600">
          <div className="truncate">
            <span className="font-medium">Subject:</span> {data.subject}
          </div>
          <div className="truncate">
            <span className="font-medium">Body:</span> {data.body}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-purple-500"
      />

      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-medium">Edit Email</DialogTitle>
            <p className="text-sm text-gray-500">
              Modify the content of your email.
            </p>
          </DialogHeader>
          <EmailForm
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
