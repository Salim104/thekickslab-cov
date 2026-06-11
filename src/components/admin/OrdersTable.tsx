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
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { formatZAR } from "@/lib/utils";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Order = Doc<"orders">;
type OrderStatus = Order["status"];

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrdersTable() {
  const orders = useQuery(api.orders.getAll);
  const updateStatus = useMutation(api.orders.updateStatus);

  const [search, setSearch] = useState("");

  async function changeStatus(id: Id<"orders">, status: OrderStatus) {
    try {
      await updateStatus({ id, status });
      toast.success(`Order marked ${status}.`);
    } catch {
      toast.error("Could not update the order. Please try again.");
    }
  }

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium text-[#0F172A]">
            {row.original.orderNumber}
          </span>
        ),
        // Search matches order number OR customer name.
        filterFn: (row, _id, value: string) => {
          const q = value.toLowerCase();
          const { firstName, lastName } = row.original.shipping;
          return (
            row.original.orderNumber.toLowerCase().includes(q) ||
            `${firstName} ${lastName}`.toLowerCase().includes(q)
          );
        },
      },
      {
        id: "customer",
        header: "Customer",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-[#0F172A]">
              {row.original.shipping.firstName} {row.original.shipping.lastName}
            </p>
            <p className="text-xs text-gray-500">{row.original.shipping.email}</p>
          </div>
        ),
      },
      {
        id: "items",
        header: "Items",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const count = row.original.items.reduce((s, i) => s + i.quantity, 0);
          return <span className="text-sm text-gray-600">{count}</span>;
        },
      },
      {
        accessorKey: "total",
        header: "Total",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-[#0F172A]">
            {formatZAR(row.original.total)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Badge className={STATUS_STYLES[row.original.status]}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="text-sm text-gray-600">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Status <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {STATUSES.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    disabled={s === row.original.status}
                    onClick={() => changeStatus(row.original._id, s)}
                    className="capitalize"
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: orders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters: search ? [{ id: "orderNumber", value: search }] : [] },
    initialState: { pagination: { pageSize: 10 } },
  });

  if (orders === undefined) {
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
        placeholder="Search by order number or customer…"
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
                    {orders.length === 0
                      ? "No orders yet. They'll appear here once customers check out."
                      : "No orders match your search."}
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
