import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  centered?: boolean;
  fullHeight?: boolean;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  centered = true,
  fullHeight = false,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const wrapperClasses = [
    className,
    centered ? "flex items-center justify-center" : "",
    fullHeight ? "h-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
    </div>
  );
}
