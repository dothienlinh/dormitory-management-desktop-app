import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RoomStatus } from "@/enums/rooms";
import { useNavigate } from "react-router-dom";
import { Amenity } from "@/interfaces/amenity";
import { Room, RoomCategory } from "@/interfaces/room";
import { UpdateRoom } from "wailsjs/go/app/App";

interface EditRoomFormProps {
  room: Room;
  listRoomCategories: RoomCategory[];
  amenities: Amenity[];
  id: number;
}

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

export default function EditRoomForm({
  room,
  listRoomCategories,
  amenities,
  id,
}: EditRoomFormProps) {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber: room.room_number || "",
      type: room.room_category_id?.toString() || "",
      status: room.status || "",
      amenities: room.room_amenities?.map((a) => a.amenity_id) || [],
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      UpdateRoom(id ? String(id) : "0", {
        room_number: data.roomNumber,
        status: data.status,
        room_category_id: +data.type,
        amenity_ids: data.amenities ?? [],
      }),
    onSuccess: () => {
      navigate("/staff/rooms");
    },
    // onError: (error) => {},
  });

  const type = useWatch({ control: form.control, name: "type" });

  const selectedCategory = listRoomCategories?.find(
    (item) => item.id === +type
  );

  function onSubmit(data: FormValues) {
    toast.promise(mutateAsync(data), {
      loading: "Đang cập nhật phòng...",
      success: "Cập nhật phòng thành công!",
      error: (err) => {
        const errorMessage = err?.message;
        return errorMessage;
      },
    });
  }

  return (
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
                  <Input
                    placeholder="Ví dụ: 101"
                    {...field}
                    value={field.value || ""}
                  />
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
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listRoomCategories?.map((item) => (
                      <SelectItem key={item.id} value={`${item.id}`}>
                        {item.name}
                      </SelectItem>
                    ))}
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
                readOnly
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
                readOnly
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
                readOnly
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
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={RoomStatus.AVAILABLE}>Có sẵn</SelectItem>
                    <SelectItem value={RoomStatus.OCCUPIED}>
                      Có người ở
                    </SelectItem>
                    <SelectItem value={RoomStatus.MAINTENANCE}>
                      Bảo trì
                    </SelectItem>
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
                readOnly
              />
            </FormControl>
          </FormItem>
        </div>

        <div>
          <FormLabel className="mb-2 block">Tiện nghi phòng</FormLabel>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {amenities &&
              amenities?.map((amenity) => (
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
                          checked={field.value?.includes(amenity.id) || false}
                          onCheckedChange={(checked) => {
                            console.log(field.value);
                            const currentValues = field.value ?? [];
                            return checked
                              ? field.onChange([...currentValues, amenity.id])
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
              ))}
          </div>
        </div>

        <Separator />

        <CardFooter className="flex justify-between px-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/staff/rooms")}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="gap-1"
          >
            {isPending ? "Đang lưu..." : "Cập nhật phòng"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
