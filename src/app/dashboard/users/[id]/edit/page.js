"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/dashboard/_components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectWrapper } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { usersService } from "@/app/dashboard/users/_services/users.service";
import { ROLES } from "@/mock/roles";
import { ArrowLeft, Loader2, Camera, Upload } from "lucide-react";
import Swal from "sweetalert2";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ROLES.USER,
    status: "active",
    photo: null,
  });

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  async function fetchUser() {
    try {
      const response = await usersService.getUser(params.id);
      const u = response.user;
      setUser(u);
      setForm({ name: u.name, email: u.email, role: u.role, status: u.status, photo: u.photo || null });
      if (u.photo) setPhotoPreview(u.photo);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "User not found", timer: 2000, showConfirmButton: false });
      router.push("/dashboard/users");
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "error", title: "Invalid File", text: "Please select an image file" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File Too Large", text: "Image must be under 2MB" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await usersService.uploadPhoto(formData);
      setPhotoPreview(response.url);
      setForm((prev) => ({ ...prev, photo: response.url }));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: err.message });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await usersService.updateUser(params.id, form);
      await Swal.fire({ icon: "success", title: "Updated!", text: "User has been updated successfully.", timer: 1500, showConfirmButton: false });
      router.push(`/dashboard/users/${params.id}`);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Edit User" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="Edit User" description={`Editing ${user?.name}`} />

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Edit User Information</CardTitle>
              <CardDescription>Update user details and role assignment.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24">
                      {photoPreview ? (
                        <AvatarImage src={photoPreview} alt={form.name} />
                      ) : null}
                      <AvatarFallback name={form.name} className="text-2xl" />
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" /> Change Photo
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <SelectWrapper>
                      <Select id="edit-role" name="role" value={form.role} onChange={handleChange}>
                        <option value={ROLES.USER}>User</option>
                        <option value={ROLES.MANAGER}>Manager</option>
                        <option value={ROLES.ADMIN}>Admin</option>
                        <option value={ROLES.SUPERADMIN}>Super Admin</option>
                      </Select>
                    </SelectWrapper>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <SelectWrapper>
                      <Select id="edit-status" name="status" value={form.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Select>
                    </SelectWrapper>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
