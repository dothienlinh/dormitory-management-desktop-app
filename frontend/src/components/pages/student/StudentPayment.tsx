import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  BanknoteIcon,
  CheckCircle2,
  CreditCard,
  Download,
  Filter,
  FileText,
  Info,
  Receipt,
  Search,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

// Dữ liệu mẫu cho thanh toán
const paymentData = {
  currentBalance: 0,
  dueFee: 1650000,
  dueDate: "15/11/2023",
  roomFee: 850000,
  waterFee: 150000,
  electricityFee: 500000,
  internetFee: 50000,
  otherFees: 100000,
  transactions: [
    {
      id: "TRX001",
      date: "28/09/2023",
      amount: 1550000,
      type: "payment",
      method: "Banking",
      status: "completed",
      description: "Thanh toán phí tháng 10/2023",
    },
    {
      id: "TRX002",
      date: "01/10/2023",
      amount: 850000,
      type: "charge",
      status: "completed",
      description: "Phí phòng tháng 10/2023",
    },
    {
      id: "TRX003",
      date: "01/10/2023",
      amount: 700000,
      type: "charge",
      status: "completed",
      description: "Phí điện nước tháng 10/2023",
    },
    {
      id: "TRX004",
      date: "01/11/2023",
      amount: 850000,
      type: "charge",
      status: "pending",
      description: "Phí phòng tháng 11/2023",
      dueDate: "15/11/2023",
    },
    {
      id: "TRX005",
      date: "01/11/2023",
      amount: 800000,
      type: "charge",
      status: "pending",
      description: "Phí điện nước tháng 11/2023",
      dueDate: "15/11/2023",
    },
  ],
  paymentMethods: [
    {
      id: "banking",
      name: "Chuyển khoản ngân hàng",
      icon: <BanknoteIcon className="h-5 w-5" />,
      details: {
        bankName: "Vietcombank",
        accountNumber: "1234567890123",
        accountName: "TRUONG DAI HOC QUOC GIA HA NOI",
        description: "SV123456_THANG11",
      },
    },
    {
      id: "card",
      name: "Thẻ tín dụng/ghi nợ",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "momo",
      name: "Ví điện tử MoMo",
      icon: <Wallet className="h-5 w-5" />,
    },
  ],
};

