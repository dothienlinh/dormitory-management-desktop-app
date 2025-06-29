import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="text-center space-y-6 max-w-lg">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold tracking-tight">
            Không tìm thấy trang
          </h2>
          <p className="text-muted-foreground">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển đến một
            địa chỉ khác.
          </p>
        </div>

        <div className="relative max-w-xs mx-auto h-64">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-lg blur-lg opacity-70"></div>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="text-8xl">🏠</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            variant="default"
            size="lg"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}
