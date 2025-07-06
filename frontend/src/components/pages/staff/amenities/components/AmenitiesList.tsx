import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import EditAmenityDialog from "./EditAmenityDialog";
import DeleteAmenityDialog from "./DeleteAmenityDialog";
import { Amenity } from "@/interfaces/amenity";

type AmenitiesListProps = {
  amenities?: Amenity[];
};

export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead className="w-[120px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities?.map((amenity) => (
              <TableRow key={amenity.id}>
                <TableCell>{amenity.id}</TableCell>
                <TableCell>{amenity.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAmenity(amenity);
                        setOpenEditDialog(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAmenity(amenity);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedAmenity && openEditDialog && (
        <EditAmenityDialog
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          amenity={selectedAmenity}
        />
      )}

      {selectedAmenity && openDeleteDialog && (
        <DeleteAmenityDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          amenity={selectedAmenity}
        />
      )}
    </div>
  );
}
