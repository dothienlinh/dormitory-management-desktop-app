import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";

type Amenity = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  status: "available" | "maintenance" | "out_of_order";
  location: string;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
};

const mockAmenities: Amenity[] = [
  {
    id: "AM001",
    name: "Máy giặt",
    description: "Máy giặt công nghiệp 8kg",
    quantity: 5,
    status: "available",
    location: "Tầng 1, Khu A",
    lastMaintenanceDate: "2024-02-15",
    nextMaintenanceDate: "2024-05-15",
  },
  {
    id: "AM002",
    name: "Máy sấy",
    description: "Máy sấy công nghiệp 8kg",
    quantity: 3,
    status: "maintenance",
    location: "Tầng 1, Khu A",
    lastMaintenanceDate: "2024-03-01",
    nextMaintenanceDate: "2024-06-01",
  },
  {
    id: "AM003",
    name: "Tủ lạnh",
    description: "Tủ lạnh 2 cánh 500L",
    quantity: 2,
    status: "out_of_order",
    location: "Tầng 2, Khu B",
    lastMaintenanceDate: "2024-01-10",
    nextMaintenanceDate: "2024-04-10",
  },
];

// Get status text in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Sẵn sàng";
    case "maintenance":
      return "Đang bảo trì";
    case "out_of_order":
      return "Hỏng";
    default:
      return status;
  }
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "out_of_order":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

export default function AmenityDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const amenity = mockAmenities.find((a: Amenity) => a.id === id);

  const handleDelete = () => {
    // Simulate API call
    setTimeout(() => {
      // Navigate back to list after successful deletion
      navigate("/admin/amenities");
    }, 500);
  };

  if (!amenity) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/amenities")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Không tìm thấy tiện nghi</CardTitle>
                <CardDescription>
                  Tiện nghi bạn đang tìm kiếm không tồn tại
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chi tiết tiện nghi</h2>
        <Button variant="destructive" onClick={() => setOpenDeleteDialog(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa tiện nghi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Mã tiện nghi</p>
            <p className="font-medium">{amenity.id}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tên tiện nghi</p>
            <p className="font-medium">{amenity.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Mô tả</p>
            <p className="font-medium">{amenity.description}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Số lượng</p>
            <p className="font-medium">{amenity.quantity}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Vị trí</p>
            <p className="font-medium">{amenity.location}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <Badge
              variant="outline"
              className={getStatusColor(amenity.status.toString())}
            >
              {getStatusText(amenity.status.toString())}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Bảo trì gần nhất</p>
            <p className="font-medium">
              {amenity.lastMaintenanceDate
                ? new Date(amenity.lastMaintenanceDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Chưa có"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Bảo trì tiếp theo</p>
            <p className="font-medium">
              {amenity.nextMaintenanceDate
                ? new Date(amenity.nextMaintenanceDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Chưa có"}
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tiện nghi này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
