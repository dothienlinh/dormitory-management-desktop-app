import { Wrench } from "lucide-react";
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
import { AddMaintenanceForm } from "./AddMaintenanceForm";
import { Room } from "@/interfaces/room";

type MaintenanceTableProps = {
  room: Room;
  openMaintenanceDialog: boolean;
  setOpenMaintenanceDialog: (open: boolean) => void;
};

export function MaintenanceTable({
  room,
  openMaintenanceDialog,
  setOpenMaintenanceDialog,
}: MaintenanceTableProps) {
  return (
    <TabsContent value="maintenance" className="mt-0">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Chi phí</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {room.maintenance_histories.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell>
                  {new Date(maintenance.maintenance_date).toLocaleDateString(
                    "vi-VN"
                  )}
                </TableCell>
                <TableCell>{maintenance.description}</TableCell>
                <TableCell>{maintenance.cost.toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <Dialog
                  open={openMaintenanceDialog}
                  onOpenChange={setOpenMaintenanceDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2">
                      <Wrench className="mr-2 h-4 w-4" />
                      Thêm lịch sử bảo trì
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Thêm lịch sử bảo trì</DialogTitle>
                      <DialogDescription>
                        Thêm thông tin về hoạt động bảo trì phòng{" "}
                        {room.room_number}.
                      </DialogDescription>
                    </DialogHeader>
                    <AddMaintenanceForm
                      setOpenMaintenanceDialog={setOpenMaintenanceDialog}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
}
