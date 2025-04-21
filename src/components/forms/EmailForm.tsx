import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export type EmailFormData = {
  subject: string;
  body: string;
};

const schema = yup.object({
  subject: yup.string().required(),
  body: yup.string().required(),
});

interface EmailFormProps {
  defaultValues?: EmailFormData;
  onSubmit: (data: EmailFormData) => void;
  onCancel: () => void;
}

export function EmailForm({ defaultValues, onSubmit, onCancel }: Readonly<EmailFormProps>) {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {
      subject: "",
      body: "",
    },
  });

  return (
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
            className="px-4 bg-purple-500 hover:bg-purple-600"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
} 