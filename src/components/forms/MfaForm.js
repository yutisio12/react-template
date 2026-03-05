"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/features/auth/auth.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";

export function MfaForm() {
  const { verifyMfa, error, clearError, mfaEmail } = useAuth();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;

    setIsSubmitting(true);
    try {
      await verifyMfa(fullCode);
    } catch {
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
          {mfaEmail && (
            <span className="block mt-1 text-xs font-medium text-foreground">
              {mfaEmail}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || code.join("").length !== 6}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Open your Google Authenticator app and enter the 6-digit code
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
