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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CreateIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateIncidentModal({
  open,
  onOpenChange,
}: CreateIncidentModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    severity: "",
    location: "",
    involvedStudents: "",
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
            <DialogTitle>Báo cáo sự cố mới</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết về sự cố an ninh mới
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Nhập tiêu đề sự cố"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về sự cố"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Loại sự cố</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại sự cố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curfew">
                      Vi phạm giờ giới nghiêm
                    </SelectItem>
                    <SelectItem value="theft">Trộm cắp</SelectItem>
                    <SelectItem value="noise">Gây ồn ào</SelectItem>
                    <SelectItem value="fire_hazard">Nguy cơ cháy nổ</SelectItem>
                    <SelectItem value="trespassing">
                      Xâm nhập trái phép
                    </SelectItem>
                    <SelectItem value="rule_violation">
                      Vi phạm nội quy
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Mức độ nghiêm trọng</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, severity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Địa điểm</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Nhập địa điểm xảy ra sự cố"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="involvedStudents">Sinh viên liên quan</Label>
              <Input
                id="involvedStudents"
                value={formData.involvedStudents}
                onChange={(e) =>
                  setFormData({ ...formData, involvedStudents: e.target.value })
                }
                placeholder="Nhập tên sinh viên liên quan (phân cách bằng dấu phẩy)"
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
            <Button type="submit">Tạo báo cáo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
