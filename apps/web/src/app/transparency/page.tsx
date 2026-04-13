"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChainId } from "wagmi";

const demo = [
  { label: "RTI filings", value: 42 },
  { label: "Open datasets", value: 18 },
  { label: "Audit trails", value: 27 },
];

export default function TransparencyPage() {
  const chainId = useChainId();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Transparency</h1>
        <p className="text-sm text-muted-foreground">
          Placeholder metrics (demo data). Wagmi reports chain ID {chainId} from environment
          configuration — no wallet required in Phase 1.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demo commitments</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demo}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
