"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usersService } from "@/app/dashboard/users/_services/users.service";
import { Upload, FileSpreadsheet, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";

export function ImportDialog({ open, onOpenChange, onSuccess }) {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      Swal.fire({ icon: "error", title: "Invalid File", text: "Please select an Excel file (.xlsx or .xls)" });
      return;
    }

    setSelectedFile(file);
  }

  async function handleImport() {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      const result = await usersService.importUsers(selectedFile);

      let html = `<div class="text-left space-y-2">`;
      html += `<p><strong>Total Processed:</strong> ${result.totalProcessed}</p>`;
      html += `<p class="text-green-600"><strong>Successfully Created:</strong> ${result.totalCreated}</p>`;
      if (result.totalErrors > 0) {
        html += `<p class="text-red-600"><strong>Errors:</strong> ${result.totalErrors}</p>`;
        html += `<div class="mt-2 text-sm text-red-500"><ul>`;
        result.errors.forEach((err) => {
          html += `<li>Row ${err.row} (${err.email}): ${err.error}</li>`;
        });
        html += `</ul></div>`;
      }
      html += `</div>`;

      await Swal.fire({
        icon: result.totalErrors > 0 ? "warning" : "success",
        title: "Import Result",
        html,
        confirmButtonText: "OK",
      });

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Import Failed", text: err.message });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Import Users from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx) with columns: Name, Email, Role, Status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileSelect}
            />
            <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            {selectedFile ? (
              <div className="space-y-1">
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium text-sm">Click to select Excel file</p>
                <p className="text-xs text-muted-foreground">Supports .xlsx and .xls files</p>
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Expected columns:</p>
            <p>name (required) | email (required) | role (optional: user/manager/admin/superadmin) | status (optional: active/inactive)</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" disabled={!selectedFile || isImporting} onClick={handleImport}>
              {isImporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isImporting ? "Importing..." : "Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
