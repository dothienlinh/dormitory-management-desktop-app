import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { amenitiesService } from "@/services/apis/amenities";
import { CreateFacility } from "@/interfaces/facility";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên tiện nghi"),
});

type AddAmenityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddAmenityDialog({
  open,
  onOpenChange,
}: AddAmenityDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateFacility) => amenitiesService.create(data),
    onSuccess() {
      onOpenChange(false);
      queryClient.refetchQueries({
        queryKey: ["amenities"],
      });
      form.reset();
    },
    onError() {
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(mutateAsync(values), {
      loading: "Đang tạo tiện nghi...",
      success: "Tạo tiện nghi thành công!",
      error: (err) => {
        const errorMessage = err?.message;
        return errorMessage;
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm tiện nghi mới</DialogTitle>
          <DialogDescription>
            Thêm tiện nghi mới vào hệ thống quản lý ký túc xá
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tiện nghi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên tiện nghi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang thêm..." : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
