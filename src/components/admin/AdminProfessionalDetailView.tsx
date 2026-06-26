import { Link } from "react-router-dom";
import { Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AdminProfessionalDetail } from "@/lib/api";
import { AdminBuilderPortfolioEditor } from "@/components/admin/AdminBuilderPortfolioEditor";
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
  approvalBadgeVariant,
  formatAdminDate,
} from "@/components/admin/AdminTableUI";
import {
  AreasServed,
  CapabilityTag,
  ContextRow,
  HistoryRow,
  ProfileBreadcrumb,
  ProfileHeroCard,
  ProfileSection,
  SectionLabel,
  SpecialisationsList,
  capabilityLabel,
} from "@/components/admin/AdminProfileDetailUI";

type AdminProfessionalDetailViewProps = {
  detail: AdminProfessionalDetail;
  professionalId: string;
  note: string;
  setNote: (value: string) => void;
  actionError: string | null;
  approving: boolean;
  exporting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onExport: () => void;
};

export function AdminProfessionalDetailView({
  detail,
  professionalId,
  note,
  setNote,
  actionError,
  approving,
  exporting,
  onApprove,
  onReject,
  onExport,
}: AdminProfessionalDetailViewProps) {
  const {
    profile,
    user_email,
    user_name,
    capabilities,
    licenses,
    portfolio,
    pricing_tiers,
    location_preferences,
    approval_status,
    approval_note,
    approved_at,
    rejected_at,
    has_builder_submission,
  } = detail;

  const profileObj = profile as Record<string, unknown>;
  const displayName = String(profileObj.company_name ?? user_name ?? "Professional");
  const city = profileObj.city ? String(profileObj.city) : null;
  const experienceYears = profileObj.experience_years as number | undefined;
  const userId = profileObj.user_id ? String(profileObj.user_id) : null;

  const capabilityTags = capabilities.map((c) =>
    capabilityLabel(String((c as Record<string, unknown>).capability_type ?? "")),
  );

  const areas = [...new Set([city, ...(location_preferences ?? [])].filter(Boolean))] as string[];

  const aboutText = [
    `${displayName} is a construction professional on Jointlly.`,
    experienceYears != null ? `${experienceYears} years of experience.` : null,
    city ? `Headquartered in ${city}.` : null,
    profileObj.rera_experience ? "RERA-experienced." : null,
    capabilityTags.length ? `Registered for ${capabilityTags.join(", ")}.` : null,
    profileObj.preferred_jv_model ? `Preferred JV model: ${profileObj.preferred_jv_model}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const specialisations = [
    ...capabilities.map((c) => {
      const row = c as Record<string, unknown>;
      const desc = row.description ? ` — ${row.description}` : "";
      return `${capabilityLabel(String(row.capability_type ?? ""))}${desc}`;
    }),
    ...(profileObj.rera_experience ? ["RERA-compliant builds"] : []),
    ...(profileObj.preferred_jv_model ? [`JV model: ${profileObj.preferred_jv_model}`] : []),
    ...(profileObj.workforce_capacity != null
      ? [`Workforce capacity: ${profileObj.workforce_capacity}`]
      : []),
    ...(profileObj.current_bandwidth ? [`Current bandwidth: ${profileObj.current_bandwidth}`] : []),
  ];

  return (
    <div className="pb-6">
      <ProfileBreadcrumb backTo="/admin/professionals" backLabel="Back to professionals" current={displayName} />

      <ProfileHeroCard
        displayName={displayName}
        subtitle={[
          city,
          experienceYears != null ? `${experienceYears} yrs experience` : null,
          `Est. ${formatAdminDate(String(profileObj.created_at ?? ""))}`,
        ]
          .filter(Boolean)
          .join(" · ")}
        tags={
          <>
            <AdminStatusBadge status={approval_status} variant={approvalBadgeVariant(approval_status)} />
            {capabilityTags.map((tag) => (
              <CapabilityTag key={tag} label={tag} />
            ))}
          </>
        }
        stats={[
          { value: portfolio.length, label: "Portfolio projects" },
          { value: capabilities.length, label: "Capabilities" },
          { value: licenses.length, label: "Licenses" },
          { value: pricing_tiers.length, label: "Pricing tiers" },
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
            {portfolio.length === 0 ? (
              <AdminInlineEmpty message="No portfolio items yet." />
            ) : (
              <div>
                {portfolio.map((p, i) => {
                  const row = p as Record<string, unknown>;
                  return (
                    <HistoryRow
                      key={String(row.id ?? i)}
                      title={String(row.project_name ?? "Portfolio project")}
                      meta={[
                        row.location ? String(row.location) : null,
                        row.area_sqft != null ? `${row.area_sqft} sqft` : null,
                        row.completion_year ? `Completed ${row.completion_year}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Professional portfolio"}
                      status="Completed"
                      accent={i % 2 === 0 ? "green" : "gold"}
                    />
                  );
                })}
              </div>
            )}
          </ProfileSection>

          <ProfileSection>
            <SectionLabel>Capabilities</SectionLabel>
            {capabilities.length === 0 ? (
              <AdminInlineEmpty />
            ) : (
              <AdminTableWrap>
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow className="border-0 hover:bg-transparent">
                      <AdminTableHead>Type</AdminTableHead>
                      <AdminTableHead>Description</AdminTableHead>
                      <AdminTableHead>Added</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {capabilities.map((c) => {
                      const row = c as Record<string, unknown>;
                      return (
                        <AdminTableRow key={String(row.id)}>
                          <AdminTableCell>
                            <AdminStatusBadge
                              status={capabilityLabel(String(row.capability_type ?? ""))}
                              variant="neutral"
                            />
                          </AdminTableCell>
                          <AdminTableCell muted>{row.description ? String(row.description) : "—"}</AdminTableCell>
                          <AdminTableCell muted>
                            {row.created_at ? formatAdminDate(String(row.created_at)) : "—"}
                          </AdminTableCell>
                        </AdminTableRow>
                      );
                    })}
                  </AdminTableBody>
                </AdminTable>
              </AdminTableWrap>
            )}
          </ProfileSection>

          <ProfileSection>
            <SectionLabel>Licenses</SectionLabel>
            {licenses.length === 0 ? (
              <AdminInlineEmpty />
            ) : (
              <AdminTableWrap>
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow className="border-0 hover:bg-transparent">
                      <AdminTableHead>License number</AdminTableHead>
                      <AdminTableHead>Authority</AdminTableHead>
                      <AdminTableHead>Expiry</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {licenses.map((l) => {
                      const row = l as Record<string, unknown>;
                      return (
                        <AdminTableRow key={String(row.id)}>
                          <AdminTableCell className="font-mono text-sm font-medium">
                            {String(row.license_number)}
                          </AdminTableCell>
                          <AdminTableCell muted>
                            {row.issuing_authority ? String(row.issuing_authority) : "—"}
                          </AdminTableCell>
                          <AdminTableCell muted>
                            {row.expiry_date ? formatAdminDate(String(row.expiry_date)) : "—"}
                          </AdminTableCell>
                        </AdminTableRow>
                      );
                    })}
                  </AdminTableBody>
                </AdminTable>
              </AdminTableWrap>
            )}
          </ProfileSection>

          <ProfileSection>
            <SectionLabel>Pricing tiers</SectionLabel>
            {pricing_tiers.length === 0 ? (
              <AdminInlineEmpty />
            ) : (
              <AdminTableWrap>
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow className="border-0 hover:bg-transparent">
                      <AdminTableHead>Capability</AdminTableHead>
                      <AdminTableHead>Rate</AdminTableHead>
                      <AdminTableHead>Tier name</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {pricing_tiers.map((pt) => {
                      const row = pt as Record<string, unknown>;
                      return (
                        <AdminTableRow key={String(row.id)}>
                          <AdminTableCell>
                            <AdminStatusBadge status={String(row.capability_type)} variant="neutral" />
                          </AdminTableCell>
                          <AdminTableCell className="tabular-nums font-medium">
                            ₹{String(row.price_per_sqft)}/sqft
                          </AdminTableCell>
                          <AdminTableCell muted>{row.tier_name ? String(row.tier_name) : "—"}</AdminTableCell>
                        </AdminTableRow>
                      );
                    })}
                  </AdminTableBody>
                </AdminTable>
              </AdminTableWrap>
            )}
          </ProfileSection>

          <ProfileSection>
            <SectionLabel>Portfolio detail</SectionLabel>
            {portfolio.length === 0 ? (
              <AdminInlineEmpty />
            ) : (
              <AdminTableWrap>
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow className="border-0 hover:bg-transparent">
                      <AdminTableHead>Project</AdminTableHead>
                      <AdminTableHead>Location</AdminTableHead>
                      <AdminTableHead>Area</AdminTableHead>
                      <AdminTableHead>Year</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {portfolio.map((p) => {
                      const row = p as Record<string, unknown>;
                      return (
                        <AdminTableRow key={String(row.id)}>
                          <AdminTableCell className="font-medium">{String(row.project_name ?? "—")}</AdminTableCell>
                          <AdminTableCell muted>{row.location ? String(row.location) : "—"}</AdminTableCell>
                          <AdminTableCell muted className="tabular-nums">
                            {row.area_sqft != null ? `${row.area_sqft} sqft` : "—"}
                          </AdminTableCell>
                          <AdminTableCell muted>
                            {row.completion_year ? String(row.completion_year) : "—"}
                          </AdminTableCell>
                        </AdminTableRow>
                      );
                    })}
                  </AdminTableBody>
                </AdminTable>
              </AdminTableWrap>
            )}
          </ProfileSection>

          <AreasServed areas={areas} />

          <div className="space-y-4">
            <SectionLabel>Portfolio editor</SectionLabel>
            <AdminBuilderPortfolioEditor professionalId={professionalId} initialProfile={profileObj} />
          </div>
        </div>

        <div className="space-y-6">
          <ProfileSection>
            <h3 className="mb-1 font-semibold text-[#0D3B21]">Admin approval</h3>
            <p className="mb-4 text-xs leading-relaxed text-[#1A2E1A]/55">
              Approve or reject this professional for marketplace visibility. Export builder data for offline
              review.
            </p>
            {actionError ? (
              <p className="mb-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {actionError}
              </p>
            ) : null}
            {!has_builder_submission ? (
              <p className="mb-3 text-sm text-destructive">
                Cannot approve yet — at least one of the four builder forms must be submitted.
              </p>
            ) : null}
            <Textarea
              placeholder="Approval or rejection note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-3 border-[#1A5C35]/20"
              rows={3}
            />
            {approval_note ? (
              <p className="mb-3 text-sm text-[#1A2E1A]/55">Previous note: {approval_note}</p>
            ) : null}
            <div className="space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:opacity-95"
                onClick={onApprove}
                disabled={!has_builder_submission || approving}
              >
                {approving ? "Updating…" : "Approve professional"}
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={onReject}
                disabled={!has_builder_submission || approving}
              >
                {approving ? "Updating…" : "Reject professional"}
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#1A5C35]/20 text-[#1A5C35]"
                onClick={onExport}
                disabled={exporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {exporting ? "Preparing…" : "Download Excel"}
              </Button>
              {user_email ? (
                <Button variant="outline" className="w-full border-[#1A5C35]/20 text-[#1A5C35]" asChild>
                  <a href={`mailto:${user_email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email professional
                  </a>
                </Button>
              ) : null}
              {userId ? (
                <Button variant="outline" className="w-full border-[#1A5C35]/20 text-[#1A5C35]" asChild>
                  <Link to={`/admin/users/${userId}`}>View user 360</Link>
                </Button>
              ) : null}
            </div>
          </ProfileSection>

          <SpecialisationsList items={specialisations} />

          <ProfileSection>
            <SectionLabel>Company context</SectionLabel>
            <ContextRow label="Company" value={displayName} />
            <ContextRow label="Email" value={user_email ?? "—"} />
            <ContextRow label="Phone" value={profileObj.phone ? String(profileObj.phone) : "—"} />
            <ContextRow label="City" value={city ?? "—"} />
            <ContextRow
              label="Experience"
              value={experienceYears != null ? `${experienceYears} years` : "—"}
            />
            <ContextRow label="RERA experience" value={profileObj.rera_experience ? "Yes" : "No"} />
            <ContextRow
              label="Wallet size"
              value={profileObj.wallet_size != null ? String(profileObj.wallet_size) : "—"}
            />
            <ContextRow
              label="JV model"
              value={profileObj.preferred_jv_model ? String(profileObj.preferred_jv_model) : "—"}
            />
            <ContextRow
              label="Workforce"
              value={profileObj.workforce_capacity != null ? String(profileObj.workforce_capacity) : "—"}
            />
            <ContextRow
              label="Bandwidth"
              value={profileObj.current_bandwidth ? String(profileObj.current_bandwidth) : "—"}
            />
            <ContextRow label="Approval" value={approval_status} />
            <ContextRow label="Approved at" value={approved_at ? formatAdminDate(approved_at) : "—"} />
            <ContextRow label="Rejected at" value={rejected_at ? formatAdminDate(rejected_at) : "—"} />
            <ContextRow
              label="Builder forms"
              value={has_builder_submission ? "Submitted" : "Not submitted"}
            />
            <ContextRow
              label="Professional ID"
              value={<span className="font-mono text-xs">{professionalId}</span>}
            />
            {userId ? (
              <ContextRow label="User ID" value={<span className="font-mono text-xs">{userId}</span>} />
            ) : null}
            <ContextRow
              label="Created"
              value={profileObj.created_at ? formatAdminDate(String(profileObj.created_at)) : "—"}
            />
            <ContextRow
              label="Updated"
              value={profileObj.updated_at ? formatAdminDate(String(profileObj.updated_at)) : "—"}
            />
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
