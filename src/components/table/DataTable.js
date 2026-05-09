"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectWrapper } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
} from "lucide-react";

export function DataTable({
  columns,
  data,
  pagination,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
  searchValue = "",
  sorting = { id: "createdAt", desc: true },
  toolbar,
}) {
  const [search, setSearch] = useState(searchValue);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination?.totalPages || 0,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange?.(search);
  };

  const handleSort = (columnId) => {
    const isCurrentSort = sorting.id === columnId;
    const newDesc = isCurrentSort ? !sorting.desc : true;
    onSortChange?.({ id: columnId, desc: newDesc });
  };

  const getSortIcon = (columnId) => {
    if (sorting.id !== columnId) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/40" />;
    }
    return sorting.desc ? (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-56 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        <div className="rounded-xl border border-border/50 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-border/30 last:border-b-0">
              <Skeleton className="h-5 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/30 border-0 rounded-xl text-sm focus-visible:bg-background focus-visible:ring-1"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="rounded-xl">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-3">
          {toolbar}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline text-xs">Show</span>
            <SelectWrapper>
              <Select
                value={pagination?.pageSize || 10}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                className="w-[65px] h-8 rounded-lg text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </Select>
            </SelectWrapper>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border/50 bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "h-10 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wider text-muted-foreground",
                      header.column.columnDef.enableSorting !== false &&
                      "cursor-pointer select-none hover:text-foreground transition-colors"
                    )}
                    onClick={() => {
                      if (header.column.columnDef.enableSorting !== false) {
                        handleSort(header.column.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {header.column.columnDef.enableSorting !== false &&
                        getSortIcon(header.column.id)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/30 last:border-b-0 hover:bg-primary/[0.02] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm">No results found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{((pagination.page - 1) * pagination.pageSize) + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}</span> of{" "}
            <span className="font-medium text-foreground">{pagination.totalItems}</span> results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onPageChange?.(1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs font-medium tabular-nums">
              {pagination.page} <span className="text-muted-foreground">/</span> {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onPageChange?.(pagination.totalPages)}
              disabled={!pagination.hasNextPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
