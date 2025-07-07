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
import { Loader2, LockKeyhole } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useMutation } from "@tanstack/react-query";
import { MAP_ROLE_TO_PATH } from "@/components/routers/constants";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { Login, SetToken } from "wailsjs/go/app/App";
import { UserRole } from "@/enums/user";
import { IResponse } from "@/interfaces/service";
import { Login as ILogin } from "@/interfaces/auth";

const loginFormSchema = z.object({
  email: z.string().min(1, { message: "Email không được để trống" }).email({
    message: "Email không hợp lệ",
  }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormValues) => Login(data.email, data.password),
    onSuccess: (data) => {
      const responseData = data?.ParsedBody as IResponse<ILogin>;
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
