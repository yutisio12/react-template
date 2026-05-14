import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

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
          <Avatar className="h-9 w-9 ring-1 ring-border/50">
            {user.photo && <AvatarImage src={user.photo} alt={user.name} />}
            <AvatarFallback name={user.name} className="text-[11px] bg-primary/10 text-primary font-semibold" />
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{user.name}</p>
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
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
          <span className="text-sm capitalize">{status}</span>
        </div>
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
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row, onDelete }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-0.5">
          <Link href={`/dashboard/users/${user.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="View">
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
          <Link href={`/dashboard/users/${user.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Edit">
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
              title="Delete"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
