"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareSlider from "@/components/CompareSlider";
import UploadZone from "@/components/UploadZone";
import {
  removeBackground,
  downloadImage,
  downloadWithWhiteBackground,
} from "@/lib/remove-bg";

type ProcessState = "input" | "processing" | "done" | "error";

export default function ProcessPage() {
  const router = useRouter();
  const [state, setState] = useState<ProcessState>("input");
  const [originalData, setOriginalData] = useState<string | null>(null);
  const [resultData, setResultData] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [processingProgress, setProcessingProgress] = useState(0);

  // Load stored image on mount
  useEffect(() => {
    const storedData = sessionStorage.getItem("uploadedImageData");
    const storedName = sessionStorage.getItem("uploadedImage");
    if (storedData && storedName) {
      setOriginalData(storedData);
      setOriginalName(storedName.replace(/\.[^.]+$/, ""));
    }
  }, []);

  // Simulate progress during processing
  useEffect(() => {
    if (state !== "processing") return;
    const interval = setInterval(() => {
      setProcessingProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 15;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [state]);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalData(e.target?.result as string);
      setOriginalName(file.name.replace(/\.[^.]+$/, ""));
      setResultData(null);
      setState("input");
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!originalData) return;
    if (!apiKey.trim()) {
      setError("请输入 Remove.bg API Key");
      return;
    }

    setState("processing");
    setProcessingProgress(0);
    setError(null);

    // Convert dataURL back to File
    const res = await fetch(originalData);
    const blob = await res.blob();
    const file = new File([blob], "image.png", { type: "image/png" });

    const result = await removeBackground(file, apiKey.trim());

    if (result.success && result.dataUrl) {
      setResultData(result.dataUrl);
      setProcessingProgress(100);
      setState("done");
    } else {
      setError(result.error || "处理失败，请重试");
      setState("error");
    }
  };

  const handleDownload = (withBg: boolean) => {
    if (!resultData) return;
    const filename = `${originalName}_nobg.png`;
    if (withBg) {
      downloadWithWhiteBackground(resultData, filename);
    } else {
      downloadImage(resultData, filename);
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem("uploadedImageData");
    sessionStorage.removeItem("uploadedImage");
    setOriginalData(null);
    setResultData(null);
    setOriginalName("");
    setState("input");
    setError(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 pt-16 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Remove Background
          </h1>

          {/* No image state */}
          {!originalData && (
            <div className="py-16">
              <UploadZone onFileSelect={handleFileSelect} />
              <p className="text-center text-gray-500 text-sm mt-6">
                Or paste an image directly from your clipboard
              </p>
            </div>
          )}

          {/* Has image - show preview */}
          {originalData && state !== "done" && (
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-[#e5e5e5]">
                <img
                  src={originalData}
                  alt="Original"
                  className="w-full max-h-[400px] object-contain mx-auto"
                />
              </div>

              {/* API Key input */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remove.bg API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key (e.g. xxxxxxxxx)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                  />
                  <p className="text-gray-400 text-xs mt-2">
                    Get your free API key at{" "}
                    <a
                      href="https://www.remove.bg/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:underline"
                    >
                      remove.bg/api
                    </a>
                    . Free tier: 50 requests/month.
                  </p>
                </div>

                {/* Process button */}
                {state === "input" && (
                  <button
                    onClick={handleProcess}
                    disabled={!apiKey.trim()}
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors"
                  >
                    Remove Background
                  </button>
                )}

                {/* Processing state */}
                {state === "processing" && (
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(processingProgress, 95)}%` }}
                      />
                    </div>
                    <p className="text-center text-gray-500 text-sm">
                      Processing... {Math.round(processingProgress)}%
                    </p>
                  </div>
                )}

                {/* Error */}
                {state === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                      onClick={() => setState("input")}
                      className="mt-2 text-sm text-indigo-500 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>

              {/* Change image */}
              <div className="text-center">
                <UploadZone onFileSelect={handleFileSelect} />
              </div>
            </div>
          )}

          {/* Done - show result */}
          {state === "done" && originalData && resultData && (
            <div className="space-y-6">
              <CompareSlider original={originalData} result={resultData} />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDownload(false)}
                  className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG
                </button>
                <button
                  onClick={() => handleDownload(true)}
                  className="flex-1 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <div className="w-5 h-5 rounded border border-current flex items-center justify-center">
                    <span className="text-xs">BG</span>
                  </div>
                  Download with White BG
                </button>
              </div>

              {/* More options */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium rounded-xl transition-colors"
                >
                  Upload New Image
                </button>
                <button
                  onClick={() => {
                    setResultData(null);
                    setState("input");
                  }}
                  className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium rounded-xl transition-colors"
                >
                  Use Different API Key
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
