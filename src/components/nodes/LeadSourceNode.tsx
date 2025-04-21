import { Handle, Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil, UserCircle } from "lucide-react";

type LeadSourceData = {
  email: string;
};

const schema = yup.object({
  email: yup.string().email().required(),
});

export function LeadSourceNode({ data, id }: NodeProps<Node<LeadSourceData>>) {
  const [isOpen, setIsOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: data.email || "",
    },
  });

  const onSubmit = (values: LeadSourceData) => {
    form.reset(values);
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

  const handleCancel = () => {
    form.reset({ email: data.email });
    setIsOpen(false);
  };

  return (
    <div className="group relative px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-teal-200 hover:border-teal-300 transition-all">
      {/* Action Button - Only Edit for LeadSource */}
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
              {data.email ? "Edit" : "Add"} Lead Source
            </DialogTitle>
            <p className="text-sm text-gray-500">
              {data.email ? "Modify" : "Set"} the lead source email address.
            </p>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="px-4 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 bg-teal-500 hover:bg-teal-600"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
