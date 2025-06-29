import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Room } from "@/interfaces/room";

type RoomInfoCardProps = {
  room: Room;
};

// Get status in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "occupied":
      return "Đã thuê";
    case "vacant":
      return "Trống";
    case "maintenance":
      return "Bảo trì";
    default:
      return status;
  }
};

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case "occupied":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "vacant":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    default:
      return "";
  }
};

// Get facility name in Vietnamese
const getFacilityName = (facility: string) => {
  switch (facility) {
    case "wifi":
      return "Wi-Fi";
    case "bathroom":
      return "Phòng tắm";
    case "air-conditioning":
      return "Điều hòa";
    case "refrigerator":
      return "Tủ lạnh";
    case "tv":
      return "TV";
    default:
      return facility;
  }
};

export function RoomInfoCard({ room }: RoomInfoCardProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Thông tin phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Loại phòng:</span>
            <span>{room.room_category?.name}</span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tình trạng:</span>
            <Badge variant="outline" className={getStatusColor(room.status)}>
              {getStatusText(room.status)}
            </Badge>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sức chứa:</span>
            <span>
              {room.user_count ?? 0}/{room.room_category?.capacity} người
            </span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Diện tích:</span>
            <span>{room.room_category?.acreage} m²</span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Giá thuê:</span>
            <span>{room.room_category?.price.toLocaleString()} VND/tháng</span>
          </div>
          <Separator />

          <div>
            <span className="text-sm text-muted-foreground">Tiện nghi:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {room.room_amenities &&
                room.room_amenities.map((facility, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getFacilityName(facility.amenity.name)}
                  </Badge>
                ))}
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Mô tả:</span>
            <p className="mt-1">{room.room_category?.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
