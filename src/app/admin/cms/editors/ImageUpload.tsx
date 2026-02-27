"use client";

import { useState, useRef, DragEvent } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/cms/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch {
      // silently fail
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) upload(file);
  }

  function handleFileSelect() {
    const file = inputRef.current?.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="admin-form-group">
      {label && <label className="admin-form-label">{label}</label>}
      <div
        className={`admin-image-upload ${dragOver ? "dragover" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <div className="admin-image-preview">
            <img src={value} alt="Preview" />
            <div className="admin-image-preview-overlay">Klicken zum Ändern</div>
          </div>
        ) : (
          <div className="admin-image-placeholder">
            {uploading ? "Wird hochgeladen..." : "Bild hierher ziehen oder klicken"}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>
      <input
        type="text"
        className="admin-form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Oder URL direkt eingeben"
        style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}
      />
    </div>
  );
}
