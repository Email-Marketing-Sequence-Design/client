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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

type ColdEmailData = {
  subject: string;
  body: string;
};

const schema = yup.object({
  subject: yup.string().required(),
  body: yup.string().required(),
});

export function ColdEmailNode({ data, id }: NodeProps<Node<ColdEmailData>>) {
  const [isOpen, setIsOpen] = useState(true);
  const { setNodes } = useReactFlow();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      subject: data.subject || "",
      body: data.body || "",
    },
  });

  const onSubmit = (values: ColdEmailData) => {
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
    form.reset({ body: data.body, subject: data.subject });
    setIsOpen(false);
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />

      <Dialog open={isOpen}>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Cold Email
        </Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Email subject..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Email body..." {...field} />
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

      {data.subject && (
        <div className="mt-2 text-sm text-gray-600">
          <div>Subject: {data.subject}</div>
          <div className="truncate">Body: {data.body}</div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}
