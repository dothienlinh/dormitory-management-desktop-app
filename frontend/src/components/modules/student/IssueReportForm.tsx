import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

// Schema dành cho form báo cáo sự cố
const issueReportSchema = z.object({
  issueType: z.string({
    required_error: "Vui lòng chọn loại sự cố",
  }),
  title: z.string().min(5, {
    message: "Tiêu đề phải có ít nhất 5 ký tự",
  }),
  description: z.string().min(10, {
    message: "Mô tả phải có ít nhất 10 ký tự",
  }),
  priority: z.string().optional(),
});

type IssueReportValues = z.infer<typeof issueReportSchema>;

export function IssueReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<IssueReportValues>({
    resolver: zodResolver(issueReportSchema),
    defaultValues: {
      issueType: "",
      title: "",
      description: "",
      priority: "medium",
    },
  });

  function onSubmit(data: IssueReportValues) {
    setIsSubmitting(true);
    // Giả lập gửi dữ liệu đến API
    setTimeout(() => {
      console.log("Form data submitted:", data);
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form sau khi gửi thành công
      // form.reset();
    }, 1500);
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold">Báo cáo đã được gửi!</h3>
        <p className="text-muted-foreground mt-2">
          Cảm ơn bạn đã báo cáo sự cố. Chúng tôi sẽ xử lý trong thời gian sớm
          nhất.
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
        >
          Gửi báo cáo khác
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="issueType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại sự cố</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại sự cố" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="facilities">Cơ sở vật chất</SelectItem>
                  <SelectItem value="plumbing">Hệ thống nước</SelectItem>
                  <SelectItem value="electrical">Hệ thống điện</SelectItem>
                  <SelectItem value="internet">Internet/Wifi</SelectItem>
                  <SelectItem value="security">An ninh</SelectItem>
                  <SelectItem value="roommate">
                    Vấn đề với bạn cùng phòng
                  </SelectItem>
                  <SelectItem value="other">Vấn đề khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tiêu đề ngắn gọn mô tả sự cố"
                  {...field}
                />
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
              <FormLabel>Mô tả chi tiết</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về sự cố bạn đang gặp phải..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Vui lòng cung cấp càng nhiều thông tin càng tốt để giúp chúng
                tôi xử lý nhanh chóng.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mức độ ưu tiên</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ ưu tiên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Thấp - Có thể đợi</SelectItem>
                  <SelectItem value="medium">
                    Trung bình - Cần xử lý sớm
                  </SelectItem>
                  <SelectItem value="high">Cao - Cần xử lý ngay</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi báo cáo"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
