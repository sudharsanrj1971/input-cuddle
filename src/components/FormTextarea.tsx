import { forwardRef, TextareaHTMLAttributes } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  hint?: string;
  maxLength?: number;
  currentLength?: number;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, success, hint, maxLength, currentLength = 0, className, id, ...props }, ref) => {
    const textareaId = id || props.name;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={textareaId} className="label-text">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
          {maxLength && (
            <span className={cn(
              "text-xs",
              currentLength > maxLength * 0.9 ? "text-warning" : "text-muted-foreground",
              currentLength >= maxLength && "text-destructive"
            )}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              "input-field min-h-[120px] resize-none",
              error && "input-field-error",
              success && !error && "input-field-success",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
            maxLength={maxLength}
            {...props}
          />
          <div className="absolute right-3 top-3">
            {error && <AlertCircle className="h-5 w-5 text-destructive" />}
            {success && !error && <CheckCircle2 className="h-5 w-5 text-success" />}
          </div>
        </div>
        {error && (
          <p id={`${textareaId}-error`} className="error-message" role="alert">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
