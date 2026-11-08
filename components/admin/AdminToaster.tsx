"use client";

import { Toaster } from "react-hot-toast";

export function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fffdf8",
          color: "#1a1a1a",
          border: "1px solid #e5ddd0",
          borderRadius: "12px",
          padding: "12px 14px",
          fontSize: "14px",
          maxWidth: "380px",
        },
        success: {
          iconTheme: { primary: "#1a7a4c", secondary: "#fffdf8" },
        },
        error: {
          duration: 5000,
          style: {
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid rgba(185, 28, 28, 0.35)",
          },
          iconTheme: { primary: "#b91c1c", secondary: "#fee2e2" },
        },
      }}
    />
  );
}
