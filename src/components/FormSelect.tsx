import { forwardRef, SelectHTMLAttributes } from "react";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  success?: boolean;
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, success, placeholder, className, id, ...props }, ref) => {
    const selectId = id || props.name;
    
    return (
      <div className="space-y-2">
        <label htmlFor={selectId} className="label-text">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "input-field appearance-none pr-12 cursor-pointer",
              error && "input-field-error",
              success && !error && "input-field-success",
              !props.value && "text-muted-foreground",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            {error && <AlertCircle className="h-5 w-5 text-destructive" />}
            {success && !error && <CheckCircle2 className="h-5 w-5 text-success" />}
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="error-message" role="alert">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