// Schema cho form thanh toán
const paymentFormSchema = z.object({
  amount: z.string().min(1, { message: "Vui lòng nhập số tiền" }),
  paymentMethod: z.string({
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function StudentPayment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Lọc giao dịch theo bộ lọc
  const filteredTransactions = paymentData.transactions.filter(
    (transaction) => {
      // Lọc theo từ khóa
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Lọc theo trạng thái
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && transaction.status === "pending") ||
        (statusFilter === "completed" && transaction.status === "completed");

      return matchesSearch && matchesStatus;
    }
  );

  // Form thanh toán
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: paymentData.dueFee.toString(),
      paymentMethod: "",
    },
  });

  // Xử lý khi submit form thanh toán
  function onSubmit(data: PaymentFormValues) {
    console.log("Payment form submitted:", data);

    // Giả lập xử lý thanh toán
    setTimeout(() => {
      setIsPaymentSuccess(true);
    }, 1500);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thanh toán</h2>
          <p className="text-muted-foreground">
            Quản lý thanh toán phí KTX và lịch sử giao dịch
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin thanh toán */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Thông tin thanh toán
            </CardTitle>
            <CardDescription>
              Thông tin chi tiết về các khoản phí
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-semibold">Tổng phí cần thanh toán:</span>
              <span className="font-bold text-lg text-primary">
                {paymentData.dueFee.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Phí phòng ở:</span>
                <span>{paymentData.roomFee.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí nước:</span>
                <span>{paymentData.waterFee.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí điện:</span>
                <span>
                  {paymentData.electricityFee.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí internet:</span>
                <span>
                  {paymentData.internetFee.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí khác:</span>
                <span>{paymentData.otherFees.toLocaleString("vi-VN")} VNĐ</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-sm border-t">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                <span>Hạn thanh toán:</span>
              </div>
              <span className="font-medium text-red-500">
                {paymentData.dueDate}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={() => setIsPaymentDialogOpen(true)}
            >
              Thanh toán ngay
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/student/contract">
                <FileText className="mr-2 h-4 w-4" />
                Xem hợp đồng
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Lịch sử giao dịch */}
        <div className="md:col-span-2">
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">
                <Receipt className="mr-2 h-4 w-4" />
                Lịch sử giao dịch
              </TabsTrigger>
              <TabsTrigger value="payment-methods">
                <CreditCard className="mr-2 h-4 w-4" />
                Phương thức thanh toán
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử giao dịch</CardTitle>
                  <CardDescription>
                    Tất cả các giao dịch phí KTX của bạn
                  </CardDescription>

                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm giao dịch..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value)}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Lọc theo trạng thái" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả giao dịch</SelectItem>
                        <SelectItem value="pending">Chưa thanh toán</SelectItem>
                        <SelectItem value="completed">Đã thanh toán</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Số tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {transaction.date}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell
                              className={`text-right font-medium ${
                                transaction.type === "payment"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "payment" ? "+" : "-"}
                              {transaction.amount.toLocaleString("vi-VN")} VNĐ
                            </TableCell>
                            <TableCell>
                              {transaction.status === "completed" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  Hoàn thành
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700 border-amber-200"
                                >
                                  Chờ thanh toán
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="font-medium">
                              Không tìm thấy giao dịch
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Thử thay đổi bộ lọc hoặc tìm kiếm khác
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị {filteredTransactions.length} trong tổng số{" "}
                    {paymentData.transactions.length} giao dịch
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Xuất lịch sử
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment-methods" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                  <CardDescription>
                    Các phương thức thanh toán phí KTX được hỗ trợ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentData.paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="border rounded-md p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            {method.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{method.name}</h4>
                            {method.id === "banking" && method.details && (
                              <div className="mt-3 space-y-2 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Ngân hàng:
                                  </span>
                                  <span>{method.details.bankName}</span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Số tài khoản:
                                  </span>
                                  <span className="font-medium">
                                    {method.details.accountNumber}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Tên tài khoản:
                                  </span>
                                  <span>{method.details.accountName}</span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Nội dung:
                                  </span>
                                  <span className="font-medium">
                                    {method.details.description}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Info className="mr-2 h-4 w-4" />
                    <p>
                      Khi thanh toán qua chuyển khoản, vui lòng ghi rõ nội dung
                      theo hướng dẫn
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog thanh toán */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {isPaymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Thanh toán thành công!</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Cảm ơn bạn đã thanh toán phí KTX. Giao dịch của bạn đã được xử
                lý.
              </p>
              <Button
                onClick={() => {
                  setIsPaymentDialogOpen(false);
                  setIsPaymentSuccess(false);
                }}
              >
                Đóng
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Thanh toán phí KTX</DialogTitle>
                <DialogDescription>
                  Vui lòng chọn phương thức thanh toán và nhập thông tin
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tiền</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} />
                            <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                              VNĐ
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Số tiền cần thanh toán mặc định là tổng phí hiện tại
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Phương thức thanh toán</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {paymentData.paymentMethods.map((method) => (
                              <div
                                key={method.id}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={method.id}
                                  id={method.id}
                                />
                                <Label
                                  htmlFor={method.id}
                                  className="flex items-center"
                                >
                                  <div className="mr-2">{method.icon}</div>
                                  {method.name}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("paymentMethod") === "card" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số thẻ</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0000 0000 0000 0000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên chủ thẻ</FormLabel>
                            <FormControl>
                              <Input placeholder="NGUYEN VAN A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày hết hạn</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardCVC"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mã bảo mật</FormLabel>
                              <FormControl>
                                <Input placeholder="CVC" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full">
                      Hoàn tất thanh toán
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
