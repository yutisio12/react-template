"use client";

import { useState, useRef } from "react";
import { Header } from "@/app/dashboard/_components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth.context";
import { formatDate } from "@/lib/utils";
import { Loader2, Camera, Upload, Shield, Calendar, Mail } from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    photo: user?.photo || null,
  });

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
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPhotoPreview(data.url);
      setForm((prev) => ({ ...prev, photo: data.url }));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: err.message });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      updateUser?.(data.user);
      await Swal.fire({ icon: "success", title: "Profile Updated!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header title="My Profile" description="Manage your account settings and preferences." />

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-20 w-20 shrink-0">
                  {photoPreview && <AvatarImage src={photoPreview} alt={user?.name} />}
                  <AvatarFallback name={user?.name} className="text-2xl" />
                </Avatar>
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 text-sm">
                    <Mail className="h-4 w-4" /> {user?.email}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Badge className="capitalize">{user?.role}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Joined {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24">
                      {photoPreview ? <AvatarImage src={photoPreview} alt={form.name} /> : null}
                      <AvatarFallback name={form.name} className="text-2xl" />
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </div>
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" /> Change Photo
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input id="profile-name" name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input id="profile-email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
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
