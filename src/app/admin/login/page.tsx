"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/app/actions/auth";
import { authSchema } from "@/lib/schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogIn, Loader2, ArrowRight, AlertCircle, CheckCircle2, Lock } from "lucide-react";

type FormValues = z.infer<typeof authSchema>;


export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await loginAction(data);
      if (result.success) {
        setSuccess("Login successful! Welcome back...");
        setTimeout(() => {
          router.push("/events");
          router.refresh();
        }, 1200);
      } else {
        setError(result.error || "Invalid username or password.");
      }
    });
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] bg-gradient-to-b from-background-primary to-secondary px-6 py-16 sm:px-8 lg:px-12 relative overflow-hidden font-sans">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#C26747_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">

        <Card className="border border-border/60 bg-background-primary/95 backdrop-blur-sm shadow-2xl shadow-black/5 rounded-3xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-deep-teal px-8 py-10 text-center text-white relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <h1 className="font-poppins text-2xl sm:text-3xl font-semibold tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-white/50 text-xs font-poppins font-light tracking-widest uppercase">
                Church Management Console
              </p>
            </div>
          </div>

          {/* Form Body */}
          <CardContent className="px-8 py-8 space-y-6">
            {/* Feedback Banners */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 text-red-700 text-sm px-5 py-4 rounded-2xl border border-red-200/80">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="font-light leading-relaxed">{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-3 bg-green-50 text-green-700 text-sm px-5 py-4 rounded-2xl border border-green-200/80">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 animate-bounce" />
                <span className="font-light leading-relaxed">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-poppins font-semibold uppercase tracking-[0.2em] text-teal-black/60 block">
                  Username
                </label>
                <Input
                  {...register("username")}
                  type="text"
                  placeholder="Username"
                  disabled={isPending}
                  className={`bg-white border text-teal-black font-poppins focus:ring-terracotta focus:border-terracotta rounded-xl h-12 px-4 text-sm ${
                    errors.username ? "border-red-400 focus:ring-red-400" : "border-background-secondary"
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-poppins font-semibold uppercase tracking-[0.2em] text-teal-black/60 block">
                  Password
                </label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  disabled={isPending}
                  className={`bg-white border text-teal-black font-poppins focus:ring-terracotta focus:border-terracotta rounded-xl h-12 px-4 text-sm ${
                    errors.password ? "border-red-400 focus:ring-red-400" : "border-background-secondary"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-6 rounded-xl font-poppins font-semibold tracking-[0.1em] uppercase transition-all duration-300 shadow-lg shadow-terracotta/15 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mt-3 text-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer hint */}
            <p className="text-center text-[11px] text-teal-black/35 font-light pt-2 font-poppins">
              Access restricted to authorized administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

