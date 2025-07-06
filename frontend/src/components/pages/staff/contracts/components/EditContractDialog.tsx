import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contractSchema = z.object({
  studentId: z.string().min(1, { message: "Vui lòng nhập mã sinh viên" }),
  studentName: z.string().min(1, { message: "Vui lòng nhập tên sinh viên" }),
  studentPhone: z.string().min(1, { message: "Vui lòng nhập số điện thoại" }),
  studentEmail: z.string().email({ message: "Email không hợp lệ" }),
  roomId: z.string().min(1, { message: "Vui lòng chọn phòng" }),
  startDate: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  endDate: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
  }),
  monthlyFee: z.string().min(1, { message: "Vui lòng nhập phí hàng tháng" }),
  deposit: z.string().min(1, { message: "Vui lòng nhập tiền đặt cọc" }),
  status: z.enum(["active", "expired", "terminated"]),
});

type ContractFormValues = z.infer<typeof contractSchema>;

type EditContractDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: {
    id: string;
    studentId: string;
    studentName: string;
    studentPhone: string;
    studentEmail: string;
    roomId: string;
    roomName: string;
    startDate: string;
    endDate: string;
    monthlyFee: number;
    deposit: number;
    status: string;
  };
};

// Sample room data for dropdown
const roomsData = [
  { id: "101", name: "P101" },
  { id: "102", name: "P102" },
  { id: "201", name: "P201" },
  { id: "202", name: "P202" },
];

export function EditContractDialog({
  open,
  onOpenChange,
  contract,
}: EditContractDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      studentId: contract.studentId,
      studentName: contract.studentName,
      studentPhone: contract.studentPhone,
      studentEmail: contract.studentEmail,
      roomId: contract.roomId,
      startDate: new Date(contract.startDate),
      endDate: new Date(contract.endDate),
      monthlyFee: contract.monthlyFee.toString(),
      deposit: contract.deposit.toString(),
      status: contract.status as "active" | "expired" | "terminated",
    },
  });

  const onSubmit = (values: ContractFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Updating contract:", values);
      alert("Đã cập nhật hợp đồng thành công!");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hợp đồng {contract.id}</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin hợp đồng thuê phòng
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã sinh viên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã sinh viên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sinh viên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên sinh viên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomsData.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < (form.getValues("startDate") || new Date())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phí hàng tháng (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập phí hàng tháng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiền đặt cọc (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập tiền đặt cọc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Đang hiệu lực</SelectItem>
                      <SelectItem value="expired">Đã hết hạn</SelectItem>
                      <SelectItem value="terminated">Đã chấm dứt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
