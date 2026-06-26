import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { updateAdminPassword } from "@/lib/api";
import { AdminSectionPanel } from "@/components/admin/AdminTableUI";

const AdminSettings = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await updateAdminPassword(newPassword);
      setSuccess(result.message);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <AdminSectionPanel title="Change password">
        <div className="flex items-start gap-3 mb-6 rounded-xl border border-[#1A5C35]/12 bg-[#fafcfb] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9952A] to-[#8a6420]">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-[#1A2E1A]/65 leading-relaxed">
            Set a new password for{" "}
            <span className="font-semibold text-[#0D3B21]">{user?.email ?? "your admin account"}</span>.
            No current password or email OTP is required while logged in as admin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/5 p-3">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-emerald-700 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              {success}
            </p>
          ) : null}

          <div>
            <Label htmlFor="newPassword" className="text-[#0D3B21]">
              New password
            </Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="mt-2 border-[#1A5C35]/20 bg-white"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-[#0D3B21]">
              Confirm new password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="mt-2 border-[#1A5C35]/20 bg-white"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:opacity-95"
          >
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </AdminSectionPanel>
    </div>
  );
};

export default AdminSettings;
