import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { services } from "./data";

export default function ServiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const service = services.find((s) => s.id === Number(id));

  if (!service) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không tìm thấy dịch vụ</CardTitle>
          <CardDescription>
            Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/admin/services")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Chi tiết dịch vụ</CardTitle>
          <Button variant="outline" onClick={() => navigate("/admin/services")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <CardDescription>
          Thông tin chi tiết về dịch vụ {service.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Tên dịch vụ</TableCell>
              <TableCell>{service.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mô tả</TableCell>
              <TableCell className="whitespace-pre-wrap">
                {service.description}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Giá</TableCell>
              <TableCell>
                {formatCurrency(service.price)} / {service.unit}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Nhà cung cấp</TableCell>
              <TableCell>{service.provider}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Trạng thái</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    service.available
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {service.available ? "Đang hoạt động" : "Tạm ngưng"}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Số lượt sử dụng</TableCell>
              <TableCell>{service.subscriptions} lượt</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={() => navigate(`/admin/services/edit/${service.id}`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      </CardFooter>
    </Card>
  );
}
