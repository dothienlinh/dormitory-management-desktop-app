import { useState } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DisciplinaryRecord = {
  id: string;
  date: string;
  description: string;
  action: string;
};

type DisciplinaryRecordsProps = {
  records: DisciplinaryRecord[];
  studentName: string;
};

const disciplinarySchema = z.object({
  date: z.date({
    required_error: "Vui lòng chọn ngày vi phạm",
  }),
  description: z.string().min(1, { message: "Vui lòng nhập mô tả vi phạm" }),
  action: z.string().min(1, { message: "Vui lòng nhập biện pháp xử lý" }),
});

type DisciplinaryFormValues = z.infer<typeof disciplinarySchema>;

export function DisciplinaryRecords({
  records,
  studentName,
}: DisciplinaryRecordsProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DisciplinaryFormValues>({
    resolver: zodResolver(disciplinarySchema),
    defaultValues: {
      description: "",
      action: "",
    },
  });

  const onSubmit = (values: DisciplinaryFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Adding new disciplinary record:", values);
      alert(`Đã thêm biên bản kỷ luật mới cho sinh viên ${studentName}!`);
      setIsSubmitting(false);
      setOpenDialog(false);
      form.reset();
    }, 1500);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Hồ sơ kỷ luật</h3>
        <Button variant="outline" size="sm" onClick={() => setOpenDialog(true)}>
          <span className="mr-2">+</span> Thêm biên bản
        </Button>
      </div>

      {records.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Biện pháp xử lý</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.action}</TableCell>
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
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-medium">Không có biên bản kỷ luật</h3>
          <p className="text-sm text-muted-foreground">
            Sinh viên chưa có biên bản kỷ luật nào
          </p>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm biên bản kỷ luật</DialogTitle>
            <DialogDescription>
              Thêm biên bản kỷ luật mới cho sinh viên {studentName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày vi phạm</FormLabel>
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
                          disabled={(date) => date > new Date()}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả vi phạm</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả chi tiết về vi phạm"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biện pháp xử lý</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập biện pháp xử lý" {...field} />
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
                    "Thêm biên bản"
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
