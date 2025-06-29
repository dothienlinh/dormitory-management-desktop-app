import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setIsLoading(true);
    try {
      // Giả lập API call quên mật khẩu
      console.log("Forgot password for:", values.email);

      // Giả lập độ trễ
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Hiển thị màn hình xác nhận thành công
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      form.setError("root", {
        message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Kiểm tra email
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn
            </p>
          </div>

          <div className="bg-background p-6 sm:p-8 rounded-xl shadow-sm border text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>

            <h3 className="text-xl font-semibold mb-2">Yêu cầu đã được gửi</h3>
            <p className="text-muted-foreground mb-6">
              Chúng tôi đã gửi email hướng dẫn khôi phục mật khẩu đến{" "}
              <span className="font-medium">{form.getValues().email}</span>. Vui
              lòng kiểm tra hộp thư đến của bạn.
            </p>

            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/auth/login">Quay lại đăng nhập</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Thử lại với email khác
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Quên mật khẩu</h2>
          <p className="mt-2 text-muted-foreground">
            Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
          </p>
        </div>

        <div className="bg-background p-6 sm:p-8 rounded-xl shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi hướng dẫn khôi phục"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <Button
              variant="ghost"
              className="gap-1 text-muted-foreground"
              asChild
              size="sm"
            >
              <Link to="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
