"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [aadhaarId, setAadhaarId] = useState("123456789012");
  const [pin, setPin] = useState("1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("mock-aadhaar", {
      redirect: false,
      aadhaarId,
      pin,
    });
    setLoading(false);
    if (res?.error) {
      setError("Could not sign in. Is the API running?");
      return;
    }
    router.push("/chat");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Mock Aadhaar sign-in</CardTitle>
          <p className="text-sm text-muted-foreground">
            Phase 1 uses PIN <span className="font-mono">1234</span> with any Aadhaar-style id.
            The session stores a backend JWT for authenticated chat persistence.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="aadhaar">
                Aadhaar (mock)
              </label>
              <Input
                id="aadhaar"
                value={aadhaarId}
                onChange={(e) => setAadhaarId(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="pin">
                PIN
              </label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
