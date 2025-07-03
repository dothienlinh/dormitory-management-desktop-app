import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Room } from "@/interfaces/room";
import { DeleteRoom } from "wailsjs/go/app/App";

type RoomHeaderProps = {
  id: number;
  room: Room;
  onEdit: () => void;
};

export function RoomHeader({ room, onEdit, id }: RoomHeaderProps) {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => DeleteRoom(id),
    onSuccess: () => {
      navigate("/admin/rooms");
    },
    // onError: (error) => {},
  });

  const onDelete = () => {
    toast.promise(mutateAsync(), {
      loading: "Đang xóa phòng...",
      success: "Xóa phòng thành công!",
      error: (err) => {
        const errorMessage = err?.message;
        return errorMessage;
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/admin/rooms">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Phòng {room.room_number}
          </h2>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa phòng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa phòng {room.room_number}? Hành động
                này không thể hoàn tác.
                {room.user_count > 0 && (
                  <div className="mt-2 font-semibold text-destructive">
                    Cảnh báo: Phòng hiện có {room.user_count} người đang ở. Xóa
                    phòng sẽ ảnh hưởng đến họ.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? "Đang xóa..." : "Xác nhận xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
