import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TabsContent } from "@/components/ui/tabs";
import { AddStudentForm, AddStudentValues } from "./AddStudentForm";
import { Room } from "@/interfaces/room";

type OccupantsTableProps = {
  room: Room;
  openStudentDialog: boolean;
  setOpenStudentDialog: (open: boolean) => void;
  isAddingStudent: boolean;
  onAddStudent: (values: AddStudentValues) => void;
};

export function OccupantsTable({
  room,
  openStudentDialog,
  setOpenStudentDialog,
  isAddingStudent,
  onAddStudent,
}: OccupantsTableProps) {
  return (
    <TabsContent value="occupants" className="mt-0">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MSSV</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Ngày vào</TableHead>
              <TableHead>Ngày hết hạn</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {room.users.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>
                  {/* {new Date(student.joinDate).toLocaleDateString("vi-VN")} */}
                </TableCell>
                <TableCell>
                  {/* {new Date(student.contractEnd).toLocaleDateString("vi-VN")} */}
                </TableCell>
                <TableCell>
                  <Link to={`/admin/students/${student.id}`}>
                    <Button variant="link" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {room.users.length < room.room_category?.capacity && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Dialog
                    open={openStudentDialog}
                    onOpenChange={setOpenStudentDialog}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm sinh viên
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Thêm sinh viên vào phòng</DialogTitle>
                        <DialogDescription>
                          Thêm sinh viên mới vào phòng {room.room_number}. Hiện
                          tại phòng có {room.users.length}/
                          {room.room_category.capacity} sinh viên.
                        </DialogDescription>
                      </DialogHeader>
                      <AddStudentForm
                        isAdding={isAddingStudent}
                        onSubmit={onAddStudent}
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
}
