import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingIndicator from "@/components/ui/loading-indicator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
// import { Gender, UserRole, UserStatus } from "@/enums";
// import { RoomStatus } from "@/enums/rooms";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { CreateContract as ICreateContract } from "@/interfaces/contract";
import { Room } from "@/interfaces/room";
import {
  User as IUser,
  // User as UserType
} from "@/interfaces/user";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import {
  // BanknoteIcon,
  Building,
  CalendarDays,
  CalendarIcon,
  CheckIcon,
  ChevronLeft,
  ChevronsUpDownIcon,
  Save,
  // Search,
  User,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { GetListUsers, GetListRooms, CreateContract } from "wailsjs/go/app/App";

const contractSchema = z.object({
  user_id: z.number({
    required_error: "Vui lòng chọn sinh viên",
  }),
  room_id: z.number({
    required_error: "Vui lòng chọn phòng",
  }),
  start_date: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  end_date: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
  }),
  price: z
    .number({
      required_error: "Vui lòng nhập giá thuê",
    })
    .min(0, "Giá thuê phải lớn hơn 0"),
  description: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

export default function AddContracts() {
  const navigate = useNavigate();
  const [openPopoverStudent, setOpenPopoverStudent] = useState(false);
  const [openPopoverRoom, setOpenPopoverRoom] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: studentsData,
    fetchNextPage: fetchNextStudentsPage,
    hasNextPage: hasNextStudentsPage,
    isFetchingNextPage: isFetchingNextStudentsPage,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
  } = useInfiniteQuery({
    queryKey: ["students-infinite"],
    queryFn: ({ pageParam = 1 }) => GetListUsers(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.RawResponse?.Body?.data.length >= 10;
      const nextPage = hasMore ? allPages.length + 1 : undefined;
      console.log(`📄 Students getNextPageParam:`, {
        currentItems: lastPage.RawResponse?.Body?.data.length,
        totalPages: allPages.length,
        nextPage,
      });
      return nextPage;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const {
    data: roomsData,
    fetchNextPage: fetchNextRoomsPage,
    hasNextPage: hasNextRoomsPage,
    isFetchingNextPage: isFetchingNextRoomsPage,
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useInfiniteQuery({
    queryKey: ["rooms-infinite"],
    queryFn: ({ pageParam = 1 }) => GetListRooms(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.RawResponse?.Body?.data.length >= 10;
      const nextPage = hasMore ? allPages.length + 1 : undefined;
      console.log(`📄 Rooms getNextPageParam:`, {
        currentItems: lastPage.RawResponse?.Body?.data.length,
        totalPages: allPages.length,
        nextPage,
      });
      return nextPage;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { ref: studentsRef, isThrottled: isStudentsThrottled } =
    useInfiniteScroll({
      hasNextPage: hasNextStudentsPage ?? false,
      isFetchingNextPage: isFetchingNextStudentsPage,
      fetchNextPage: fetchNextStudentsPage,
      enabled: openPopoverStudent,
      throttleDelay: 500,
    });

  const { ref: roomsRef, isThrottled: isRoomsThrottled } = useInfiniteScroll({
    hasNextPage: hasNextRoomsPage ?? false,
    isFetchingNextPage: isFetchingNextRoomsPage,
    fetchNextPage: fetchNextRoomsPage,
    enabled: openPopoverRoom,
    throttleDelay: 500,
  });

  const allStudents = useMemo(
    () =>
      studentsData?.pages.flatMap((page) => page.RawResponse?.Body?.data) ?? [],
    [studentsData]
  );

  const allRooms = useMemo(
    () =>
      roomsData?.pages.flatMap((page) => page.RawResponse?.Body?.data) ?? [],
    [roomsData]
  );

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      user_id: 0,
      room_id: 0,
      price: 0,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ICreateContract) => CreateContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contracts"],
      });
      form.reset();
    },
    onError: () => {},
  });

  const onSubmit = useCallback(
    (data: ContractFormData) => {
      const formattedData: ICreateContract = {
        user_id: +data.user_id,
        room_id: +data.room_id,
        start_date: data.start_date,
        end_date: data.end_date,
        price: +data.price,
      };

      toast.promise(mutateAsync(formattedData), {
        loading: "Đang tạo hợp đồng...",
        success: "Tạo hợp đồng thành công!",
        error: (err) => {
          const errorMessage = err?.message;
          return errorMessage;
        },
      });
    },
    [mutateAsync]
  );

  const handleStudentSelect = useCallback(
    (studentId: number) => {
      form.setValue("user_id", studentId);
      setOpenPopoverStudent(false);
    },
    [form]
  );

  const handleRoomSelect = useCallback(
    (roomId: number) => {
      form.setValue("room_id", roomId);
      setOpenPopoverRoom(false);
    },
    [form]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/contracts")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Tạo hợp đồng mới
          </h2>
          <p className="text-muted-foreground">
            Tạo hợp đồng thuê phòng cho sinh viên
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Chọn sinh viên
                </CardTitle>
                <CardDescription>
                  Tìm kiếm và chọn sinh viên để tạo hợp đồng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sinh viên</FormLabel>
                      <Popover
                        open={openPopoverStudent}
                        onOpenChange={setOpenPopoverStudent}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPopoverStudent}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {allStudents.find(
                              (student) => student.id === +field.value
                            )?.full_name || "Chọn sinh viên..."}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Tìm kiếm sinh viên..." />
                            <CommandList>
                              <CommandEmpty>
                                {isLoadingStudents
                                  ? "Đang tải danh sách sinh viên..."
                                  : isStudentsError
                                  ? "Lỗi tải dữ liệu sinh viên"
                                  : "Không tìm thấy sinh viên."}
                              </CommandEmpty>
                              <ScrollArea className="h-48 overflow-auto">
                                <CommandGroup>
                                  {isStudentsError ? (
                                    <div className="p-2 text-sm text-red-500 text-center">
                                      <p>Không thể tải danh sách sinh viên</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          queryClient.invalidateQueries({
                                            queryKey: ["students-infinite"],
                                          })
                                        }
                                        className="mt-1"
                                      >
                                        Thử lại
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      {allStudents.map((student: IUser) => (
                                        <CommandItem
                                          key={student.id}
                                          value={student.full_name}
                                          onSelect={() =>
                                            handleStudentSelect(student.id)
                                          }
                                        >
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              +field.value === student.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          <div className="flex flex-col">
                                            <span>{student.full_name}</span>
                                            {student.email && (
                                              <span className="text-xs text-muted-foreground">
                                                {student.email}
                                              </span>
                                            )}
                                          </div>
                                        </CommandItem>
                                      ))}

                                      <div ref={studentsRef}>
                                        <LoadingIndicator
                                          isFetching={
                                            isFetchingNextStudentsPage
                                          }
                                          isThrottled={isStudentsThrottled}
                                          hasNextPage={
                                            hasNextStudentsPage ?? false
                                          }
                                          onLoadMore={fetchNextStudentsPage}
                                        />
                                      </div>
                                    </>
                                  )}
                                </CommandGroup>
                              </ScrollArea>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Room Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Chọn phòng
                </CardTitle>
                <CardDescription>
                  Chọn phòng trống cho sinh viên
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phòng</FormLabel>
                      <Popover
                        open={openPopoverRoom}
                        onOpenChange={setOpenPopoverRoom}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPopoverRoom}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {allRooms.find((room) => room.id === +field.value)
                              ?.room_number || "Chọn phòng..."}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Tìm kiếm phòng..." />
                            <CommandList>
                              <CommandEmpty>
                                {isLoadingRooms
                                  ? "Đang tải danh sách phòng..."
                                  : isRoomsError
                                  ? "Lỗi tải dữ liệu phòng"
                                  : "Không tìm thấy phòng."}
                              </CommandEmpty>
                              <ScrollArea className="h-48 overflow-auto">
                                <CommandGroup>
                                  {isRoomsError ? (
                                    <div className="p-2 text-sm text-red-500 text-center">
                                      <p>Không thể tải danh sách phòng</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          queryClient.invalidateQueries({
                                            queryKey: ["rooms-infinite"],
                                          })
                                        }
                                        className="mt-1"
                                      >
                                        Thử lại
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      {allRooms.map((room: Room) => (
                                        <CommandItem
                                          key={room.id}
                                          value={room.room_number}
                                          onSelect={() =>
                                            handleRoomSelect(room.id)
                                          }
                                        >
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              +field.value === room.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          <div className="flex flex-col">
                                            <span>
                                              Phòng {room.room_number}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              Có {room.user_count} người
                                            </span>
                                          </div>
                                        </CommandItem>
                                      ))}

                                      <div ref={roomsRef}>
                                        <LoadingIndicator
                                          isFetching={isFetchingNextRoomsPage}
                                          isThrottled={isRoomsThrottled}
                                          hasNextPage={
                                            hasNextRoomsPage ?? false
                                          }
                                          onLoadMore={fetchNextRoomsPage}
                                        />
                                      </div>
                                    </>
                                  )}
                                </CommandGroup>
                              </ScrollArea>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Thông tin hợp đồng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="start_date"
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
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
                      name="end_date"
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate =
                                    form.getValues("start_date");
                                  return (
                                    date <
                                    (startDate ||
                                      new Date(new Date().setHours(0, 0, 0, 0)))
                                  );
                                }}
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
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá thuê hàng tháng (VND)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1500000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú (tuỳ chọn)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập ghi chú cho hợp đồng..."
                              className="h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contract Summary */}
                    {/* {startDate && endDate && price && (
                      <div className="rounded-lg border p-4 space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <BanknoteIcon className="h-4 w-4" />
                          Tóm tắt hợp đồng
                        </h4>
                        <Separator />
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Thời gian:
                            </span>
                            <span>{getContractDuration()} tháng</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Giá thuê/tháng:
                            </span>
                            <span>{price.toLocaleString()} VND</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Tổng giá trị hợp đồng:</span>
                            <span className="text-primary">
                              {getTotalAmount().toLocaleString()} VND
                            </span>
                          </div>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/contracts")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              <Save className="mr-2 h-4 w-4" />
              {isPending ? "Đang tạo..." : "Tạo hợp đồng"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
