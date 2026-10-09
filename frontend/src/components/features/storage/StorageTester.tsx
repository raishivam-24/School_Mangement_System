/**
 * @file StorageTester.tsx
 * @description Cloudflare R2 / Object Storage Verification & File Manager.
 * Enables live testing of file uploads, direct public CDN access, and cloud deletion.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Cloud,
  UploadCloud,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileImage,
  RefreshCw,
  Copy,
  Check,
  HardDrive,
  ShieldCheck,
  Database,
  Globe,
} from 'lucide-react';
import { uploadService, type UploadResult } from '../../../services/upload.service';

interface StorageConfig {
  driver: string;
  bucket: string;
  endpoint: string;
  publicUrl: string;
  region: string;
  isCloudflareR2: boolean;
}

interface StoredTestItem extends UploadResult {
  uploadedAt: string;
}

const STORAGE_STORAGE_KEY = 'school_r2_test_uploads';

export const StorageTester: React.FC = () => {
  const [config, setConfig] = useState<StorageConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>('general');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [testFiles, setTestFiles] = useState<StoredTestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync test files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STORAGE_KEY, JSON.stringify(testFiles));
    } catch {
      // ignore
    }
  }, [testFiles]);

  // Fetch live storage driver configuration
  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const data = await uploadService.getStorageConfig();
      setConfig(data);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to connect to storage API.',
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFeedback(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setFeedback(null);
    try {
      const res = await uploadService.uploadFile(selectedFile, category);
      const newItem: StoredTestItem = {
        ...res,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setTestFiles((prev) => [newItem, ...prev]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setFeedback({
        type: 'success',
        message: `Successfully uploaded "${res.originalName}" to ${
          config?.isCloudflareR2 ? 'Cloudflare R2' : config?.driver || 'storage'
        }!`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Upload failed. Check R2 credentials in backend/.env',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (url: string, filename: string) => {
    if (!window.confirm(`Delete "${filename}" from Cloud Storage? This will remove it permanently.`)) {
      return;
    }

    setDeletingUrl(url);
    try {
      await uploadService.deleteFile(url);
      setTestFiles((prev) => prev.filter((item) => item.url !== url));
      setFeedback({
        type: 'success',
        message: `Deleted "${filename}" from Cloudflare R2 bucket.`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to delete file from storage.',
      });
    } finally {
      setDeletingUrl(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-medium border transition-all ${
            feedback.type === 'success'
              ? 'bg-accent-green-subtle/50 text-accent-green border-accent-green/30'
              : 'bg-red-500/10 text-red-500 border-red-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[10px] underline hover:opacity-80 ml-4 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Storage Engine Status Card */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-primary">Cloudflare R2 Object Storage</h3>
                {config?.isCloudflareR2 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-600 border border-orange-500/30">
                    🟢 R2 CONNECTED
                  </span>
                ) : config?.driver === 's3' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-blue-subtle text-accent-blue border border-accent-blue/30">
                    S3 COMPATIBLE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-raised text-muted border border-border">
                    LOCAL DISK
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary mt-0.5">
                S3-compatible high performance asset storage with zero egress bandwidth charges.
              </p>
            </div>
          </div>

          <button
            onClick={fetchConfig}
            disabled={loadingConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-border text-xs font-semibold text-primary transition-all border border-border"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingConfig ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Configuration Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
            <span className="text-muted flex items-center gap-1.5 text-[11px] font-bold mb-1">
              <Database className="w-3.5 h-3.5 text-accent-blue" />
              Target Bucket
            </span>
            <span className="font-semibold text-primary truncate block font-mono text-[11px]">
              {config?.bucket || 'school-saas-uploads'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
            <span className="text-muted flex items-center gap-1.5 text-[11px] font-bold mb-1">
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              S3 Endpoint
            </span>
            <span className="font-semibold text-primary truncate block font-mono text-[11px]" title={config?.endpoint}>
              {config?.endpoint || 'Standard AWS S3'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
            <span className="text-muted flex items-center gap-1.5 text-[11px] font-bold mb-1">
              <HardDrive className="w-3.5 h-3.5 text-accent-green" />
              Public Base CDN
            </span>
            <span className="font-semibold text-primary truncate block font-mono text-[11px]" title={config?.publicUrl}>
              {config?.publicUrl || 'Direct S3 URLs'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
            <span className="text-muted flex items-center gap-1.5 text-[11px] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
              Region / Driver
            </span>
            <span className="font-semibold text-primary uppercase text-[11px]">
              {config?.region || 'auto'} ({config?.driver || 'local'})
            </span>
          </div>
        </div>
      </div>

      {/* Upload Tester Console */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
        <h4 className="text-sm font-bold text-primary mb-1">Direct Upload Tester</h4>
        <p className="text-xs text-secondary mb-4">
          Select any file to test streaming to Cloudflare R2 and verify instant retrieval.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* File Picker */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-secondary mb-1.5">
              Choose Test File (Images, PDF, Documents)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="w-full text-xs text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-accent-blue file:text-white hover:file:bg-brand-sky-dark file:cursor-pointer cursor-pointer bg-surface-raised border border-border rounded-2xl p-1"
              />
            </div>
            {selectedFile && (
              <p className="text-[11px] text-muted mt-1.5 font-medium">
                Selected: <span className="text-primary font-semibold">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          {/* Category & Action */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-secondary mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 px-3 bg-surface-raised border border-border rounded-xl text-xs text-primary font-medium focus:outline-none"
              >
                <option value="general">General</option>
                <option value="circulars">Circulars / Notices</option>
                <option value="homework">Homework</option>
                <option value="avatars">Avatars / Photos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-transparent mb-1.5">Upload</label>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shrink-0"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload to R2</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files Manager */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div>
            <h4 className="text-sm font-bold text-primary">Uploaded Files in Cloud Storage</h4>
            <p className="text-xs text-secondary">
              Files verified in this session. You can open them in your browser or delete them directly from R2.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-raised text-secondary border border-border">
            {testFiles.length} {testFiles.length === 1 ? 'File' : 'Files'}
          </span>
        </div>

        {testFiles.length === 0 ? (
          <div className="py-12 text-center text-secondary space-y-2">
            <Cloud className="w-10 h-10 mx-auto text-muted/50" />
            <p className="text-xs font-medium">No files uploaded yet in this session.</p>
            <p className="text-[11px] text-muted">Upload a test image or PDF document above to verify your R2 bucket.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testFiles.map((file, idx) => {
              const isImage = file.mimetype.startsWith('image/');
              const isDeleting = deletingUrl === file.url;

              return (
                <div
                  key={`${file.url}-${idx}`}
                  className="p-4 rounded-2xl bg-surface-raised border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-brand-sky/40"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Thumbnail / Icon */}
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {isImage ? (
                        <img
                          src={file.url}
                          alt={file.originalName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // fallback if CORS or broken
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-accent-blue" />
                      )}
                    </div>

                    {/* File Meta */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary truncate block">
                          {file.originalName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface text-muted border border-border shrink-0">
                          {file.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.mimetype}</span>
                        <span>•</span>
                        <span>{file.uploadedAt}</span>
                      </div>
                      <p className="text-[10px] font-mono text-secondary truncate mt-1 max-w-lg">
                        {file.url}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Copy Link */}
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      title="Copy Public URL"
                      className="p-2 rounded-xl bg-surface hover:bg-border text-secondary hover:text-primary transition-all border border-border text-xs flex items-center gap-1"
                    >
                      {copiedUrl === file.url ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-accent-green" />
                          <span className="text-[10px] text-accent-green font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium">Copy</span>
                        </>
                      )}
                    </button>

                    {/* Open in New Tab */}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open File in New Tab"
                      className="p-2 rounded-xl bg-surface hover:bg-border text-accent-blue transition-all border border-border text-xs flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="text-[10px]">View</span>
                    </a>

                    {/* Delete Permanently */}
                    <button
                      onClick={() => handleDelete(file.url, file.originalName)}
                      disabled={isDeleting}
                      title="Delete from Cloudflare R2 Storage"
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/20 text-xs flex items-center gap-1 font-bold disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[10px]">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
