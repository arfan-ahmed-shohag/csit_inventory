"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitTask } from "@/services/taskService";
import { toast } from "sonner";
import { Upload, X, CheckCircle } from "lucide-react";
import { toastId } from "@/components/shared/toastId";

interface SubmitTaskDialogProps {
  taskId: string;
}

export function SubmitTaskDialog({ taskId }: SubmitTaskDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveLink, setLiveLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (only .zip files)
    if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
      toast.error("Only ZIP files are allowed");
      return;
    }

    // Validate file size (max 100MB for zip files)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size exceeds 100MB limit");
      return;
    }

    setSelectedFile(file);
    setFileUrl("");
  };

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset");
    formData.append("resource_type", "auto");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dwduymu1l/auto/upload",
      { method: "POST", body: formData },
    );

    if (!res.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    const data = await res.json();
    console.log(data.secure_url);

    return data.secure_url;
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !fileUrl) {
      toast.error("Please select a ZIP file");
      return;
    }

    setLoading(true);
    try {
      let uploadedFileUrl = fileUrl;

      // Upload file if not already uploaded
      if (selectedFile && !fileUrl) {
        uploadedFileUrl = await uploadFileToCloudinary(selectedFile);
      }

      // Submit task with uploaded file URL
      const res = await submitTask(taskId, {
        liveLink: liveLink.trim() || null,
        fileUrl: uploadedFileUrl.trim(),
      });

      if (res.success) {
        toast.success(res.message || "Task submitted successfully", {
          id: toastId,
        });
        setOpen(false);
        setLiveLink("");
        setSelectedFile(null);
        setFileUrl("");
      } else {
        toast.error(res.errorMessage || "Failed to submit task", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to upload file or submit task", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Submit Task</Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>Submit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>
              Project/Thesis File <span className="text-red-500">*</span>
            </Label>

            {!selectedFile && !fileUrl && (
              <label className="block">
                <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-6 text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                    Upload ZIP file
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Max 100MB
                  </p>
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".zip,application/zip"
                    disabled={loading}
                  />
                </div>
              </label>
            )}

            {selectedFile && !fileUrl && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Ready to upload
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            )}

            {fileUrl && (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {selectedFile?.name || "File uploaded"}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Uploaded successfully
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-green-600 dark:text-green-400" />
                </button>
              </div>
            )}
          </div>

          {/* Live Link */}
          <div className="space-y-2">
            <Label htmlFor="liveLink">
              Live Link <span className="text-slate-400">(Optional)</span>
            </Label>
            <Input
              id="liveLink"
              placeholder="https://example.com/demo"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
              type="url"
              disabled={loading}
            />
            <p className="text-xs text-slate-500">
              Link to live demo or application (optional)
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (!selectedFile && !fileUrl)}
              className="w-full sm:w-auto"
            >
              {loading ? "Submitting..." : "Submit Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
