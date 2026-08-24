import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateAdminLandownerProfile,
  updateAdminLandownerProject,
  updateAdminLandownerProperty,
  type AdminLandownerDetail,
} from "@/lib/api";
import { ProfileSection, SectionLabel } from "@/components/admin/AdminProfileDetailUI";
import { AdminTableAction } from "@/components/admin/AdminTableUI";

type AdminLandownerEditorProps = {
  landownerId: string;
  detail: AdminLandownerDetail;
  onUpdated: (detail: AdminLandownerDetail) => void;
};

export function AdminLandownerEditor({ landownerId, detail, onUpdated }: AdminLandownerEditorProps) {
  const [name, setName] = useState(detail.profile.name);
  const [phone, setPhone] = useState(detail.profile.phone ?? "");
  const [city, setCity] = useState(detail.profile.city ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [editProperty, setEditProperty] = useState<Record<string, unknown> | null>(null);
  const [editProject, setEditProject] = useState<Record<string, unknown> | null>(null);
  const [savingEntity, setSavingEntity] = useState(false);
  const [entityError, setEntityError] = useState<string | null>(null);

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const profile = await updateAdminLandownerProfile(landownerId, {
        name: name.trim(),
        phone: phone.trim() || null,
        city: city.trim() || null,
      });
      onUpdated({ ...detail, profile });
      setProfileSuccess("Profile saved.");
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveProperty = async () => {
    if (!editProperty?.id) return;
    setSavingEntity(true);
    setEntityError(null);
    try {
      const updated = await updateAdminLandownerProperty(landownerId, String(editProperty.id), {
        name: editProperty.name ? String(editProperty.name) : null,
        city: String(editProperty.city ?? ""),
        ward: editProperty.ward ? String(editProperty.ward) : null,
        landmark: editProperty.landmark ? String(editProperty.landmark) : null,
        pid_number: editProperty.pid_number ? String(editProperty.pid_number) : null,
        khatha_type: editProperty.khatha_type ? String(editProperty.khatha_type) : null,
        e_khatha_status: editProperty.e_khatha_status ? String(editProperty.e_khatha_status) : null,
        tax_paid: Boolean(editProperty.tax_paid),
      });
      onUpdated({
        ...detail,
        properties: detail.properties.map((p) =>
          String((p as Record<string, unknown>).id) === String(updated.id) ? updated : p,
        ),
      });
      setEditProperty(null);
    } catch (e) {
      setEntityError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingEntity(false);
    }
  };

  const saveProject = async () => {
    if (!editProject?.id) return;
    setSavingEntity(true);
    setEntityError(null);
    try {
      const updated = await updateAdminLandownerProject(landownerId, String(editProject.id), {
        status: editProject.status ? String(editProject.status) : undefined,
        intent: editProject.intent ? String(editProject.intent) : null,
        timeline: editProject.timeline ? String(editProject.timeline) : null,
        scope: editProject.scope ? String(editProject.scope) : null,
        asset_class: editProject.asset_class ? String(editProject.asset_class) : null,
        budget_tier: editProject.budget_tier ? String(editProject.budget_tier) : null,
      });
      onUpdated({
        ...detail,
        projects: detail.projects.map((p) =>
          String((p as Record<string, unknown>).id) === String(updated.id) ? updated : p,
        ),
      });
      setEditProject(null);
    } catch (e) {
      setEntityError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingEntity(false);
    }
  };

  return (
    <>
      <ProfileSection>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <SectionLabel>Edit profile</SectionLabel>
          <Button size="sm" onClick={() => void saveProfile()} disabled={savingProfile}>
            <Save className="mr-2 h-4 w-4" />
            {savingProfile ? "Saving…" : "Save profile"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="lo-name">Name</Label>
            <Input id="lo-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lo-phone">Phone</Label>
            <Input id="lo-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="lo-city">City</Label>
            <Input id="lo-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        </div>
        {profileError ? <p className="mt-2 text-sm text-red-600">{profileError}</p> : null}
        {profileSuccess ? <p className="mt-2 text-sm text-[#1A5C35]">{profileSuccess}</p> : null}
      </ProfileSection>

      {detail.properties.length > 0 ? (
        <ProfileSection>
          <SectionLabel>Edit properties</SectionLabel>
          <div className="space-y-2">
            {detail.properties.map((prop) => {
              const row = prop as Record<string, unknown>;
              return (
                <div
                  key={String(row.id)}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1A5C35]/10 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0D3B21]">
                      {String(row.name ?? row.city ?? "Property")}
                    </p>
                    <p className="text-xs text-[#1A2E1A]/50">
                      {[row.city, row.ward, row.pid_number].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <AdminTableAction
                    label="Edit"
                    onClick={() => setEditProperty({ ...row })}
                  />
                </div>
              );
            })}
          </div>
        </ProfileSection>
      ) : null}

      {detail.projects.length > 0 ? (
        <ProfileSection>
          <SectionLabel>Edit projects</SectionLabel>
          <div className="space-y-2">
            {detail.projects.map((proj) => {
              const row = proj as Record<string, unknown>;
              return (
                <div
                  key={String(row.id)}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1A5C35]/10 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0D3B21]">
                      {String(row.project_type ?? "Project").replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-[#1A2E1A]/50">
                      {[row.status, row.intent, row.timeline].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <AdminTableAction label="Edit" onClick={() => setEditProject({ ...row })} />
                </div>
              );
            })}
          </div>
        </ProfileSection>
      ) : null}

      <Dialog open={!!editProperty} onOpenChange={(open) => !open && setEditProperty(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit property</DialogTitle>
          </DialogHeader>
          {editProperty ? (
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={String(editProperty.name ?? "")}
                  onChange={(e) => setEditProperty((p) => (p ? { ...p, name: e.target.value } : p))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input
                  value={String(editProperty.city ?? "")}
                  onChange={(e) => setEditProperty((p) => (p ? { ...p, city: e.target.value } : p))}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Ward</Label>
                  <Input
                    value={String(editProperty.ward ?? "")}
                    onChange={(e) => setEditProperty((p) => (p ? { ...p, ward: e.target.value } : p))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>PID</Label>
                  <Input
                    value={String(editProperty.pid_number ?? "")}
                    onChange={(e) => setEditProperty((p) => (p ? { ...p, pid_number: e.target.value } : p))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Landmark</Label>
                <Input
                  value={String(editProperty.landmark ?? "")}
                  onChange={(e) => setEditProperty((p) => (p ? { ...p, landmark: e.target.value } : p))}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(editProperty.tax_paid)}
                  onChange={(e) => setEditProperty((p) => (p ? { ...p, tax_paid: e.target.checked } : p))}
                />
                Tax paid
              </label>
            </div>
          ) : null}
          {entityError ? <p className="text-sm text-red-600">{entityError}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProperty(null)}>
              Cancel
            </Button>
            <Button onClick={() => void saveProperty()} disabled={savingEntity}>
              {savingEntity ? "Saving…" : "Save property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
          </DialogHeader>
          {editProject ? (
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={String(editProject.status ?? "DRAFT")}
                  onValueChange={(v) => setEditProject((p) => (p ? { ...p, status: v } : p))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["DRAFT", "PUBLISHED", "MATCHED", "COMPLETED"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Intent</Label>
                <Select
                  value={String(editProject.intent ?? "__none__")}
                  onValueChange={(v) =>
                    setEditProject((p) => (p ? { ...p, intent: v === "__none__" ? null : v } : p))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Timeline</Label>
                <Input
                  value={String(editProject.timeline ?? "")}
                  onChange={(e) => setEditProject((p) => (p ? { ...p, timeline: e.target.value } : p))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Scope</Label>
                <Textarea
                  value={String(editProject.scope ?? "")}
                  onChange={(e) => setEditProject((p) => (p ? { ...p, scope: e.target.value } : p))}
                  rows={3}
                />
              </div>
            </div>
          ) : null}
          {entityError ? <p className="text-sm text-red-600">{entityError}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProject(null)}>
              Cancel
            </Button>
            <Button onClick={() => void saveProject()} disabled={savingEntity}>
              {savingEntity ? "Saving…" : "Save project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
