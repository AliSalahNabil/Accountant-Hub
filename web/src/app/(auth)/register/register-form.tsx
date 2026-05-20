"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const schema = z
  .object({
    name: z.string().min(2, "Name is too short").max(120, "Name is too long"),
    email: z.string().email("Enter a valid email"),
    headline: z.string().max(160, "Keep your headline under 160 characters").optional(),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      headline: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        headline: values.headline || undefined,
      });
      toast.success(`Welcome aboard, ${user.name.split(" ")[0]}!`);
      router.push("/jobs");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (Object.keys(error.errors).length > 0) {
          for (const [key, messages] of Object.entries(error.errors)) {
            if (key in (schema as unknown as Record<string, unknown>)) continue;
            setError(key as keyof FormValues, { message: messages[0] });
          }
          // Also catch any field that didn't map cleanly
          if (error.errors.email?.length) setError("email", { message: error.errors.email[0] });
          if (error.errors.password?.length) setError("password", { message: error.errors.password[0] });
        } else {
          setServerError(error.message);
        }
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field label="Full name" htmlFor="name" required error={errors.name?.message}>
        <Input id="name" autoComplete="name" placeholder="Sarah Khan" {...register("name")} />
      </Field>

      <Field label="Email" htmlFor="email" required error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
      </Field>

      <Field
        label="Headline"
        htmlFor="headline"
        hint="e.g. Certified Public Accountant · Tax Specialist"
        error={errors.headline?.message}
      >
        <Input id="headline" placeholder="Your professional tagline" {...register("headline")} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Password" htmlFor="password" required error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("password")}
          />
        </Field>
        <Field
          label="Confirm password"
          htmlFor="password_confirmation"
          required
          error={errors.password_confirmation?.message}
        >
          <Input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            {...register("password_confirmation")}
          />
        </Field>
      </div>

      {serverError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        Create my account
      </Button>
    </form>
  );
}
