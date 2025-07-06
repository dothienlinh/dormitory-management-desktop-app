import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateVisitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateVisitorModal({
  open,
  onOpenChange,
}: CreateVisitorModalProps) {
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorId: "",
    purpose: "",
    visitingStudentName: "",
    visitingStudentRoom: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Đăng ký khách mới</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết về khách thăm
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="visitorName">Tên khách</Label>
              <Input
                id="visitorName"
                value={formData.visitorName}
                onChange={(e) =>
                  setFormData({ ...formData, visitorName: e.target.value })
                }
                placeholder="Nhập tên khách"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visitorId">CCCD/CMND</Label>
              <Input
                id="visitorId"
                value={formData.visitorId}
                onChange={(e) =>
                  setFormData({ ...formData, visitorId: e.target.value })
                }
                placeholder="Nhập số CCCD/CMND"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purpose">Mục đích thăm</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                placeholder="Nhập mục đích thăm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visitingStudentName">
                Tên sinh viên được thăm
              </Label>
              <Input
                id="visitingStudentName"
                value={formData.visitingStudentName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visitingStudentName: e.target.value,
                  })
                }
                placeholder="Nhập tên sinh viên được thăm (nếu có)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visitingStudentRoom">Phòng</Label>
              <Input
                id="visitingStudentRoom"
                value={formData.visitingStudentRoom}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visitingStudentRoom: e.target.value,
                  })
                }
                placeholder="Nhập số phòng sinh viên được thăm (nếu có)"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Đăng ký</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
