import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateAdminUser, type AdminUserListItem } from "@/lib/api";
import { ProfileSection, SectionLabel } from "@/components/admin/AdminProfileDetailUI";

type AdminUserAccountEditorProps = {
  user: AdminUserListItem;
  onUpdated: (user: AdminUserListItem) => void;
};

export function AdminUserAccountEditor({ user, onUpdated }: AdminUserAccountEditorProps) {
  const [name, setName] = useState(user.name);
  const [isActive, setIsActive] = useState(user.is_active);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateAdminUser(user.id, {
        name: name.trim(),
        is_active: isActive,
      });
      onUpdated(updated);
      setSuccess("Account updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSection>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <SectionLabel>Edit account</SectionLabel>
        <Button size="sm" onClick={() => void save()} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save account"}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="user-name">Display name</Label>
          <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="user-email">Email (read-only)</Label>
          <Input id="user-email" value={user.email} disabled />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#1A5C35]/12 px-3 py-2.5 sm:col-span-2">
          <div>
            <p className="text-sm font-medium text-[#0D3B21]">Account active</p>
            <p className="text-xs text-[#1A2E1A]/55">Inactive users cannot sign in.</p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mt-2 text-sm text-[#1A5C35]">{success}</p> : null}
    </ProfileSection>
  );
}
