"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/dashboard/_components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usersService } from "@/app/dashboard/users/_services/users.service";
import { PERMISSIONS } from "@/mock/roles";
import { Can } from "@/components/rbac/Can";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Edit, Trash2, Mail, Shield, Calendar, Clock, UserCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  async function fetchUser() {
    try {
      const response = await usersService.getUser(params.id);
      setUser(response.user);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "User not found", timer: 2000, showConfirmButton: false });
      router.push("/dashboard/users");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await usersService.deleteUser(user.id);
        await Swal.fire({ icon: "success", title: "Deleted!", text: "User has been deleted.", timer: 1500, showConfirmButton: false });
        router.push("/dashboard/users");
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message });
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="User Detail" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="User Detail" description={`Viewing profile of ${user.name}`} />

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Button>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-24 w-24 shrink-0">
                  {user.photo && <AvatarImage src={user.photo} alt={user.name} />}
                  <AvatarFallback name={user.name} className="text-2xl" />
                </Avatar>
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4" /> {user.email}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Badge variant={user.status === "active" ? "success" : "warning"}>
                      {user.status}
                    </Badge>
                    <Badge className="capitalize">{user.role}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Can permission={PERMISSIONS.EDIT_USER}>
                    <Button variant="outline" className="gap-2" onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}>
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                  </Can>
                  <Can permission={PERMISSIONS.DELETE_USER}>
                    <Button variant="destructive" className="gap-2" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </Can>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={UserCircle} label="User ID" value={user.id} />
                <InfoItem icon={Shield} label="Role" value={user.role} capitalize />
                <InfoItem icon={Calendar} label="Created" value={formatDate(user.createdAt)} />
                <InfoItem icon={Clock} label="Last Login" value={user.lastLogin ? formatDateTime(user.lastLogin) : "Never"} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, capitalize }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`font-medium ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
