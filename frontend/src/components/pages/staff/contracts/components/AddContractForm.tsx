import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { UserRole } from "@/enums/user";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { CreateContract as ICreateContract } from "@/interfaces/contract";
import { Room } from "@/interfaces/room";
import { User } from "@/interfaces/user";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  Loader2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateContract, GetListRooms, GetListUsers } from "wailsjs/go/app/App";
import { z } from "zod";

const contractSchema = z
  .object({
    studentId: z.string().min(1, { message: "Vui lòng nhập mã sinh viên" }),
    roomId: z.number().min(1, { message: "Vui lòng chọn phòng" }),
    startDate: z.date({
      required_error: "Vui lòng chọn ngày bắt đầu",
    }),
    endDate: z.date({
      required_error: "Vui lòng chọn ngày kết thúc",
    }),
    monthlyFee: z
      .string()
      .min(1, { message: "Vui lòng nhập phí hàng tháng" })
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Phí hàng tháng phải là số dương",
      }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  });

interface AddContractFormProps {
  onOpenChange: (open: boolean) => void;
}

type ContractFormValues = z.infer<typeof contractSchema>;

export function AddContractForm({ onOpenChange }: AddContractFormProps) {
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
    queryFn: ({ pageParam = 1 }) => {
      console.log(`🔍 Fetching students page: ${pageParam}`);
      return GetListUsers(
        String(pageParam as number),
        "",
        "",
        "",
        "",
        "",
        UserRole.STUDENT
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage?.ParsedBody.data.length >= 10;
      const nextPage = hasMore ? allPages.length + 1 : undefined;
      console.log(`📄 Students getNextPageParam:`, {
        currentItems: lastPage?.ParsedBody.data.length,
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
    queryFn: ({ pageParam = 1 }) => {
      console.log(`🏠 Fetching rooms page: ${pageParam}`);
      return GetListRooms(String(pageParam as number));
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage?.ParsedBody.data.length >= 10;
      const nextPage = hasMore ? allPages.length + 1 : undefined;
      console.log(`📄 Rooms getNextPageParam:`, {
        currentItems: lastPage?.ParsedBody.data.length,
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
    () => studentsData?.pages.flatMap((page) => page?.ParsedBody.data) ?? [],
    [studentsData]
  );

  const allRooms = useMemo(
    () => roomsData?.pages.flatMap((page) => page?.ParsedBody.data) ?? [],
    [roomsData]
  );

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      studentId: "",
      roomId: 0,
      monthlyFee: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ICreateContract) => CreateContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contracts"],
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {},
  });

  const onSubmit = useCallback(
    (data: ContractFormValues) => {
      const formattedData: ICreateContract = {
        user_id: +data.studentId,
        room_id: +data.roomId,
        start_date: data.startDate,
        end_date: data.endDate,
        price: +data.monthlyFee,
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
    (studentId: string) => {
      form.setValue("studentId", studentId);
      setOpenPopoverStudent(false);
    },
    [form]
  );

  const handleRoomSelect = useCallback(
    (roomId: number) => {
      form.setValue("roomId", roomId);
      setOpenPopoverRoom(false);
    },
    [form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
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
                    {allStudents.find((student) => student.id === +field.value)
                      ?.full_name || "Chọn sinh viên..."}
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
                              {allStudents.map((student: User) => (
                                <CommandItem
                                  key={student.id}
                                  value={student.full_name}
                                  onSelect={() =>
                                    handleStudentSelect(student.id.toString())
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
                                  isFetching={isFetchingNextStudentsPage}
                                  isThrottled={isStudentsThrottled}
                                  hasNextPage={hasNextStudentsPage ?? false}
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

        <FormField
          control={form.control}
          name="roomId"
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
                                  onSelect={() => handleRoomSelect(room.id)}
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
                                    <span>Phòng {room.room_number}</span>
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
                                  hasNextPage={hasNextRoomsPage ?? false}
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
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
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
                    disabled={(date) => {
                      const startDate = form.getValues("startDate");
                      return (
                        date <
                        (startDate || new Date(new Date().setHours(0, 0, 0, 0)))
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
          name="monthlyFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phí hàng tháng (VND)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập phí hàng tháng"
                  min="0"
                  step="1000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
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
  );
}
