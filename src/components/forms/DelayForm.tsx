import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export type DelayFormData = {
  value: number;
  unit: "minutes" | "hours" | "days";
};

const schema = yup.object({
  value: yup.number().required().positive(),
  unit: yup.string().oneOf(["minutes", "hours", "days"]).required(),
});

interface DelayFormProps {
  defaultValues?: DelayFormData;
  onSubmit: (data: DelayFormData) => void;
  onCancel: () => void;
}

export function DelayForm({ defaultValues, onSubmit, onCancel }: Readonly<DelayFormProps>) {
  const form = useForm<DelayFormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {
      value: 1,
      unit: "hours",
    },
  });

  return (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="minutes">Minute</SelectItem>
                  <SelectItem value="hours">Hour</SelectItem>
                  <SelectItem value="days">Day</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-4 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 bg-blue-500 hover:bg-blue-600"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
} 