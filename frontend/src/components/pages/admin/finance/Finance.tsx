import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowUpRight,
  Wallet,
  DollarSign,
  Users,
  Building,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample financial data
const financialOverview = {
  totalRevenue: 150000000,
  pendingPayments: 12000000,
  totalExpenses: 35000000,
  netIncome: 115000000,
  studentCount: 450,
  occupancyRate: 82, // percentage
  collectRate: 92, // percentage
};

// Sample monthly data
const monthlyData = [
  {
    name: "T1/2023",
    revenue: 12000000,
    expenses: 3000000,
  },
  {
    name: "T2/2023",
    revenue: 12500000,
    expenses: 2800000,
  },
  {
    name: "T3/2023",
    revenue: 12300000,
    expenses: 3200000,
  },
  {
    name: "T4/2023",
    revenue: 12200000,
    expenses: 2700000,
  },
  {
    name: "T5/2023",
    revenue: 12100000,
    expenses: 2900000,
  },
  {
    name: "T6/2023",
    revenue: 12400000,
    expenses: 3100000,
  },
  {
    name: "T7/2023",
    revenue: 12600000,
    expenses: 3300000,
  },
  {
    name: "T8/2023",
    revenue: 12700000,
    expenses: 3500000,
  },
  {
    name: "T9/2023",
    revenue: 12900000,
    expenses: 3200000,
  },
  {
    name: "T10/2023",
    revenue: 12800000,
    expenses: 3100000,
  },
  {
    name: "T11/2023",
    revenue: 12700000,
    expenses: 2800000,
  },
  {
    name: "T12/2023",
    revenue: 12700000,
    expenses: 3400000,
  },
];

// Sample revenue breakdown data
const revenueBreakdown = [
  { name: "Phí thuê phòng", value: 85 },
  { name: "Dịch vụ thêm", value: 10 },
  { name: "Phạt vi phạm", value: 3 },
  { name: "Khác", value: 2 },
];

// Sample expense breakdown data
const expenseBreakdown = [
  { name: "Bảo trì", value: 40 },
  { name: "Tiện ích", value: 25 },
  { name: "Nhân viên", value: 20 },
  { name: "Hành chính", value: 10 },
  { name: "Khác", value: 5 },
];

// Colors for pie charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A259FF"];

export default function Finance() {
  const [period, setPeriod] = useState("yearly");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý tài chính
          </h2>
          <p className="text-muted-foreground">
            Tổng quan và quản lý tài chính ký túc xá
          </p>
        </div>
      </div>

      {/* Financial overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialOverview.totalRevenue.toLocaleString()} VND
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +5.5%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chờ thanh toán
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialOverview.pendingPayments.toLocaleString()} VND
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +2.3%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialOverview.occupancyRate}%
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${financialOverview.occupancyRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ thu phí</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialOverview.collectRate}%
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${financialOverview.collectRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Doanh thu & Chi phí</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Theo tháng</SelectItem>
                  <SelectItem value="quarterly">Theo quý</SelectItem>
                  <SelectItem value="yearly">Theo năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()} VND`]}
                    labelFormatter={(label) => `Tháng ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Doanh thu" fill="#0088FE" />
                  <Bar dataKey="expenses" name="Chi phí" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <Tabs defaultValue="revenue">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Phân tích</CardTitle>
              <TabsList className="grid w-full max-w-[250px] grid-cols-2">
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                <TabsTrigger value="expenses">Chi phí</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="revenue" className="h-[250px] mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBreakdown.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="expenses" className="h-[250px] mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseBreakdown.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng quan tài chính</CardTitle>
            <CardDescription>Số liệu tổng hợp cho năm 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tổng thu:</span>
                <span className="font-medium">
                  {financialOverview.totalRevenue.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tổng chi:</span>
                <span className="font-medium">
                  {financialOverview.totalExpenses.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Còn phải thu:
                </span>
                <span className="font-medium">
                  {financialOverview.pendingPayments.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Lợi nhuận ròng:
                </span>
                <span className="font-medium">
                  {financialOverview.netIncome.toLocaleString()} VND
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Link
                to="/admin/finance/invoices"
                className="flex items-center w-full justify-center"
              >
                Quản lý hóa đơn
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
