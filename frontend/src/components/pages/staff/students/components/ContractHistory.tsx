import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type Contract = {
  id: string;
  roomName: string;
  startDate: string;
  endDate: string;
  status: string;
  monthlyFee: number;
};

type ContractHistoryProps = {
  contracts: Contract[];
  studentName: string;
};

const contractSchema = z.object({
  roomName: z.string().min(1, { message: "Vui lòng nhập tên phòng" }),
  startDate: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  endDate: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
  }),
  monthlyFee: z.string().min(1, { message: "Vui lòng nhập phí hàng tháng" }),
});

type ContractFormValues = z.infer<typeof contractSchema>;

export function ContractHistory({
  contracts,
  studentName,
}: ContractHistoryProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      roomName: "",
      monthlyFee: "",
    },
  });

  const onSubmit = (values: ContractFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Creating new contract:", values);
      alert(`Đã tạo hợp đồng mới cho sinh viên ${studentName}!`);
      setIsSubmitting(false);
      setOpenDialog(false);
      form.reset();
    }, 1500);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Lịch sử hợp đồng</h3>
        <Button variant="outline" size="sm" onClick={() => setOpenDialog(true)}>
          <FileText className="mr-2 h-4 w-4" /> Tạo hợp đồng mới
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phòng</TableHead>
              <TableHead>Từ ngày</TableHead>
              <TableHead>Đến ngày</TableHead>
              <TableHead>Giá thuê</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.roomName}</TableCell>
                <TableCell>
                  {new Date(contract.startDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {new Date(contract.endDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {contract.monthlyFee.toLocaleString()} VND
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      contract.status === "active"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {contract.status === "active"
                      ? "Đang hiệu lực"
                      : "Đã kết thúc"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="link" size="sm">
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo hợp đồng mới</DialogTitle>
            <DialogDescription>
              Thêm hợp đồng mới cho sinh viên {studentName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên phòng" {...field} />
                    </FormControl>
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
                          disabled={(date) => date < new Date()}
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

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo hợp đồng"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
