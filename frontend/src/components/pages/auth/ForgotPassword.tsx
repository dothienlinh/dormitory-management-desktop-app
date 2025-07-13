import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Loader2,
  ArrowLeft,
  Mail,
  CheckCircle2,
  LockKeyhole,
  Shield,
} from "lucide-react";
import { ResetPassword, SendForgotPasswordEmail } from "wailsjs/go/app/App";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

const resetPasswordSchema = z
  .object({
    code: z.string().min(6, { message: "Mã xác thực phải có ít nhất 6 ký tự" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showResendSuccess, setShowResendSuccess] = useState(false);

  const emailForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: sendForgotPasswordEmail, isPending: isSendingEmail } =
    useMutation({
      mutationFn: (email: string) => SendForgotPasswordEmail(email),
      onSuccess: () => {
        setStep("reset");
        setCountdown(60);
      },
      onError: (error: unknown) => {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra. Vui lòng thử lại sau.";
        emailForm.setError("root", {
          message: errorMsg,
        });
      },
    });

  const { mutate: resetPassword, isPending: isResettingPassword } = useMutation(
    {
      mutationFn: (data: {
        code: string;
        new_password: string;
        email: string;
      }) => ResetPassword(data),
      onSuccess: () => {
        setStep("success");
      },
      onError: (error: unknown) => {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Mã xác thực không hợp lệ hoặc đã hết hạn.";
        resetForm.setError("root", {
          message: errorMsg,
        });
      },
    }
  );

  const { mutate: resendCode, isPending: isResendingCode } = useMutation({
    mutationFn: () => SendForgotPasswordEmail(email),
    onSuccess: () => {
      resetForm.clearErrors();
      setShowResendSuccess(true);
      setCountdown(60);
      setTimeout(() => setShowResendSuccess(false), 3000);
    },
    onError: (error: unknown) => {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi lại mã xác thực.";
      resetForm.setError("root", {
        message: errorMsg,
      });
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  function onSubmitEmail(values: ForgotPasswordValues) {
    setEmail(values.email);
    sendForgotPasswordEmail(values.email);
  }

  function onSubmitReset(values: ResetPasswordValues) {
    resetPassword({
      code: values.code,
      new_password: values.password,
      email: email,
    });
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Thành công!</h2>
            <p className="mt-2 text-muted-foreground">
              Mật khẩu của bạn đã được đặt lại thành công
            </p>
          </div>

          <div className="bg-background p-6 sm:p-8 rounded-xl shadow-sm border text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Mật khẩu đã được thay đổi
            </h3>
            <p className="text-muted-foreground mb-6">
              Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
            </p>

            <Button asChild className="w-full">
              <Link to="/auth/login">Đăng nhập ngay</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Đặt lại mật khẩu
            </h2>
            <p className="mt-2 text-muted-foreground">
              Nhập mã xác thực đã được gửi đến email và mật khẩu mới
            </p>
          </div>

          <div className="bg-background p-6 sm:p-8 rounded-xl shadow-sm border">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Mã xác thực đã được gửi đến:{" "}
                <span className="font-semibold">{email}</span>
              </p>
            </div>

            {showResendSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    Mã xác thực đã được gửi lại thành công!
                  </p>
                </div>
              </div>
            )}

            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(onSubmitReset)}
                className="space-y-4"
              >
                <FormField
                  control={resetForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã xác thực</FormLabel>
                      <FormControl>
                        <div className="relative">
                          {" "}
                          <Shield className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="Nhập mã xác thực"
                            className="pl-10"
                            {...field}
                            disabled={isResettingPassword}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Mật khẩu
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          icon={
                            <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          }
                          placeholder="••••••••"
                          className="h-11 transition-all border-input/50 focus:border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Mật khẩu
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          icon={
                            <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          }
                          placeholder="••••••••"
                          className="h-11 transition-all border-input/50 focus:border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {resetForm.formState.errors.root && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {resetForm.formState.errors.root.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đặt lại...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Chưa nhận được mã xác thực?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resendCode()}
                  disabled={countdown > 0 || isResendingCode}
                  className="min-w-[200px]"
                >
                  {isResendingCode ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Đang gửi lại...
                    </>
                  ) : countdown > 0 ? (
                    `Gửi lại sau ${countdown}s`
                  ) : (
                    <>
                      <Mail className="mr-2 h-3 w-3" />
                      Gửi lại mã xác thực
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  className="gap-1 text-muted-foreground"
                  size="sm"
                  onClick={() => {
                    setStep("email");
                    setCountdown(0);
                    setShowResendSuccess(false);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Button>
              </div>
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
            Nhập email của bạn để nhận mã xác thực
          </p>
        </div>

        <div className="bg-background p-6 sm:p-8 rounded-xl shadow-sm border">
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onSubmitEmail)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
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
                          disabled={isSendingEmail}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {emailForm.formState.errors.root && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {emailForm.formState.errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi mã xác thực"
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
