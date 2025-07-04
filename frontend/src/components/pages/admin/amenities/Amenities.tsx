import { useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AmenitiesList from "./components/AmenitiesList";
import AddAmenityDialog from "./components/AddAmenityDialog";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";
import { GetListAmenities } from "wailsjs/go/app/App";

export default function Amenities() {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const { data: amenities, isLoading } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => GetListAmenities(1),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.spinner className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tiện nghi</h2>
          <p className="text-muted-foreground">Quản lý tiện nghi</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setOpenAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo tiện nghi mới
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tiện nghi</CardTitle>
          <CardDescription>
            Quản lý các tiện nghi trong ký túc xá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AmenitiesList amenities={amenities?.Body.data} />
        </CardContent>
      </Card>

      <AddAmenityDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
    </div>
  );
}
