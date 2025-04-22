import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export type LeadSourceFormData = {
  email: string;
};

const schema = yup.object({
  email: yup.string().email().required(),
});

interface LeadSourceFormProps {
  defaultValues?: LeadSourceFormData;
  onSubmit: (data: LeadSourceFormData) => void;
  onCancel: () => void;
}

export function LeadSourceForm({
  defaultValues,
  onSubmit,
  onCancel,
}: Readonly<LeadSourceFormProps>) {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {
      email: "",
    },
  });

  return (
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
            onClick={onCancel}
            variant="outline"
            className="px-4 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button type="submit" className="px-4 bg-teal-500 hover:bg-teal-600">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
