import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { FormCheckbox } from "./FormCheckbox";
import { contactFormSchema, ContactFormData } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

const priorityOptions = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export const ContactForm = () => {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      priority: "medium",
      newsletter: false,
    },
  });

  const messageValue = watch("message") || "";

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  const isFieldTouched = (fieldName: string) => touchedFields.has(fieldName);
  const isFieldValid = (fieldName: keyof ContactFormData) => 
    dirtyFields[fieldName] && !errors[fieldName];

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState("submitting");
    setServerError(null);

    try {
      // Server-side validation happens via Supabase RLS and constraints
      const { error } = await supabase.from("form_submissions").insert({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        subject: data.subject.trim(),
        message: data.message.trim(),
        priority: data.priority,
        newsletter: data.newsletter,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSubmitState("success");
      reset();
      setTouchedFields(new Set());

      // Reset success state after 5 seconds
      setTimeout(() => setSubmitState("idle"), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setServerError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      setSubmitState("error");
    }
  };

  if (submitState === "success") {
    return (
      <div className="form-card text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for reaching out. We've received your message and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-card space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <FormInput
          label="Full Name"
          placeholder="John Doe"
          required
          error={isFieldTouched("name") ? errors.name?.message : undefined}
          success={isFieldValid("name")}
          {...register("name", { onBlur: () => handleFieldBlur("name") })}
        />
        <FormInput
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
          error={isFieldTouched("email") ? errors.email?.message : undefined}
          success={isFieldValid("email")}
          {...register("email", { onBlur: () => handleFieldBlur("email") })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          hint="Optional"
          error={isFieldTouched("phone") ? errors.phone?.message : undefined}
          success={isFieldValid("phone") && !!watch("phone")}
          {...register("phone", { onBlur: () => handleFieldBlur("phone") })}
        />
        <FormSelect
          label="Priority Level"
          options={priorityOptions}
          required
          error={isFieldTouched("priority") ? errors.priority?.message : undefined}
          success={isFieldValid("priority")}
          {...register("priority", { onBlur: () => handleFieldBlur("priority") })}
        />
      </div>

      <FormInput
        label="Subject"
        placeholder="How can we help you?"
        required
        error={isFieldTouched("subject") ? errors.subject?.message : undefined}
        success={isFieldValid("subject")}
        {...register("subject", { onBlur: () => handleFieldBlur("subject") })}
      />

      <FormTextarea
        label="Message"
        placeholder="Please describe your inquiry in detail..."
        required
        rows={5}
        maxLength={2000}
        currentLength={messageValue.length}
        error={isFieldTouched("message") ? errors.message?.message : undefined}
        success={isFieldValid("message")}
        {...register("message", { onBlur: () => handleFieldBlur("message") })}
      />

      <FormCheckbox
        label="Subscribe to newsletter"
        description="Get updates about our latest features and announcements"
        {...register("newsletter")}
      />

      {serverError && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">Submission Failed</p>
            <p className="text-sm text-destructive/80 mt-1">{serverError}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="btn-primary flex items-center gap-2"
        >
          {submitState === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Form
            </>
          )}
        </button>
      </div>
    </form>
  );
};
