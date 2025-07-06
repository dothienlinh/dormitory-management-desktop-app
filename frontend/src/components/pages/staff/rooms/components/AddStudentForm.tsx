import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Schema for adding a student to a room
const addStudentSchema = z.object({
  studentId: z.string().min(5, { message: "MSSV phải có ít nhất 5 ký tự" }),
  name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  joinDate: z.date({
    required_error: "Vui lòng chọn ngày vào",
  }),
  contractEnd: z.date({
    required_error: "Vui lòng chọn ngày hết hạn",
  }),
});

export type AddStudentValues = z.infer<typeof addStudentSchema>;

type AddStudentFormProps = {
  isAdding: boolean;
  onSubmit: (values: AddStudentValues) => void;
};

export function AddStudentForm({ isAdding, onSubmit }: AddStudentFormProps) {
  const form = useForm<AddStudentValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      studentId: "",
      name: "",
      joinDate: new Date(),
      contractEnd: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã số sinh viên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập MSSV" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ tên sinh viên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày vào</FormLabel>
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
            name="contractEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày hết hạn</FormLabel>
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
        </div>
        <Button type="submit" disabled={isAdding}>
          {isAdding ? (
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
