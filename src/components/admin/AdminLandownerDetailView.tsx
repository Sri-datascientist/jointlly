import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminLandownerDetail } from "@/lib/api";
import {
  AdminInlineEmpty,
  AdminStatusBadge,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminTableWrap,
  formatAdminDate,
} from "@/components/admin/AdminTableUI";
import {
  AreasServed,
  ContextRow,
  HistoryRow,
  ProfileBreadcrumb,
  ProfileHeroCard,
  ProfileSection,
  SectionLabel,
} from "@/components/admin/AdminProfileDetailUI";
import { AdminLandownerEditor } from "@/components/admin/AdminLandownerEditor";

export function AdminLandownerDetailView({
  detail,
  onUpdated,
}: {
  detail: AdminLandownerDetail;
  onUpdated?: (detail: AdminLandownerDetail) => void;
}) {
  const { profile, user_email, user_name, properties, projects } = detail;
  const displayName = user_name ?? profile.name;
  const city = profile.city ?? null;

  const areas = [
    ...new Set(
      [city, ...properties.map((p) => (p as Record<string, unknown>).city).filter(Boolean).map(String)],
    ),
  ].filter(Boolean) as string[];

  const aboutText = [
    `${displayName} is a registered landowner on Jointlly.`,
    city ? `Based in ${city}.` : null,
    profile.phone ? `Contact phone on file.` : null,
    properties.length
      ? `${properties.length} propert${properties.length === 1 ? "y" : "ies"} registered.`
      : null,
    projects.length
      ? `${projects.length} project listing${projects.length === 1 ? "" : "s"} published or in draft.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="pb-6">
      <ProfileBreadcrumb backTo="/admin/landowners" backLabel="Back to landowners" current={displayName} />

      <ProfileHeroCard
        displayName={displayName}
        subtitle={[city, `Joined ${formatAdminDate(profile.created_at)}`, user_email].filter(Boolean).join(" · ")}
        tags={
          <span className="inline-flex rounded-full bg-[#eef6f1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1A5C35]">
            Landowner
          </span>
        }
        stats={[
          { value: properties.length, label: "Properties" },
          { value: projects.length, label: "Projects" },
          { value: profile.phone ? "Yes" : "—", label: "Phone on file" },
          { value: areas.length, label: "Areas" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileSection>
            <SectionLabel>About</SectionLabel>
            <p className="text-sm leading-relaxed text-[#1A2E1A]/75">{aboutText}</p>
          </ProfileSection>

          <ProfileSection>
            <SectionLabel>Project history</SectionLabel>
            {projects.length === 0 ? (
              <AdminInlineEmpty message="No projects published yet." />
            ) : (
              <div>
                {projects.map((proj, i) => {
                  const row = proj as Record<string, unknown>;
                  return (
                    <HistoryRow
                      key={String(row.id ?? i)}
                      title={String(row.project_type ?? "Project").replace(/_/g, " ")}
                      meta={[
                        row.intent ? `Intent: ${row.intent}` : null,
                        row.timeline ? String(row.timeline) : null,
                        row.scale_tier ? String(row.scale_tier) : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Landowner listing"}
                      status={String(row.status ?? "—")}
                      accent={i % 2 === 0 ? "green" : "gold"}
                    />
                  );
                })}
              </div>
            )}
          </ProfileSection>

          <ProfileSection>
            <SectionLabel>Properties registry</SectionLabel>
            {properties.length === 0 ? (
              <AdminInlineEmpty message="No properties registered." />
            ) : (
              <AdminTableWrap>
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow className="border-0 hover:bg-transparent">
                      <AdminTableHead>City</AdminTableHead>
                      <AdminTableHead>Ward</AdminTableHead>
                      <AdminTableHead>Landmark</AdminTableHead>
                      <AdminTableHead>PID</AdminTableHead>
                      <AdminTableHead>Name</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {properties.map((prop) => {
                      const row = prop as Record<string, unknown>;
                      return (
                        <AdminTableRow key={String(row.id)}>
                          <AdminTableCell className="font-medium">{String(row.city ?? "—")}</AdminTableCell>
                          <AdminTableCell muted>{row.ward ? String(row.ward) : "—"}</AdminTableCell>
                          <AdminTableCell muted>{row.landmark ? String(row.landmark) : "—"}</AdminTableCell>
                          <AdminTableCell muted className="font-mono text-xs">
                            {row.pid_number ? String(row.pid_number) : "—"}
                          </AdminTableCell>
                          <AdminTableCell muted>{row.name ? String(row.name) : "—"}</AdminTableCell>
                        </AdminTableRow>
                      );
                    })}
                  </AdminTableBody>
                </AdminTable>
              </AdminTableWrap>
            )}
          </ProfileSection>

          {projects.length > 0 ? (
            <ProfileSection>
              <SectionLabel>Projects detail</SectionLabel>
              <AdminTableWrap>
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow className="border-0 hover:bg-transparent">
                      <AdminTableHead>Type</AdminTableHead>
                      <AdminTableHead>Status</AdminTableHead>
                      <AdminTableHead>Intent</AdminTableHead>
                      <AdminTableHead>Timeline</AdminTableHead>
                      <AdminTableHead>Scale</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {projects.map((proj) => {
                      const row = proj as Record<string, unknown>;
                      return (
                        <AdminTableRow key={String(row.id)}>
                          <AdminTableCell className="font-medium">
                            {String(row.project_type ?? "—").replace(/_/g, " ")}
                          </AdminTableCell>
                          <AdminTableCell>
                            <AdminStatusBadge status={String(row.status ?? "—")} variant="neutral" />
                          </AdminTableCell>
                          <AdminTableCell muted>{row.intent ? String(row.intent) : "—"}</AdminTableCell>
                          <AdminTableCell muted>{row.timeline ? String(row.timeline) : "—"}</AdminTableCell>
                          <AdminTableCell muted>{row.scale_tier ? String(row.scale_tier) : "—"}</AdminTableCell>
                        </AdminTableRow>
                      );
                    })}
                  </AdminTableBody>
                </AdminTable>
              </AdminTableWrap>
            </ProfileSection>
          ) : null}

          <AreasServed areas={areas} />
        </div>

        <div className="space-y-6">
          <ProfileSection>
            <h3 className="mb-1 font-semibold text-[#0D3B21]">Admin review</h3>
            <p className="mb-4 text-xs leading-relaxed text-[#1A2E1A]/55">
              Review and edit this landowner&apos;s profile, properties, and projects. Open the full user record for
              tickets, payments, and submissions.
            </p>
            <div className="space-y-2">
              {user_email ? (
                <Button className="w-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:opacity-95" asChild>
                  <a href={`mailto:${user_email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email landowner
                  </a>
                </Button>
              ) : null}
              <Button variant="outline" className="w-full border-[#1A5C35]/20 text-[#1A5C35]" asChild>
                <Link to={`/admin/users/${profile.user_id}`}>View user 360</Link>
              </Button>
            </div>
          </ProfileSection>

          <ProfileSection>
            <SectionLabel>Profile context</SectionLabel>
            <ContextRow label="Name" value={profile.name} />
            <ContextRow label="Email" value={user_email ?? "—"} />
            <ContextRow label="Phone" value={profile.phone ?? "—"} />
            <ContextRow label="City" value={profile.city ?? "—"} />
            <ContextRow label="Profile ID" value={<span className="font-mono text-xs">{profile.id}</span>} />
            <ContextRow label="User ID" value={<span className="font-mono text-xs">{profile.user_id}</span>} />
            <ContextRow label="Created" value={formatAdminDate(profile.created_at)} />
            <ContextRow label="Updated" value={formatAdminDate(profile.updated_at)} />
          </ProfileSection>

          {onUpdated ? (
            <AdminLandownerEditor
              landownerId={profile.id}
              detail={detail}
              onUpdated={onUpdated}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
