import { useNavigate } from "react-router-dom";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import {
  CreateRoom,
  GetListAmenities,
  GetListRoomCategories,
} from "wailsjs/go/app/App";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

const formSchema = z.object({
  roomNumber: z
    .string()
    .trim()
    .min(1, { message: "Trường này không được để trống" })
    .min(2, { message: "Mã phòng phải có ít nhất 2 ký tự" })
    .max(10, { message: "Mã phòng không được quá 10 ký tự" }),
  type: z.string().trim().min(1, { message: "Trường này không được để trống" }),
  status: z
    .string()
    .trim()
    .min(1, { message: "Trường này không được để trống" }),
  amenities: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRoom() {
  const navigate = useNavigate();

  const { data: amenities, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => GetListAmenities(1),
  });

  const { data: listRoomCategories, isLoading: isLoadingListRoomCategories } =
    useQuery({
      queryKey: ["roomCategories"],
      queryFn: () => GetListRoomCategories("1"),
    });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      CreateRoom({
        room_number: data.roomNumber,
        status: data.status,
        room_category_id: +data.type,
        amenity_ids: data.amenities || [],
      }),
    onSuccess: () => {
      navigate("/admin/rooms");
    },
    // onError: (error) => {},
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber: "",
      type: "",
      status: "",
      amenities: [],
    },
  });

  const type = useWatch({ control: form.control, name: "type" });

  function onSubmit(data: FormValues) {
    toast.promise(mutateAsync(data), {
      loading: "Đang tạo phòng mới...",
      success: "Tạo phòng mới thành công!",
      error: (err) => {
        const errorMessage = err?.message;
        return errorMessage;
      },
    });
  }
  const selectedCategory = listRoomCategories?.ParsedBody?.data.find(
    (item: { id: number }) => item.id === +type
  );

  if (isLoadingListRoomCategories || isLoadingAmenities) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <Icons.spinner className="h-20 w-20 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/rooms")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thêm phòng mới</h2>
          <p className="text-muted-foreground">
            Nhập thông tin chi tiết để thêm phòng mới vào hệ thống
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Thông tin phòng</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin phòng để thêm vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã phòng</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại phòng</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={`${field.value}`}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại phòng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {listRoomCategories?.ParsedBody?.data?.map(
                            (item: {
                              id: Key | null | undefined;
                              name:
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
                            }) => (
                              <SelectItem key={item.id} value={`${item.id}`}>
                                {item.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Sức chứa (người)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      value={selectedCategory?.capacity ?? 0}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Diện tích (m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      value={selectedCategory?.acreage ?? 0}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Giá thuê (VND/tháng)</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="number"
                      value={selectedCategory?.price ?? 0}
                    />
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Có sẵn</SelectItem>
                          <SelectItem value="occupied">Có người ở</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormItem>
                  <FormLabel>Mô tả phòng</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled
                      placeholder="Nhập mô tả chi tiết về phòng..."
                      className="min-h-32"
                      value={selectedCategory?.description ?? ""}
                    />
                  </FormControl>
                </FormItem>
              </div>

              <div>
                <FormLabel className="mb-2 block">Tiện nghi phòng</FormLabel>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {amenities?.ParsedBody?.data &&
                    amenities?.ParsedBody?.data.map(
                      (amenity: { id: number; name: string }) => (
                        <FormField
                          key={amenity.id}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => (
                            <FormItem
                              key={amenity.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([
                                          ...currentValues,
                                          amenity.id,
                                        ])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== amenity.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {amenity.name}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      )
                    )}
                </div>
              </div>

              <Separator />

              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/rooms")}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending} className="gap-1">
                  {isPending ? "Đang lưu..." : "Thêm phòng"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
