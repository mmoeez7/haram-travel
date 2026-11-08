"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export function AdminLoginErrorToast({ show }: { show: boolean }) {
  useEffect(() => {
    if (show) {
      toast.error("Invalid email or password.");
    }
  }, [show]);

  return null;
}
