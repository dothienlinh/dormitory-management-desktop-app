import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, School, MapPin } from "lucide-react";
import { getGenderTextUser, getStatusTextUser } from "@/utils/getText";
import { User as IUser } from "@/interfaces/user";

type StudentProfileProps = {
  student: IUser;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function StudentProfile({ student }: StudentProfileProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={student.avatar || ""} />
          <AvatarFallback>{getInitials(student.full_name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{student.full_name}</CardTitle>
          <CardDescription>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                student.status === "active"
                  ? "bg-green-100 text-green-800"
                  : student.status === "inactive"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {getStatusTextUser(student.status)}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <User className="h-4 w-4" /> Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Giới tính</p>
                <p>{getGenderTextUser(student.gender)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ngày sinh</p>
                <p>
                  {new Date(student.birthday || 0).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
          <Separator />

          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" /> Thông tin liên hệ
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{student.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Số điện thoại</p>
                <p>{student.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Địa chỉ</p>
                <p>{student.address}</p>
              </div>
            </div>
          </div>
          <Separator />

          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <School className="h-4 w-4" /> Thông tin học tập
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Trường</p>
                <p>Cao đẳng Công nghệ Bách khoa Hà Nội</p>
              </div>
              <div>
                <p className="text-muted-foreground">Chuyên ngành</p>
                <p>{student.major}</p>
              </div>
            </div>
          </div>
          <Separator />

          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4" /> Liên hệ khẩn cấp
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Họ tên</p>
                <p>{student.emergency_contact?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mối quan hệ</p>
                <p>{student.emergency_contact?.relationship}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Số điện thoại</p>
                <p>{student.emergency_contact?.phone}</p>
              </div>
            </div>
          </div>
          <Separator />

          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" /> Thông tin lưu trú
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Phòng hiện tại</p>
                <Link
                  to={`/admin/rooms/${student.room?.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {student.room?.room_number}
                </Link>
              </div>
              <div>
                <p className="text-muted-foreground">Ngày vào</p>
                <p>{new Date().toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ngày hết hạn</p>
                <p>{new Date().toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
