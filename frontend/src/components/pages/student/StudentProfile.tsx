import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Pencil, Save, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Định nghĩa schema xác thực cho form
const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z
    .string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 số" })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số" }),
  dateOfBirth: z.string(),
  gender: z.string(),
  address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
  university: z.string().min(2, { message: "Trường học không được để trống" }),
  studentId: z.string().min(5, { message: "Mã sinh viên không hợp lệ" }),
  major: z.string().min(2, { message: "Ngành học không được để trống" }),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    newPassword: z
      .string()
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function StudentProfile() {
  // State cho chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  // State hiển thị mật khẩu
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form thông tin cá nhân
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Nguyễn Văn A",
      email: "student@example.com",
      phone: "0987654321",
      dateOfBirth: "2001-05-15",
      gender: "male",
      address: "123 Đường ABC, Quận X, TP. Hồ Chí Minh",
      university: "Đại học Y Hà Nội",
      studentId: "SV123456",
      major: "Y Đa khoa",
    },
  });

  // Form đổi mật khẩu
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Xử lý lưu thông tin cá nhân
  function onProfileSubmit(values: ProfileValues) {
    console.log("Đã cập nhật thông tin cá nhân:", values);
    setIsEditing(false);
    // Gọi API cập nhật thông tin cá nhân
  }

  // Xử lý đổi mật khẩu
  function onPasswordSubmit(values: PasswordValues) {
    console.log("Đã đổi mật khẩu", values);
    passwordForm.reset();
    // Gọi API đổi mật khẩu
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Hồ sơ sinh viên</CardTitle>
            <CardDescription>Thông tin cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-muted">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback className="text-4xl">
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">
                {profileForm.getValues("fullName")}
              </h3>
              <p className="text-muted-foreground text-sm">
                MSSV: {profileForm.getValues("studentId")}
              </p>
              <p className="text-muted-foreground text-sm">
                Trường: {profileForm.getValues("university")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thông tin
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Chỉnh sửa thông tin
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:w-2/3">
          <CardHeader>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4 space-y-4">
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập họ tên"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mã sinh viên</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập mã sinh viên"
                                {...field}
                                disabled={true} // Không cho phép chỉnh sửa
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="name@example.com"
                                type="email"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0987654321"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày sinh</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giới tính</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                                <SelectItem value="other">Khác</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="university"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trường học</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập trường học"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="major"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngành học</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập ngành học"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập địa chỉ"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isEditing && (
                      <Button type="submit" className="w-full">
                        Lưu thay đổi
                      </Button>
                    )}
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="password" className="mt-4 space-y-4">
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu hiện tại</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Nhập mật khẩu hiện tại"
                                type={showCurrentPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu mới</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Nhập mật khẩu mới"
                                type={showNewPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Xác nhận mật khẩu mới"
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Đổi mật khẩu
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
