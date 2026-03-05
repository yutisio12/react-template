"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectWrapper } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/mock/roles";
import Link from "next/link";
import { UserPlus, Loader2, Copy, Check } from "lucide-react";

export function RegisterForm() {
  const { register, error, clearError } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.USER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mfaData, setMfaData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    try {
      const data = await register(form);
      if (data?.mfa) {
        setMfaData(data.mfa);
      }
    } catch {
      // error is set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySecret = async () => {
    if (mfaData?.secret) {
      await navigator.clipboard.writeText(mfaData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (mfaData) {
    return (
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <Check className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">Set Up MFA</CardTitle>
          <CardDescription>
            Scan the QR code with Google Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mfaData.qrCode && (
            <div className="flex justify-center p-4 bg-white rounded-xl">
              <img
                src={mfaData.qrCode}
                alt="TOTP QR Code"
                className="w-48 h-48"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Or enter this secret manually:
            </Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 rounded-lg bg-muted text-xs font-mono break-all">
                {mfaData.secret}
              </code>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={copySecret}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Link href="/login">
            <Button className="w-full mt-4">
              Continue to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-xl shadow-lg">
          SA
        </div>
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>
          Get started with your new account
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <SelectWrapper>
              <Select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value={ROLES.USER}>User</option>
                <option value={ROLES.MANAGER}>Manager</option>
                <option value={ROLES.ADMIN}>Admin</option>
              </Select>
            </SelectWrapper>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
