import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  price: z.coerce
    .number()
    .min(0, "Giá dịch vụ không được âm")
    .transform((val) => (isNaN(val) ? 0 : val)),
  unit: z.string().min(1, "Đơn vị không được để trống"),
  provider: z.string().min(1, "Nhà cung cấp không được để trống"),
  available: z.boolean(),
});

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  provider: string;
  available: boolean;
  subscriptions: number;
};

type EditServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
};

export function EditServiceDialog({
  open,
  onOpenChange,
  service,
}: EditServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service.name,
      description: service.description,
      price: service.price,
      unit: service.unit,
      provider: service.provider,
      available: service.available,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Cập nhật dịch vụ:", {
        id: service.id,
        ...values,
      });

      toast.success("Cập nhật dịch vụ thành công!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Có lỗi xảy ra khi cập nhật dịch vụ!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật dịch vụ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin dịch vụ. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên dịch vụ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên dịch vụ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập mô tả dịch vụ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập giá dịch vụ"
                      {...field}
                    />
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
                  <FormLabel>Đơn vị</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đơn vị" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhà cung cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập nhà cung cấp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
