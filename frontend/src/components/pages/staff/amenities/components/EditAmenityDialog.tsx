import { useForm, useWatch } from "react-hook-form";
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
import { useEffect } from "react";
import { CreateFacility } from "@/interfaces/facility";
import { Amenity } from "@/interfaces/amenity";
import { UpdateAmenity } from "wailsjs/go/app/App";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên tiện nghi"),
});

type EditAmenityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amenity: Amenity;
};

export default function EditAmenityDialog({
  open,
  onOpenChange,
  amenity,
}: EditAmenityDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateFacility) =>
      UpdateAmenity(amenity.id.toString(), data),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: amenity.name,
    },
  });
  const name = useWatch({ control: form.control, name: "name" });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(mutateAsync(values), {
      loading: "Đang cập nhập tiện nghi...",
      success: "Cập nhập tiện nghi thành công!",
      error: (err) => {
        const errorMessage = err?.message;
        return errorMessage;
      },
    });
  };

  useEffect(() => {
    form.setValue("name", amenity.name);
  }, [amenity, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật tiện nghi</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin tiện nghi trong hệ thống
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
              <Button
                type="submit"
                disabled={isPending || name === amenity.name}
              >
                {isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
