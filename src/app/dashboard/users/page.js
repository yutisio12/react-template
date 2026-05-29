"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Header } from "@/app/dashboard/_components/Header";
import { DataTable } from "@/components/table/DataTable";
import { usersColumns } from "@/app/dashboard/users/_components/UsersColumns";
import { usersService } from "@/app/dashboard/users/_services/users.service";
import { PERMISSIONS } from "@/mock/roles";
import { Can } from "@/components/rbac/Can";
import { Button } from "@/components/ui/button";
import { AddUserDialog } from "@/app/dashboard/users/_components/AddUserDialog";
import { ImportDialog } from "@/app/dashboard/users/_components/ImportDialog";
import { Plus, Download, FileSpreadsheet, FileText, Upload, Loader2, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await usersService.getUsers(params);
      setData(response.data);
      setPagination(response.pagination);
    } catch {
      // handled by DataTable empty state
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    }
    if (exportOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exportOpen]);

  const handlePageChange = (page) => setParams((p) => ({ ...p, page }));
  const handlePageSizeChange = (pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }));
  const handleSearchChange = (search) => setParams((p) => ({ ...p, search, page: 1 }));
  const handleSortChange = (sorting) =>
    setParams((p) => ({ ...p, sortBy: sorting.id, sortOrder: sorting.desc ? "desc" : "asc" }));

  async function handleDeleteUser(user) {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#e2e8f0",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    });

    if (result.isConfirmed) {
      try {
        await usersService.deleteUser(user.id);
        Swal.fire({ icon: "success", title: "Deleted!", text: "User has been deleted.", timer: 1500, showConfirmButton: false, customClass: { popup: "rounded-2xl" } });
        fetchUsers();
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, customClass: { popup: "rounded-2xl" } });
      }
    }
  }

  async function handleExportExcel() {
    setExportOpen(false);
    setIsExporting(true);
    try {
      await usersService.exportExcel();
      Swal.fire({ icon: "success", title: "Exported!", text: "Excel file downloaded.", timer: 1500, showConfirmButton: false, customClass: { popup: "rounded-2xl" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Export Failed", text: err.message, customClass: { popup: "rounded-2xl" } });
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportPDF() {
    setExportOpen(false);
    setIsExporting(true);
    try {
      await usersService.exportPDF();
      Swal.fire({ icon: "success", title: "Exported!", text: "PDF file downloaded.", timer: 1500, showConfirmButton: false, customClass: { popup: "rounded-2xl" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Export Failed", text: err.message, customClass: { popup: "rounded-2xl" } });
    } finally {
      setIsExporting(false);
    }
  }

  const columns = usersColumns.map((col) => {
    if (col.id === "actions") {
      return { ...col, cell: (props) => col.cell({ ...props, onDelete: handleDeleteUser }) };
    }
    return col;
  });

  const toolbarMenu = (
    <div className="flex items-center gap-2 flex-wrap">
      <Can permission={PERMISSIONS.CREATE_USER}>
        <Button variant="outline" className="gap-2 rounded-xl h-9" onClick={() => setIsImportOpen(true)}>
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>
      </Can>

      <div className="relative" ref={exportRef}>
        <Button
          variant="outline"
          className="gap-2 rounded-xl h-9"
          disabled={isExporting}
          onClick={() => setExportOpen(!exportOpen)}
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden sm:inline">Export</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
        {exportOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/5 py-1.5 min-w-[180px] z-50 animate-in fade-in-0 zoom-in-95 duration-150">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-3 px-4 py-2.5 text-sm w-full hover:bg-emerald-50 transition-colors cursor-pointer text-foreground"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">Export Excel</p>
                <p className="text-[11px] text-muted-foreground">.xlsx format</p>
              </div>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-3 px-4 py-2.5 text-sm w-full hover:bg-red-50 transition-colors cursor-pointer text-foreground"
            >
              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Export PDF</p>
                <p className="text-[11px] text-muted-foreground">.pdf format</p>
              </div>
            </button>
          </div>
        )}
      </div>

      <Can permission={PERMISSIONS.CREATE_USER}>
        <Button onClick={() => setIsAddUserOpen(true)} className="gap-2 rounded-xl h-9 shadow-lg shadow-primary/25">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add User</span>
        </Button>
      </Can>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Users Management"
        description="Manage your team members and their account permissions here."
      />

      <main className="flex-1 overflow-auto p-6">
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <DataTable
            columns={columns}
            data={data}
            pagination={pagination}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            searchValue={params.search}
            sorting={{ id: params.sortBy, desc: params.sortOrder === "desc" }}
            toolbar={toolbarMenu}
          />
        </div>
      </main>

      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSuccess={fetchUsers}
      />

      <ImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
