"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, X, Pencil, Trash2 } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Product = Doc<"products">;

// Small boolean cell: green check when true, gray dash when false.
function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-600" />
  ) : (
    <X className="h-4 w-4 text-gray-300" />
  );
}

export default function ProductsTable() {
  const products = useQuery(api.products.getAll);
  const removeProduct = useMutation(api.products.remove);

  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "image",
        header: "Image",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const src = row.original.images?.[0];
          return (
            <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-100 bg-white">
              {src ? (
                <Image
                  src={src}
                  alt={row.original.name}
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              ) : null}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium text-[#0F172A]">{row.original.name}</span>
        ),
        filterFn: (row, _id, value: string) =>
          row.original.name.toLowerCase().includes(value.toLowerCase()),
      },
      { accessorKey: "brand", header: "Brand", enableColumnFilter: false },
      { accessorKey: "category", header: "Category", enableColumnFilter: false },
      {
        accessorKey: "price",
        header: "Price",
        enableColumnFilter: false,
        cell: ({ row }) => formatZAR(row.original.price),
      },
      {
        accessorKey: "originalPrice",
        header: "Original",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="text-gray-500">{formatZAR(row.original.originalPrice)}</span>
        ),
      },
      {
        accessorKey: "discountPercent",
        header: "Discount",
        enableColumnFilter: false,
        cell: ({ row }) =>
          row.original.discountPercent > 0 ? (
            <Badge className="bg-red-500">-{row.original.discountPercent}%</Badge>
          ) : (
            <span className="text-gray-300">—</span>
          ),
      },
      {
        accessorKey: "inStock",
        header: "In Stock",
        enableColumnFilter: false,
        cell: ({ row }) => <BoolCell value={row.original.inStock} />,
      },
      {
        accessorKey: "isBestSeller",
        header: "Best Seller",
        enableColumnFilter: false,
        cell: ({ row }) => <BoolCell value={row.original.isBestSeller} />,
      },
      {
        accessorKey: "isOnDeal",
        header: "On Deal",
        enableColumnFilter: false,
        cell: ({ row }) => <BoolCell value={row.original.isOnDeal} />,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button asChild variant="ghost" size="icon-sm" aria-label="Edit product">
              <Link href={`/admin/products/${row.original.slug}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete product"
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setPendingDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters: search ? [{ id: "name", value: search }] : [] },
    initialState: { pagination: { pageSize: 10 } },
  });

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await removeProduct({ id: pendingDelete._id as Id<"products"> });
      toast.success(`Deleted "${pendingDelete.name}".`);
      setPendingDelete(null);
    } catch {
      toast.error("Could not delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  // Loading state
  if (products === undefined) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-72" />
        <div className="rounded-md border border-gray-200 bg-white p-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
        placeholder="Search products by name…"
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
                    {products.length === 0
                      ? "No products yet."
                      : "No products match your search."}
                  </p>
                  {products.length === 0 && (
                    <Button asChild className="mt-3 bg-[#0F172A] hover:bg-red-500">
                      <Link href="/admin/products/new">Add your first product</Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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

      {/* Delete confirm */}
      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes{" "}
              <span className="font-medium text-[#0F172A]">{pendingDelete?.name}</span>{" "}
              from the store. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
