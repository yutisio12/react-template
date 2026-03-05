"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

export function LoginForm() {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      // error is set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-xl shadow-lg">
          SA
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </Link>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>superadmin@example.com</span>
              <span>password123</span>
              <span>admin@example.com</span>
              <span>password123</span>
              <span>manager@example.com</span>
              <span>password123</span>
              <span>user@example.com</span>
              <span>password123</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
