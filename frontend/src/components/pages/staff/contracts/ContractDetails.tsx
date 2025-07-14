import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  FileText,
  Edit,
  Printer,
  Download,
  Building,
  User,
  CalendarDays,
  BanknoteIcon,
} from "lucide-react";
// import { EditContractDialog } from "./components/EditContractDialog";
import { GetContractDetails } from "wailsjs/go/app/App";
import { Contract } from "@/interfaces/contract";
import { RoomStatus } from "@/enums/rooms";
import { getStatusColorContract, getStatusTextContract } from "@/utils/getText";

// Get room status text in Vietnamese
const getRoomStatusText = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return "Có sẵn";
    case RoomStatus.OCCUPIED:
      return "Đã có người ở";
    case RoomStatus.MAINTENANCE:
      return "Đang bảo trì";
    default:
      return status;
  }
};

// Get room status badge color
const getRoomStatusColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case RoomStatus.OCCUPIED:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case RoomStatus.MAINTENANCE:
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    default:
      return "";
  }
};

export default function ContractDetails() {
  const { id } = useParams<{ id: string }>();
  // const [openEditDialog, setOpenEditDialog] = useState(false);

  const {
    data: contractResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contract", id],
    queryFn: () => GetContractDetails(id!),
    enabled: !!id,
  });

  const contract: Contract | null = contractResponse?.ParsedBody?.data || null;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Không tìm thấy hợp đồng</CardTitle>
            <CardDescription>
              {error
                ? "Có lỗi xảy ra khi tải thông tin hợp đồng"
                : `Không tìm thấy thông tin hợp đồng với mã ${id}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/staff/contracts">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách hợp đồng
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link to="/staff/contracts">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Hợp đồng {contract.code || contract.id}
            </h2>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={getStatusColorContract(contract.status)}
              >
                {getStatusTextContract(contract.status)}
              </Badge>
              <p className="text-muted-foreground">
                Ngày tạo:{" "}
                {new Date(contract.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In hợp đồng
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Tải PDF
          </Button>
          <Button disabled>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin sinh viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Họ tên:</span>
                <Link
                  to={`/staff/students/${contract.user_id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {contract.user?.full_name || "N/A"}
                </Link>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">MSSV:</span>
                <span>{contract.user?.student_code || "N/A"}</span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Số điện thoại:
                </span>
                <span>{contract.user?.phone || "N/A"}</span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span>{contract.user?.email || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Thông tin phòng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mã phòng:</span>
                <Link
                  to={`/staff/rooms/${contract.room_id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {contract.room?.room_number || "N/A"}
                </Link>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Trạng thái phòng:
                </span>
                <Badge
                  variant="outline"
                  className={
                    contract.room?.status
                      ? getRoomStatusColor(contract.room.status)
                      : ""
                  }
                >
                  {contract.room?.status
                    ? getRoomStatusText(contract.room.status)
                    : "N/A"}
                </Badge>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Loại phòng:
                </span>
                <span>{contract.room?.room_category?.name || "N/A"}</span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sức chứa:</span>
                <span>
                  {contract.room?.room_category?.capacity
                    ? `${contract.room.room_category.capacity} người`
                    : "N/A"}
                </span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Diện tích:
                </span>
                <span>
                  {contract.room?.room_category?.acreage
                    ? `${contract.room.room_category.acreage} m²`
                    : "N/A"}
                </span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Số người hiện tại:
                </span>
                <span>
                  {contract.room?.user_count !== undefined
                    ? `${contract.room.user_count} người`
                    : "N/A"}
                </span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Giá phòng gốc:
                </span>
                <span className="font-medium">
                  {contract.room?.room_category?.price
                    ? `${contract.room.room_category.price.toLocaleString()} VND/tháng`
                    : "N/A"}
                </span>
              </div>

              {contract.room?.room_category?.description && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Mô tả loại phòng:
                    </span>
                    <div className="mt-1 text-sm">
                      {contract.room.room_category.description}
                    </div>
                  </div>
                </>
              )}

              {contract.room?.room_amenities &&
                contract.room.room_amenities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Tiện ích:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {contract.room.room_amenities.map((roomAmenity) => (
                          <Badge
                            key={roomAmenity.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {roomAmenity.amenity?.name || "N/A"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Thông tin hợp đồng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Thời hạn:
                  </span>
                  <span>
                    {new Date(contract.start_date).toLocaleDateString("vi-VN")}{" "}
                    - {new Date(contract.end_date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Phí thuê hàng tháng:
                  </span>
                  <span className="font-medium">
                    {contract.price.toLocaleString()} VND
                  </span>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mô tả:</span>
                  <span className="font-medium">
                    {contract.description || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  Mô tả hợp đồng:
                </span>
                <div className="mt-2 text-sm">
                  {contract.description || "Không có mô tả"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5" />
              Thông tin thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Thông tin thanh toán chi tiết sẽ được cập nhật sau</p>
              <p className="text-sm mt-2">
                Hiện tại chỉ hiển thị thông tin cơ bản của hợp đồng
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Lịch sử hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">Hợp đồng được tạo</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contract.created_at).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Thực hiện bởi: System
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Update EditContractDialog to work with new Contract interface */}
      {/* <EditContractDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        contract={contract}
      /> */}
    </div>
  );
}
