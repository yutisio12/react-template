import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export const usersColumns = [
  {
    id: "name",
    accessorKey: "name",
    header: "User",
    enableSorting: true,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback name={user.name} className="text-[10px]" />
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    enableSorting: true,
    cell: ({ row }) => {
      const role = row.original.role;
      const variants = {
        superadmin: "default",
        admin: "secondary",
        manager: "outline",
        user: "secondary",
      };
      return (
        <Badge variant={variants[role] || "secondary"} className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "active" ? "success" : "warning"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];
