import { Loader2 } from "lucide-react";
import { Button } from "./button";

const LoadingIndicator = ({
  isFetching,
  isThrottled,
  hasNextPage,
  onLoadMore,
}: {
  isFetching: boolean;
  isThrottled: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}) => {
  if (!hasNextPage) return null;

  return (
    <div className="flex flex-col items-center p-2 space-y-1">
      {isFetching || isThrottled ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs text-muted-foreground">
            {isThrottled ? "Đang tải..." : "Đang tải thêm..."}
          </span>
        </>
      ) : (
        <Button variant="ghost" size="sm" onClick={onLoadMore} type="button">
          Tải thêm...
        </Button>
      )}
    </div>
  );
};

export default LoadingIndicator;
