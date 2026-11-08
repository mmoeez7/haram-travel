"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  adminInputClass,
  adminLabelClass,
  adminPageClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/admin/admin-ui";
import { AdminPasswordInput } from "@/components/admin/AdminPasswordInput";

type AccountUser = {
  name: string;
  email: string;
};

export function AdminAccountClient({
  initialUser,
}: {
  initialUser: AccountUser;
}) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);

  const [emailSaving, setEmailSaving] = useState(false);

  const [passwordSaving, setPasswordSaving] = useState(false);

  async function onChangeEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailSaving(true);
    const form = new FormData(event.currentTarget);

    try {
      const result = await adminFetch<{
        ok: boolean;
        message?: string;
        reauthRequired?: boolean;
        user?: { email: string; name: string };
      }>("/api/admin/account/email", {
        method: "PATCH",
        body: JSON.stringify({
          newEmail: String(form.get("newEmail") || ""),
          currentPassword: String(form.get("currentPassword") || ""),
        }),
      });

      if (result.user?.email) {
        setUser((prev) => ({ ...prev, email: result.user!.email }));
      }
      toast.success(result.message || "Email updated.");
      event.currentTarget.reset();

      if (result.reauthRequired) {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update email");
    } finally {
      setEmailSaving(false);
    }
  }

  async function onChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordSaving(true);
    const form = new FormData(event.currentTarget);

    try {
      const result = await adminFetch<{ ok: boolean; message?: string }>(
        "/api/admin/account/password",
        {
          method: "PATCH",
          body: JSON.stringify({
            currentPassword: String(form.get("currentPassword") || ""),
            newPassword: String(form.get("newPassword") || ""),
            confirmPassword: String(form.get("confirmPassword") || ""),
          }),
        }
      );
      toast.success(result.message || "Password updated.");
      event.currentTarget.reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Account"
        description="Update your admin email or password."
      />

      <div className="admin-enter grid gap-4">
        <AdminCard>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Signed in as
          </p>
          <p className="mt-2 font-display text-xl font-semibold text-charcoal">
            {user.name}
          </p>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </AdminCard>

        <AdminCard className="admin-enter admin-enter-delay-1">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
            Change email
          </h2>
          <p className="mt-1 text-sm text-muted">
            You will need to sign in again after changing email.
          </p>
          <form onSubmit={onChangeEmail} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={adminLabelClass}>
                New email
                <input
                  name="newEmail"
                  type="email"
                  required
                  autoComplete="email"
                  className={adminInputClass}
                />
              </label>
              <label className={adminLabelClass}>
                Current password
                <AdminPasswordInput
                  name="currentPassword"
                  required
                  minLength={8}
                  autoComplete="current-password"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={emailSaving}
              className={adminPrimaryButtonClass}
            >
              {emailSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Updating…
                </>
              ) : (
                "Update email"
              )}
            </button>
          </form>
        </AdminCard>

        <AdminCard className="admin-enter admin-enter-delay-2">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
            Change password
          </h2>
          <p className="mt-1 text-sm text-muted">
            Use at least 8 characters for your new password.
          </p>
          <form onSubmit={onChangePassword} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className={adminLabelClass}>
                Current password
                <AdminPasswordInput
                  name="currentPassword"
                  required
                  minLength={8}
                  autoComplete="current-password"
                />
              </label>
              <label className={adminLabelClass}>
                New password
                <AdminPasswordInput
                  name="newPassword"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </label>
              <label className={adminLabelClass}>
                Confirm new password
                <AdminPasswordInput
                  name="confirmPassword"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={passwordSaving}
              className={adminSecondaryButtonClass}
            >
              {passwordSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
