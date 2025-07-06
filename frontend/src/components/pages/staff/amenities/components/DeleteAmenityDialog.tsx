import { useForm } from "react-hook-form";
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
import { Form } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Amenity } from "@/interfaces/amenity";
import { DeleteAmenity } from "wailsjs/go/app/App";

type DeleteAmenityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amenity: Amenity;
};

export default function DeleteAmenityDialog({
  open,
  onOpenChange,
  amenity,
}: DeleteAmenityDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => DeleteAmenity(amenity.id.toString()),
    onSuccess() {
      onOpenChange(false);
      queryClient.refetchQueries({
        queryKey: ["amenities"],
      });
    },
    onError() {
      onOpenChange(false);
    },
  });

  const form = useForm();

  const onSubmit = async () => {
    toast.promise(mutateAsync(), {
      loading: "Đang xóa tiện nghi...",
      success: "Xóa tiện nghi thành công!",
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
          <DialogTitle>Xóa tiện nghi</DialogTitle>
          <DialogDescription>Xóa tiện nghi trong hệ thống</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang xóa..." : "Xóa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
