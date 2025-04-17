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
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Dialog open={isOpen}>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Lead Source
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Lead Source Email</DialogTitle>
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
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant={"destructive"}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {data.email && (
        <div className="mt-2 text-sm text-gray-600">Email: {data.email}</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}
