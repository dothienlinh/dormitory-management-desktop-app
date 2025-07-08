import { Link, useNavigate } from "react-router-dom";
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
import { AlertCircle, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useMutation } from "@tanstack/react-query";
import { MAP_ROLE_TO_PATH } from "@/components/routers/constants";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { Login, ResendVerifyAccount, SetToken } from "wailsjs/go/app/App";
import { UserRole } from "@/enums/user";
import { IResponse } from "@/interfaces/service";
import { Login as ILogin } from "@/interfaces/auth";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginFormSchema = z.object({
  email: z.string().min(1, { message: "Email không được để trống" }).email({
    message: "Email không hợp lệ",
  }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginComponent() {
  const [showUnverifiedAlert, setShowUnverifiedAlert] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormValues) => Login(data.email, data.password),
    onSuccess: (data) => {
      const responseData = data?.ParsedBody as IResponse<ILogin>;

      if (!responseData.data.is_verified) {
        setShowUnverifiedAlert(true);
        setUnverifiedEmail(responseData.data.user.email);
        toast.warning(
          "Tài khoản chưa được xác thực! Vui lòng kiểm tra email của bạn."
        );
        return;
      }

      if (responseData.data?.user) {
        dispatch(setUser(responseData.data.user));
        const userRole = responseData.data.user.role as UserRole;
        SetToken(responseData.data.access_token || "");
        const redirectPath = MAP_ROLE_TO_PATH[userRole];

        if (redirectPath) {
          navigate(redirectPath);
        } else {
          toast.error("Không thể xác định quyền hạn của người dùng");
        }
      } else {
        toast.error(responseData.message || "Đăng nhập không thành công");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const { mutate: resendVerification, isPending: isResending } = useMutation({
    mutationFn: () => ResendVerifyAccount(unverifiedEmail),
    onSuccess: () => {
      toast.success(
        "Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn."
      );
      setShowUnverifiedAlert(false);
    },
    onError: (error: unknown) => {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi email xác thực";
      toast.error(errorMsg);
    },
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    mutate(values);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Đăng nhập</h2>
          <p className="mt-2 text-muted-foreground">
            Đăng nhập để quản lý thông tin KTX của bạn
          </p>
        </div>

        <div className="bg-background p-6 sm:p-8 rounded-xl shadow-sm border">
          {showUnverifiedAlert && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="space-y-2">
                  <p className="font-medium">Tài khoản chưa được xác thực!</p>
                  <p className="text-sm">
                    Vui lòng kiểm tra email <strong>{unverifiedEmail}</strong>{" "}
                    để xác thực tài khoản của bạn.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resendVerification()}
                      disabled={isResending}
                      className="border-amber-300 text-amber-800 hover:bg-amber-100"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-3 w-3" />
                          Gửi lại email xác thực
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowUnverifiedAlert(false)}
                      className="text-amber-800 hover:bg-amber-100"
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Mật khẩu</FormLabel>
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

              <div className="flex items-center justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
