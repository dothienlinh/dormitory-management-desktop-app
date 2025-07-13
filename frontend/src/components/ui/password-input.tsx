import { Eye, EyeOff } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { cn } from "../../lib/utils";
import {
  forwardRef,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const cursorPositionRef = useRef<number>(0);

    // Combine the forwarded ref with our local ref
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Restore cursor position after password visibility toggle
    useEffect(() => {
      const inputElement = inputRef.current;
      if (inputElement) {
        setTimeout(() => {
          inputElement.setSelectionRange(
            cursorPositionRef.current,
            cursorPositionRef.current
          );
        }, 0);
      }
    }, [showPassword]);

    const handleTogglePassword = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Store current cursor position
      const inputElement = inputRef.current;
      cursorPositionRef.current = inputElement?.selectionStart || 0;

      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative group">
        {icon && <>{icon}</>}
        <Input
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          className={cn(
            "hide-password-toggle pr-10",
            className,
            icon && "pl-10"
          )}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          tabIndex={-1}
          className="absolute z-20 right-0 top-0 h-9 w-9 text-muted-foreground hover:!bg-transparent focus:!bg-transparent focus:!outline-none focus:!ring-0"
          onClick={handleTogglePassword}
          onMouseDown={(e) => e.preventDefault()}
        >
          {showPassword ? (
            <Eye className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          </span>
        </Button>

        <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
