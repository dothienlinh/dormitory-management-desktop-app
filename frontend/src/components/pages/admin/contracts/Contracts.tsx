import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Search, Filter, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ContractQueryParams } from "@/interfaces/contract";
import { getStatusColorContract, getStatusTextContract } from "@/utils/getText";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { ContractStatus } from "@/enums/contract";
import { useDebounce } from "use-debounce";
import { GetListContracts } from "wailsjs/go/app/App";

export default function Contracts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [searchTermDebounced] = useDebounce(searchTerm, 1000);
  const [statusFilter, setStatusFilter] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;

  const { data } = useQuery({
    queryKey: [
      "contracts",
      {
        page: currentPage,
        keyword: searchTermDebounced,
        status: statusFilter !== "all" ? statusFilter : undefined,
      } as ContractQueryParams,
    ],
    queryFn: (query) => {
      const [, params] = query.queryKey as [string, ContractQueryParams];
      return GetListContracts(params?.page || 1, params.keyword);
    },
  });

  const totalPage = data?.RawResponse?.Body?.total
    ? Math.ceil(data.RawResponse.Body.total / 10)
    : 0;

  const handleResetPage = () => {
    setSearchParams((searchParams) => {
      searchParams.set("page", "1");
      return searchParams;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý hợp đồng
          </h2>
          <p className="text-muted-foreground">
            Quản lý tất cả các hợp đồng thuê phòng ký túc xá
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate("/admin/contracts/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo hợp đồng mới
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng</CardTitle>
          <CardDescription>
            Tổng số {data?.RawResponse?.Body?.data.length} hợp đồng,{" "}
            {
              data?.RawResponse?.Body?.data.filter(
                (c: { status: ContractStatus }) =>
                  c.status === ContractStatus.ACTIVE
              ).length
            }{" "}
            đang hiệu lực,{" "}
            {
              data?.RawResponse?.Body?.data.filter(
                (c: { status: ContractStatus }) =>
                  c.status === ContractStatus.INACTIVE
              ).length
            }{" "}
            đã hết hạn,{" "}
            {
              data?.RawResponse?.Body?.data.filter(
                (c: { status: ContractStatus }) =>
                  c.status === ContractStatus.CANCELLED
              ).length
            }{" "}
            đã chấm dứt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo sinh viên, phòng, mã hợp đồng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  handleResetPage();
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={ContractStatus.ACTIVE}>
                    Đang hiệu lực
                  </SelectItem>
                  <SelectItem value={ContractStatus.INACTIVE}>
                    Đã hết hạn
                  </SelectItem>
                  <SelectItem value={ContractStatus.CANCELLED}>
                    Đã chấm dứt
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hợp đồng</TableHead>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Giá thuê (VND)</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.RawResponse?.Body?.data &&
                data?.RawResponse?.Body?.data.length > 0 ? (
                  data.RawResponse.Body.data.map(
                    (contract: {
                      id: Key | null | undefined;
                      code:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      user_id: any;
                      user: {
                        full_name:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      };
                      room: {
                        id: any;
                        room_number:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      };
                      start_date: string | number | Date;
                      end_date: string | number | Date;
                      price: {
                        toLocaleString: () =>
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      };
                      status: string;
                      created_at: string | number | Date;
                    }) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          {contract.code}
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/admin/students/${contract.user_id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contract.user.full_name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/admin/rooms/${contract.room.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contract.room.room_number}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs">
                              Từ:{" "}
                              {new Date(contract.start_date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                            <span className="text-xs">
                              Đến:{" "}
                              {new Date(contract.end_date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{contract.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColorContract(contract.status)}
                          >
                            {getStatusTextContract(contract.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(contract.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell>
                          <Link to={`/admin/contracts/${contract.id}`}>
                            <Button variant="link" size="sm">
                              Chi tiết
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không tìm thấy kết quả nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            {totalPage > 1 && status !== "pending" && (
              <PaginationWithLinks
                page={+currentPage}
                totalCount={data?.RawResponse?.Body?.total ?? 0}
                pageSearchParam="page"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
