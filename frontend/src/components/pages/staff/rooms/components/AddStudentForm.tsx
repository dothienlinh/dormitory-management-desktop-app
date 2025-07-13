import { CheckIcon, ChevronsUpDownIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { GetListUsers, AddStudentToRoom } from "wailsjs/go/app/App";
import { UserRole } from "@/enums/user";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { User as IUser } from "@/interfaces/user";
import { useParams } from "react-router-dom";

// Schema for adding a student to a room
const addStudentSchema = z.object({
  user_id: z.string().min(1, { message: "MSSV không được để trống" }),
});

export type AddStudentValues = z.infer<typeof addStudentSchema>;

interface AddStudentFormProps {
  setOpenStudentDialog: (open: boolean) => void;
}

export function AddStudentForm({ setOpenStudentDialog }: AddStudentFormProps) {
  const [openPopoverStudent, setOpenPopoverStudent] = useState(false);
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();

  const form = useForm<AddStudentValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      user_id: "",
    },
  });

  const {
    data: studentsData,
    fetchNextPage: fetchNextStudentsPage,
    hasNextPage: hasNextStudentsPage,
    isFetchingNextPage: isFetchingNextStudentsPage,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
  } = useInfiniteQuery({
    queryKey: ["students-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      GetListUsers(
        String(pageParam as number),
        "",
        "",
        "",
        "",
        "",
        UserRole.STUDENT,
        false
      ),
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

  const { ref: studentsRef, isThrottled: isStudentsThrottled } =
    useInfiniteScroll({
      hasNextPage: hasNextStudentsPage ?? false,
      isFetchingNextPage: isFetchingNextStudentsPage,
      fetchNextPage: fetchNextStudentsPage,
      enabled: openPopoverStudent,
      throttleDelay: 500,
    });

  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: (data: AddStudentValues) =>
      AddStudentToRoom(id ? id : "0", data.user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room", id],
      });
      form.reset();
      setOpenPopoverStudent(false);
    },
  });
  const allStudents = useMemo(
    () => studentsData?.pages.flatMap((page) => page?.ParsedBody.data) ?? [],
    [studentsData]
  );

  const handleStudentSelect = useCallback(
    (studentId: number) => {
      form.setValue("user_id", studentId.toString());
      setOpenPopoverStudent(false);
    },
    [form]
  );
  const onSubmit = (data: AddStudentValues) => {
    addStudent(data);
    setOpenStudentDialog(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang thêm...
            </>
          ) : (
            "Thêm sinh viên"
          )}
        </Button>
      </form>
    </Form>
  );
}
