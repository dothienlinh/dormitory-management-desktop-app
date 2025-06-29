import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, User, Phone, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService, RegisterData } from "@/services/apis/auth";

// Schema for form validation
const registerSchema = z
  .object({
    fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 số" })
      .regex(/^\d+$/, { message: "Số điện thoại chỉ được chứa số" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: RegisterData) => authService.register(values),
    onSuccess: () => {
      navigate("/auth/login");
    },
  });

  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: RegisterFormValues) {
    const data: RegisterData = {
      email: values.email,
      phone: values.phone,
      password: values.password,
      full_name: values.fullName,
    };
    toast.promise(mutateAsync(data), {
      loading: "Đang đăng ký...",
      success: "Đăng ký thành công!",
      error: (err) => {
        const errorMessage = err?.message || "Đăng ký thất bại";
        return errorMessage;
      },
    });
  }

  return (
    <Card className="w-full shadow-lg border-foreground/5 animate-in fade-in-50 duration-300">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
        <CardDescription className="text-muted-foreground">
          Tạo tài khoản mới để sử dụng hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Họ và tên</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Nguyễn Văn A"
                        className="pl-10 h-11 transition-all border-input/50 focus:border-input"
                        {...field}
                        disabled={isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          className="pl-10 h-11 transition-all border-input/50 focus:border-input"
                          {...field}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="0912345678"
                          className="pl-10 h-11 transition-all border-input/50 focus:border-input"
                          {...field}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      disabled={isPending}
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
                  <FormLabel className="text-foreground">
                    Xác nhận mật khẩu
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      icon={
                        <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      }
                      placeholder="••••••••"
                      className="h-11 transition-all border-input/50 focus:border-input"
                      {...field}
                      disabled={isPending}
                    />
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
              className="w-full h-11 mt-2 transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col border-t py-4">
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
