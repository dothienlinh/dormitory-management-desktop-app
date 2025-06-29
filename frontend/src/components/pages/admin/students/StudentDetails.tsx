import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  //  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";
import { StudentProfile } from "./components/StudentProfile";
// import { ContractHistory } from "./components/ContractHistory";
// import { PaymentHistory } from "./components/PaymentHistory";
// import { DisciplinaryRecords } from "./components/DisciplinaryRecords";
import { IResponse } from "@/interfaces/service";
import { User } from "@/interfaces/user";
import { usersService } from "@/services/apis/users";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: student, isLoading } = useQuery<IResponse<User>>({
    queryKey: ["user", id],
    queryFn: () => usersService.getById(id ? +id : 0),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.spinner className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Không tìm thấy sinh viên</CardTitle>
            <CardDescription>
              Không tìm thấy thông tin sinh viên với mã {id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/students">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách sinh viên
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/students">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {student.data.full_name}
            </h2>
            <p className="text-muted-foreground">
              MSSV: {student.data.student_code}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <StudentProfile student={student.data} />

        <Card className="md:col-span-4">
          <Tabs defaultValue="contracts">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết sinh viên</CardTitle>
                <TabsList>
                  <TabsTrigger value="contracts">Hợp đồng</TabsTrigger>
                  <TabsTrigger value="payments">Thanh toán</TabsTrigger>
                  <TabsTrigger value="disciplinary">Kỷ luật</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              {/* Contract History Tab */}
              {/* <TabsContent value="contracts" className="mt-0">
                <ContractHistory
                  contracts={student.contractHistory}
                  studentName={student.data.full_name}
                />
              </TabsContent> */}

              {/* Payment History Tab */}
              {/* <TabsContent value="payments" className="mt-0">
                <PaymentHistory
                  payments={student.paymentHistory}
                  studentName={student.name}
                />
              </TabsContent> */}

              {/* Disciplinary Records Tab */}
              {/* <TabsContent value="disciplinary" className="mt-0">
                <DisciplinaryRecords
                  records={student.disciplinaryRecords}
                  studentName={student.name}
                />
              </TabsContent> */}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
