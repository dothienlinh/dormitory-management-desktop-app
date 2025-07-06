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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const requestSchema = z.object({
  studentId: z.string().min(1, { message: "Vui lòng nhập mã sinh viên" }),
  roomName: z.string().min(1, { message: "Vui lòng nhập số phòng" }),
  serviceType: z.string().min(1, { message: "Vui lòng chọn loại dịch vụ" }),
  description: z.string().min(1, { message: "Vui lòng nhập mô tả" }),
  urgency: z.string().min(1, { message: "Vui lòng chọn mức độ ưu tiên" }),
});

type RequestFormValues = z.infer<typeof requestSchema>;

type AddServiceRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddServiceRequestDialog({
  open,
  onOpenChange,
}: AddServiceRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      studentId: "",
      roomName: "",
      serviceType: "",
      description: "",
      urgency: "",
    },
  });

  const onSubmit = (values: RequestFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Adding service request:", values);
      alert("Đã tạo yêu cầu dịch vụ thành công!");
      setIsSubmitting(false);
      onOpenChange(false);
      form.reset();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu dịch vụ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo yêu cầu dịch vụ mới
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã sinh viên</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: SV001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số phòng</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: P101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại dịch vụ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại dịch vụ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Internet">Internet</SelectItem>
                      <SelectItem value="Điện">Điện</SelectItem>
                      <SelectItem value="Nước">Nước</SelectItem>
                      <SelectItem value="Giặt ủi">Giặt ủi</SelectItem>
                      <SelectItem value="Vệ sinh">Vệ sinh</SelectItem>
                      <SelectItem value="Sửa chữa">Sửa chữa</SelectItem>
                    </SelectContent>
                  </Select>
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
                      placeholder="Mô tả chi tiết yêu cầu"
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
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức độ ưu tiên</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ ưu tiên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                    </SelectContent>
                  </Select>
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
                  "Tạo yêu cầu"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
