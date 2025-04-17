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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

type WaitDelayData = {
  value: number;
  unit: "minutes" | "hours" | "days";
}


const schema = yup.object({
  value: yup.number().required().positive(),
  unit: yup.string().oneOf(["minutes", "hours", "days"]).required(),
});

export function WaitDelayNode({ data, id }: NodeProps<Node<WaitDelayData>>) {
  const [isOpen, setIsOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const form = useForm<{ value: number; unit: WaitDelayData["unit"] }>({
    resolver: yupResolver(schema),
    defaultValues: {
      value: data.value || 1,
      unit: data.unit || "hours",
    },
  });

  const onSubmit = (values:WaitDelayData) => {
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
    form.reset({ unit: data.unit, value: data.value });
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
          Wait/Delay
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Delay Duration</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
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

      {data.value > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Delay: {data.value} {data.unit}(s)
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
