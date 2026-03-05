"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/table/DataTable";
import { usersColumns } from "@/components/table/UsersColumns";
import { usersService } from "@/features/users/users.service";
import { PERMISSIONS } from "@/mock/roles";
import { Can } from "@/components/rbac/Can";
import { Button } from "@/components/ui/button";
import { AddUserDialog } from "@/components/forms/AddUserDialog";
import { Plus } from "lucide-react";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

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
      // Error handling would go here in a real app
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page) => {
    setParams((p) => ({ ...p, page }));
  };

  const handlePageSizeChange = (pageSize) => {
    setParams((p) => ({ ...p, pageSize, page: 1 }));
  };

  const handleSearchChange = (search) => {
    setParams((p) => ({ ...p, search, page: 1 }));
  };

  const handleSortChange = (sorting) => {
    setParams((p) => ({
      ...p,
      sortBy: sorting.id,
      sortOrder: sorting.desc ? "desc" : "asc",
    }));
  };

  const toolbarMenu = (
    <Can permission={PERMISSIONS.CREATE_USER}>
      <Button onClick={() => setIsAddUserOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add User</span>
      </Button>
    </Can>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Users Management"
        description="Manage your team members and their account permissions here."
      />

      <main className="flex-1 overflow-auto p-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <DataTable
            columns={usersColumns}
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
    </div>
  );
}
