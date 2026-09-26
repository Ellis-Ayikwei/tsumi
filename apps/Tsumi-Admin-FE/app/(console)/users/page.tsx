"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Pager } from "@/components/pager";
import { EmptyState, ErrorState, LoadingRows } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, qs } from "@/lib/api";
import { formatDateTime, formatRating, fullName, humanize } from "@/lib/format";
import { formatGhs } from "@/lib/money";
import type { AdminUser, Page } from "@/lib/types";

function UsersList() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const userType = params.get("user_type") ?? "";
  const isActive = params.get("is_active") ?? "";
  const page = Number(params.get("page") ?? 1);
  const [search, setSearch] = useState(q);

  const setParam = (next: Record<string, string>) => {
    const merged = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) merged.set(k, v);
      else merged.delete(k);
    }
    if (!("page" in next)) merged.delete("page");
    router.replace(`${pathname}?${merged.toString()}`);
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["users", q, userType, isActive, page],
    queryFn: () =>
      api<Page<AdminUser>>(`/admin/users/${qs({ q, user_type: userType, is_active: isActive, page })}`),
  });

  return (
    <>
      <PageHeader
        title="Users"
        actions={
          <>
            <form onSubmit={(e) => { e.preventDefault(); setParam({ q: search.trim() }); }}>
              <Input
                aria-label="Search users"
                placeholder="Name, email or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56"
              />
            </form>
            <NativeSelect aria-label="Type" value={userType} onChange={(e) => setParam({ user_type: e.target.value })}>
              <option value="">All types</option>
              <option value="customer">Customers</option>
              <option value="agent">Agents</option>
              <option value="admin">Admins</option>
            </NativeSelect>
            <NativeSelect aria-label="State" value={isActive} onChange={(e) => setParam({ is_active: e.target.value })}>
              <option value="">Any state</option>
              <option value="true">Active</option>
              <option value="false">Suspended</option>
            </NativeSelect>
          </>
        }
      />
      {isLoading && <LoadingRows />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.results.length === 0 && <EmptyState title="No users match" />}
      {data && data.results.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Wallet</TableHead>
              <TableHead className="text-right">Done / rating</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((u) => (
              <TableRow key={u.id} className="cursor-pointer" onClick={() => router.push(`/users/${u.id}`)}>
                <TableCell>
                  <Link href={`/users/${u.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                    {fullName(u)}
                  </Link>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell>
                  {humanize(u.user_type)}
                  {u.agent_profile && <div className="mt-1"><StatusBadge status={u.agent_profile.kyc_status} /></div>}
                </TableCell>
                <TableCell><StatusBadge status={u.is_active ? "active" : "suspended"} /></TableCell>
                <TableCell className="text-right tabular-nums">{formatGhs(u.balance_pesewas ?? 0)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {u.user_type === "agent" ? `${u.completed_errands} / ${formatRating(u.avg_rating_centi)}` : "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(u.date_joined)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pager page={page} data={data} onPage={(p) => setParam({ page: String(p) })} />
    </>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingRows />}>
      <UsersList />
    </Suspense>
  );
}
