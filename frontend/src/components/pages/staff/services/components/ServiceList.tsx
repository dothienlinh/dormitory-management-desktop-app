import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  provider: string;
  available: boolean;
  subscriptions: number;
}

interface ServiceListProps {
  services: Service[];
}

export default function ServiceList({ services }: ServiceListProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên dịch vụ</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Nhà cung cấp</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Số lượt sử dụng</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                {formatCurrency(service.price)} / {service.unit}
              </TableCell>
              <TableCell>{service.provider}</TableCell>
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
              <TableCell>{service.subscriptions} lượt</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/staff/services/${service.id}`)}
                >
                  Chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
