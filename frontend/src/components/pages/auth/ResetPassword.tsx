import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Check } from "lucide-react";
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

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordValues) {
    setIsLoading(true);
    setError(null);

    // Giả lập đặt lại mật khẩu
    setTimeout(() => {
      // Kiểm tra token
      if (!token) {
        setError("Token không hợp lệ hoặc đã hết hạn");
        setIsLoading(false);
        return;
      }

      console.log("Reset password with token:", token);
      console.log("New password:", values.password);

      setIsLoading(false);
      setIsSuccess(true);

      // Tự động chuyển về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    }, 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Đặt lại mật khẩu</h1>
          <p className="text-muted-foreground mt-2">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <div className="bg-background p-6 sm:p-8 rounded-xl shadow-sm border">
          {!isSuccess ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {!token && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui
                    lòng yêu cầu liên kết mới.
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading || !token}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading || !token}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md bg-primary/10 p-4 text-sm text-primary flex flex-col items-center">
                <Check className="h-6 w-6 mb-2" />
                <div className="text-center mb-2 font-medium">
                  Mật khẩu đã được đặt lại!
                </div>
                <p className="text-center">
                  Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được
                  chuyển đến trang đăng nhập...
                </p>
              </div>
            </div>
          )}

          {!isSuccess && (
            <div className="mt-6 flex justify-center">
              <Button variant="link" asChild>
                <Link to="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
