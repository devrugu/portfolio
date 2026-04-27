"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function ProfilePicturePage() {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        if (!f.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (f.size > 5 * 1024 * 1024) {
            setError("Image must be under 5MB.");
            return;
        }
        setError("");
        setSuccess(false);
        setFile(f);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(f);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError("");
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/profile-picture", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed.");

            setSuccess(true);
            setFile(null);
            // Keep preview showing the new image
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Profile Picture</h1>
            <p className="text-on-background text-sm mb-10">
                Upload a new profile picture. It will update across your entire site — homepage, resume PDF, and print page.
                Recommended: square image, at least 400×400px, under 5MB.
            </p>

            <div className="max-w-lg">

                {/* Drop zone */}
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center gap-4 mb-6
            ${dragOver
                            ? "border-accent bg-accent/10"
                            : "border-gray-600 hover:border-accent/60 hover:bg-gray-800/30"
                        }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    {preview ? (
                        <div className="flex flex-col items-center gap-4">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={160}
                                height={160}
                                className="rounded-full object-cover border-4 border-accent/40"
                                style={{ width: 160, height: 160 }}
                            />
                            <p className="text-sm text-gray-400">
                                {file?.name} · {file ? (file.size / 1024).toFixed(0) : 0}KB
                            </p>
                            <p className="text-xs text-accent">Click or drag to choose a different image</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 rounded-full bg-gray-700/50 border-2 border-gray-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-primary font-medium">Drop your photo here</p>
                                <p className="text-gray-500 text-sm mt-1">or click to browse</p>
                                <p className="text-gray-600 text-xs mt-2">JPG, PNG, WebP · Max 5MB · Square recommended</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                        <span className="text-red-400 text-sm">{error}</span>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-4">
                        <span className="text-green-400 text-sm">
                            ✓ Profile picture updated successfully! Changes will appear on your site within a minute.
                        </span>
                    </div>
                )}

                {/* Upload button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full bg-accent text-on-primary font-semibold py-3 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Uploading…
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Profile Picture
                        </>
                    )}
                </button>

            </div>
        </div>
    );
}