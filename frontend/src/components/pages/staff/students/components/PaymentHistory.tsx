import { useState } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
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

type Payment = {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string;
  status: string;
};

type PaymentHistoryProps = {
  payments: Payment[];
  studentName: string;
};

const paymentSchema = z.object({
  date: z.date({
    required_error: "Vui lòng chọn ngày thanh toán",
  }),
  amount: z.string().min(1, { message: "Vui lòng nhập số tiền" }),
  type: z.string({
    required_error: "Vui lòng chọn loại thanh toán",
  }),
  description: z.string().min(1, { message: "Vui lòng nhập mô tả" }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

// Get payment status text in Vietnamese
const getPaymentStatusText = (status: string) => {
  switch (status) {
    case "paid":
      return "Đã thanh toán";
    case "pending":
      return "Chưa thanh toán";
    case "overdue":
      return "Quá hạn";
    default:
      return status;
  }
};

export function PaymentHistory({ payments, studentName }: PaymentHistoryProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const onSubmit = (values: PaymentFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Adding new payment:", values);
      alert(`Đã thêm thanh toán mới cho sinh viên ${studentName}!`);
      setIsSubmitting(false);
      setOpenDialog(false);
      form.reset();
    }, 1500);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Lịch sử thanh toán</h3>
        <Button variant="outline" size="sm" onClick={() => setOpenDialog(true)}>
          <span className="mr-2">+</span> Thêm thanh toán
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.date).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell>{payment.amount.toLocaleString()} VND</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {payment.status === "paid" ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    {getPaymentStatusText(payment.status)}
                  </div>
                </TableCell>
                <TableCell>
                  {payment.status === "pending" && (
                    <Button variant="outline" size="sm">
                      Thanh toán
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm thanh toán mới</DialogTitle>
            <DialogDescription>
              Thêm khoản thanh toán mới cho sinh viên {studentName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày thanh toán</FormLabel>
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại thanh toán</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại thanh toán" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly_fee">
                          Phí thuê phòng
                        </SelectItem>
                        <SelectItem value="deposit">Đặt cọc</SelectItem>
                        <SelectItem value="service_fee">Phí dịch vụ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số tiền"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mô tả khoản thanh toán"
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
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm thanh toán"
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
