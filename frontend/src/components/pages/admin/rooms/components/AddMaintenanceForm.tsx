import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { CreateMaintenanceHistories } from "@/interfaces/maintenanceHistory";
import { CreateMaintenanceHistory } from "wailsjs/go/app/App";

const addMaintenanceSchema = z.object({
  date: z.date({
    required_error: "Vui lòng chọn ngày",
  }),
  description: z
    .string()
    .min(5, { message: "Nội dung phải có ít nhất 5 ký tự" }),
  cost: z.coerce.number().min(0, { message: "Chi phí không được âm" }),
});

interface AddMaintenanceFormProps {
  setOpenMaintenanceDialog: (open: boolean) => void;
}

export type AddMaintenanceValues = z.infer<typeof addMaintenanceSchema>;

export function AddMaintenanceForm({
  setOpenMaintenanceDialog,
}: AddMaintenanceFormProps) {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: CreateMaintenanceHistories) =>
      CreateMaintenanceHistory(data),
    onSuccess() {
      setOpenMaintenanceDialog(false);
      queryClient.refetchQueries({
        queryKey: ["room", id],
      });
      form.reset();
    },
    onError() {
      setOpenMaintenanceDialog(false);
      form.reset();
    },
  });

  const form = useForm<AddMaintenanceValues>({
    resolver: zodResolver(addMaintenanceSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      cost: 0,
    },
  });

  const onSubmit = async (values: AddMaintenanceValues) => {
    const data: CreateMaintenanceHistories = {
      maintenance_date: values.date.toDateString(),
      description: values.description,
      cost: values.cost,
      room_id: id ? +id : 0,
    };

    toast.promise(mutateAsync(data), {
      loading: "Đang tạo tiện nghi...",
      success: "Tạo tiện nghi thành công!",
      error: (err) => {
        const errorMessage = err?.message;
        return errorMessage;
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày bảo trì</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về hoạt động bảo trì"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chi phí (VND)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Nhập chi phí" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang thêm...
            </>
          ) : (
            "Thêm bảo trì"
          )}
        </Button>
      </form>
    </Form>
  );
}
