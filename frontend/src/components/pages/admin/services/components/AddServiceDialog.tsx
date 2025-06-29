import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const serviceSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên dịch vụ" }),
  description: z.string().min(1, { message: "Vui lòng nhập mô tả" }),
  price: z.string().min(1, { message: "Vui lòng nhập giá" }),
  unit: z.string().min(1, { message: "Vui lòng nhập đơn vị tính" }),
  provider: z.string().min(1, { message: "Vui lòng nhập nhà cung cấp" }),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

type AddServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddServiceDialog({
  open,
  onOpenChange,
}: AddServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      unit: "",
      provider: "",
    },
  });

  const onSubmit = (values: ServiceFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Adding service:", values);
      alert("Đã thêm dịch vụ thành công!");
      setIsSubmitting(false);
      onOpenChange(false);
      form.reset();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để thêm dịch vụ mới vào hệ thống
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
                    <Textarea
                      placeholder="Nhập mô tả dịch vụ"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VND)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Nhập giá" {...field} />
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
                    <FormLabel>Đơn vị tính</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: tháng, kg, lần" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhà cung cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên nhà cung cấp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Thêm dịch vụ"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
