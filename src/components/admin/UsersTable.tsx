"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = Doc<"users">;

function formatJoined(ms: number) {
  return new Date(ms).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UsersTable() {
  const users = useQuery(api.users.getAll);
  const updateRole = useMutation(api.users.updateRole);

  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function toggleRole(user: User) {
    const next = user.role === "admin" ? "customer" : "admin";
    setUpdatingId(user._id);
    try {
      await updateRole({ id: user._id as Id<"users">, role: next });
      toast.success(`${user.name || user.email} is now ${next}.`);
    } catch {
      toast.error("Could not update role. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium text-[#0F172A]">{row.original.name || "—"}</span>
        ),
        // Search matches name OR email.
        filterFn: (row, _id, value: string) => {
          const q = value.toLowerCase();
          return (
            row.original.name.toLowerCase().includes(q) ||
            row.original.email.toLowerCase().includes(q)
          );
        },
      },
      { accessorKey: "email", header: "Email", enableColumnFilter: false },
      {
        accessorKey: "role",
        header: "Role",
        enableColumnFilter: false,
        cell: ({ row }) =>
          row.original.role === "admin" ? (
            <Badge className="bg-[#0F172A]">Admin</Badge>
          ) : (
            <Badge variant="secondary">Customer</Badge>
          ),
      },
      {
        id: "joined",
        header: "Joined",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="text-gray-500">{formatJoined(row.original._creationTime)}</span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                disabled={updatingId === user._id}
                onClick={() => toggleRole(user)}
              >
                {updatingId === user._id
                  ? "Updating…"
                  : user.role === "admin"
                    ? "Make Customer"
                    : "Make Admin"}
              </Button>
            </div>
          );
        },
      },
    ],
    [updatingId]
  );

  const table = useReactTable({
    data: users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters: search ? [{ id: "name", value: search }] : [] },
    initialState: { pagination: { pageSize: 10 } },
  });

  if (users === undefined) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-72" />
        <div className="rounded-md border border-gray-200 bg-white p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="mb-3 h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          table.setPageIndex(0);
        }}
        className="max-w-sm"
      />

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-gray-50">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-semibold text-gray-600">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <p className="text-sm text-gray-500">
                    {users.length === 0
                      ? "No users yet. Users appear here once they sign up via Clerk."
                      : "No users match your search."}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
