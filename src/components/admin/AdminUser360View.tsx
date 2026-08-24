import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminInlineEmpty,
  AdminRoleBadge,
  AdminStatusBadge,
  AdminTableAction,
  formatAdminDate,
} from "@/components/admin/AdminTableUI";
import type {
  AdminFormSubmissionListItem,
  AdminSupportTicketDetail,
  AdminTransactionListItem,
  AdminUser360Response,
} from "@/lib/api";
import {
  AreasServed,
  CapabilityTag,
  ContextRow,
  DetailRecordsPanel,
  HistoryRow,
  ProfileBreadcrumb,
  ProfileHeroCard,
  ProfileSection,
  SectionLabel,
  SpecialisationsList,
  capabilityLabel,
} from "@/components/admin/AdminProfileDetailUI";
import { AdminUserAccountEditor } from "@/components/admin/AdminUserAccountEditor";
import { AdminLandownerEditor } from "@/components/admin/AdminLandownerEditor";
import type { AdminLandownerDetail } from "@/lib/api";

type AdminUser360ViewProps = {
  data: AdminUser360Response;
  onEditSubmission: (submission: AdminFormSubmissionListItem) => void;
  onUpdateTicket: (ticketId: string, patch: { status?: string; assigned_to?: string | null; admin_notes?: string | null }) => void;
  onUpdateTx: (
    txId: string,
    patch: { admin_resolution_status?: "OPEN" | "INVESTIGATING" | "RESOLVED"; admin_notes?: string | null },
  ) => void;
  onUserUpdated?: (user: AdminUser360Response["user"]) => void;
  onLandownerUpdated?: (detail: AdminLandownerDetail) => void;
  ticketNotes: Record<string, string>;
  setTicketNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  txNotes: Record<string, string>;
  setTxNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  ticketAssignee: Record<string, string>;
  setTicketAssignee: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export function AdminUser360View({
  data,
  onEditSubmission,
  onUpdateTicket,
  onUpdateTx,
  onUserUpdated,
  onLandownerUpdated,
  ticketNotes,
  setTicketNotes,
  txNotes,
  setTxNotes,
  ticketAssignee,
  setTicketAssignee,
}: AdminUser360ViewProps) {
  const { user } = data;
  const prof = data.professional_profile as Record<string, unknown> | null | undefined;
  const land = data.landowner_profile as Record<string, unknown> | null | undefined;

  const displayName =
    (prof?.company_name as string) || (land?.name as string) || user.name || user.email;
  const city = (prof?.city as string) || (land?.city as string) || null;
  const experienceYears = prof?.experience_years as number | undefined;

  const capabilities = data.professional_capabilities ?? [];
  const capabilityTags = capabilities.map((c) =>
    capabilityLabel(String((c as Record<string, unknown>).capability_type ?? "")),
  );

  const areas = new Set<string>();
  if (city) areas.add(city);
  (data.professional_location_preferences ?? []).forEach((loc) => areas.add(loc));
  (data.landowner_properties ?? []).forEach((p) => {
    const c = (p as Record<string, unknown>).city;
    if (c) areas.add(String(c));
  });

  const portfolioItems = data.professional_portfolio ?? [];
  const landownerProjects = data.landowner_projects ?? [];
  const historyCount = portfolioItems.length + landownerProjects.length;

  const aboutText = (() => {
    if (prof) {
      return [
        `${displayName} is registered as a construction professional on Jointlly.`,
        experienceYears != null ? `${experienceYears} years of industry experience.` : null,
        city ? `Based in ${city}.` : null,
        prof.rera_experience ? "RERA-experienced builder." : null,
        capabilityTags.length ? `Capabilities include ${capabilityTags.join(", ")}.` : null,
      ]
        .filter(Boolean)
        .join(" ");
    }
    if (land) {
      return [
        `${displayName} is a property owner on Jointlly.`,
        city ? `Located in ${city}.` : null,
        data.landowner_properties.length
          ? `${data.landowner_properties.length} propert${data.landowner_properties.length === 1 ? "y" : "ies"} on file.`
          : null,
        landownerProjects.length
          ? `${landownerProjects.length} project listing${landownerProjects.length === 1 ? "" : "s"}.`
          : null,
      ]
        .filter(Boolean)
        .join(" ");
    }
    return `${displayName} is a ${user.role.toLowerCase()} account on Jointlly. Review activity, submissions, and platform records below.`;
  })();

  const specialisations = [
    ...capabilityTags.map((t) => `${t} partnerships`),
    ...(prof?.rera_experience ? ["RERA-compliant builds"] : []),
    ...(prof?.preferred_jv_model ? [`JV model: ${prof.preferred_jv_model}`] : []),
    ...(landownerProjects.length ? ["Landowner project listings"] : []),
  ];

  const openTickets = (data.support_tickets as AdminSupportTicketDetail[]).filter(
    (t) => t.status === "open" || t.status === "triage",
  ).length;

  const [adminOpen, setAdminOpen] = useState(openTickets > 0 || data.transactions.length > 0);

  const landownerDetailForEdit: AdminLandownerDetail | null =
    land && onLandownerUpdated && data.landowner_profile
      ? {
          profile: data.landowner_profile as AdminLandownerDetail["profile"],
          user_email: user.email,
          user_name: user.name,
          properties: data.landowner_properties as AdminLandownerDetail["properties"],
          projects: data.landowner_projects as AdminLandownerDetail["projects"],
        }
      : null;

  return (
    <div className="pb-6">
      <ProfileBreadcrumb backTo="/admin/users" backLabel="Back to users" current={displayName} />

      <ProfileHeroCard
        displayName={displayName}
        subtitle={[city, `Joined ${formatAdminDate(user.created_at)}`, experienceYears != null ? `${experienceYears} yrs experience` : null]
          .filter(Boolean)
          .join(" · ")}
        tags={
          <>
            <AdminRoleBadge role={user.role} />
            {capabilityTags.slice(0, 3).map((tag) => (
              <CapabilityTag key={tag} label={tag} />
            ))}
          </>
        }
        stats={[
          { value: historyCount, label: prof ? "Portfolio items" : "Projects" },
          { value: data.matches.length, label: "Matches" },
          { value: data.form_submissions.length, label: "Form submissions" },
          { value: data.transactions.length, label: "Transactions" },
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
            {historyCount === 0 ? (
              <AdminInlineEmpty message="No projects or portfolio items yet." />
            ) : (
              <div>
                {portfolioItems.map((p, i) => {
                  const row = p as Record<string, unknown>;
                  return (
                    <HistoryRow
                      key={String(row.id ?? i)}
                      title={String(row.project_name ?? "Portfolio project")}
                      meta={
                        [row.location ? String(row.location) : null, row.area_sqft != null ? `${row.area_sqft} sqft` : null]
                          .filter(Boolean)
                          .join(" · ") || "Professional portfolio"
                      }
                      status="Completed"
                      accent={i % 2 === 0 ? "green" : "gold"}
                    />
                  );
                })}
                {landownerProjects.map((p, i) => {
                  const row = p as Record<string, unknown>;
                  return (
                    <HistoryRow
                      key={String(row.id ?? `lp-${i}`)}
                      title={String(row.project_type ?? "Project").replace(/_/g, " ")}
                      meta={
                        [row.intent ? String(row.intent) : null, row.timeline ? String(row.timeline) : null]
                          .filter(Boolean)
                          .join(" · ") || "Landowner listing"
                      }
                      status={String(row.status ?? "—")}
                      accent={(portfolioItems.length + i) % 2 === 0 ? "green" : "gold"}
                    />
                  );
                })}
              </div>
            )}
          </ProfileSection>

          <AreasServed areas={[...areas]} />
        </div>

        <div className="space-y-6">
          <ProfileSection>
            <h3 className="mb-1 font-semibold text-[#0D3B21]">Admin review</h3>
            <p className="mb-4 text-xs leading-relaxed text-[#1A2E1A]/55">
              Full account snapshot for support, billing, and moderation.
            </p>
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:opacity-95" asChild>
                <a href={`mailto:${user.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email user
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#1A5C35]/20 text-[#1A5C35]"
                onClick={() => {
                  setAdminOpen(true);
                  setTimeout(() => {
                    document.getElementById("admin-user360-records")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Open account records
              </Button>
            </div>
            {openTickets > 0 ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {openTickets} open support ticket{openTickets === 1 ? "" : "s"} need attention.
              </p>
            ) : null}
          </ProfileSection>

          <SpecialisationsList items={specialisations} />

          <ProfileSection>
            <SectionLabel>Account context</SectionLabel>
            <ContextRow label="Email" value={user.email} />
            <ContextRow label="User ID" value={<span className="font-mono text-xs">{user.id}</span>} />
            <ContextRow label="Active" value={user.is_active ? "Yes" : "No"} />
            <ContextRow
              label="Last login"
              value={data.last_login_at ? formatAdminDate(data.last_login_at) : "Never"}
            />
            <ContextRow label="Login events" value={data.login_events?.length ?? 0} />
            {prof?.wallet_size != null ? <ContextRow label="Wallet size" value={String(prof.wallet_size)} /> : null}
            {data.professional_licenses?.length ? (
              <ContextRow label="Licenses" value={data.professional_licenses.length} />
            ) : null}
          </ProfileSection>
        </div>
      </div>

      <DetailRecordsPanel
        id="admin-user360-records"
        title="Account records & admin actions"
        open={adminOpen}
        onOpenChange={setAdminOpen}
      >
        {onUserUpdated ? (
          <AdminUserAccountEditor user={user} onUpdated={onUserUpdated} />
        ) : null}

        {landownerDetailForEdit && onLandownerUpdated ? (
          <AdminLandownerEditor
            landownerId={landownerDetailForEdit.profile.id}
            detail={landownerDetailForEdit}
            onUpdated={onLandownerUpdated}
          />
        ) : null}

        {data.login_events?.length ? (
          <ProfileSection>
            <SectionLabel>Login history</SectionLabel>
            <div className="space-y-2">
              {(data.login_events || []).map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1A5C35]/10 px-3 py-2.5 text-sm"
                >
                  <span className="text-[#1A2E1A]/75">{formatAdminDate(evt.created_at)}</span>
                  <span className="truncate text-[#0D3B21]">{evt.email}</span>
                </div>
              ))}
            </div>
          </ProfileSection>
        ) : null}

        {data.form_submissions.length > 0 ? (
          <ProfileSection>
            <SectionLabel>Form submissions</SectionLabel>
            <div className="space-y-2">
              {data.form_submissions.map((f) => (
                <div
                  key={f.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1A5C35]/10 bg-[#fafcfb] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0D3B21]">{f.form_type}</p>
                    <p className="text-xs text-[#1A2E1A]/50">
                      {f.side} · {formatAdminDate(f.created_at)}
                    </p>
                  </div>
                  {f.payload ? (
                    <AdminTableAction label="Edit payload" onClick={() => onEditSubmission(f)} />
                  ) : null}
                </div>
              ))}
            </div>
          </ProfileSection>
        ) : null}

        {(data.support_tickets as AdminSupportTicketDetail[]).length > 0 ? (
          <ProfileSection>
            <SectionLabel>Support tickets</SectionLabel>
            <div className="space-y-4">
              {(data.support_tickets as AdminSupportTicketDetail[]).map((t) => (
                <div key={t.id} className="space-y-2 rounded-xl border border-[#1A5C35]/12 bg-white p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-medium text-[#0D3B21]">{t.subject}</p>
                    <AdminStatusBadge status={t.status} variant="neutral" />
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-[#1A2E1A]/70">{t.description}</p>
                  <Input
                    value={ticketAssignee[t.id] ?? (t.assigned_to ?? "")}
                    onChange={(e) => setTicketAssignee((p) => ({ ...p, [t.id]: e.target.value }))}
                    placeholder="Assigned to (admin name or ID)"
                    className="border-[#1A5C35]/20 text-sm"
                  />
                  <Textarea
                    value={ticketNotes[t.id] ?? (t.admin_notes ?? "")}
                    onChange={(e) => setTicketNotes((p) => ({ ...p, [t.id]: e.target.value }))}
                    rows={2}
                    className="border-[#1A5C35]/20 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => void onUpdateTicket(t.id, { status: "triage" })}>
                      Triage
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void onUpdateTicket(t.id, { status: "resolved" })}>
                      Resolved
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void onUpdateTicket(t.id, { status: "closed" })}>
                      Closed
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#1A5C35]"
                      onClick={() =>
                        void onUpdateTicket(t.id, {
                          admin_notes: ticketNotes[t.id] ?? (t.admin_notes ?? ""),
                          assigned_to: ticketAssignee[t.id] ?? (t.assigned_to ?? null),
                        })
                      }
                    >
                      Save notes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ProfileSection>
        ) : null}

        {data.transactions.length > 0 ? (
          <ProfileSection>
            <SectionLabel>Payments</SectionLabel>
            <div className="space-y-4">
              {data.transactions.map((tx: AdminTransactionListItem) => (
                <div key={tx.id} className="space-y-2 rounded-xl border border-[#1A5C35]/12 bg-white p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-medium text-[#0D3B21]">
                      {tx.transaction_type} · {tx.amount} {tx.currency}
                    </p>
                    <AdminStatusBadge status={tx.status} variant="neutral" />
                  </div>
                  <p className="font-mono text-xs break-all text-[#1A2E1A]/50">
                    Order: {tx.razorpay_order_id || "—"} · Payment: {tx.razorpay_payment_id || "—"}
                  </p>
                  <Textarea
                    value={txNotes[tx.id] ?? (tx.admin_notes ?? "")}
                    onChange={(e) => setTxNotes((p) => ({ ...p, [tx.id]: e.target.value }))}
                    rows={2}
                    className="border-[#1A5C35]/20 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => void onUpdateTx(tx.id, { admin_resolution_status: "OPEN" })}>
                      Open
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void onUpdateTx(tx.id, { admin_resolution_status: "INVESTIGATING" })}>
                      Investigating
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void onUpdateTx(tx.id, { admin_resolution_status: "RESOLVED" })}>
                      Resolved
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#1A5C35]"
                      onClick={() => void onUpdateTx(tx.id, { admin_notes: txNotes[tx.id] ?? (tx.admin_notes ?? "") })}
                    >
                      Save notes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ProfileSection>
        ) : null}

        {data.matches.length > 0 ? (
          <ProfileSection>
            <SectionLabel>Matches</SectionLabel>
            <div className="space-y-2">
              {data.matches.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1A5C35]/10 px-3 py-2.5 text-sm"
                >
                  <span className="font-medium">{m.status}</span>
                  <span className="tabular-nums text-[#1A2E1A]/55">Score {m.match_score}</span>
                  <span className="w-full font-mono text-xs text-[#1A2E1A]/45 truncate">Project: {m.project_id}</span>
                </div>
              ))}
            </div>
          </ProfileSection>
        ) : null}

        {data.professional_pricing_tiers?.length ? (
          <ProfileSection>
            <SectionLabel>Pricing tiers</SectionLabel>
            <div className="space-y-2">
              {data.professional_pricing_tiers.map((pt, i) => {
                const row = pt as Record<string, unknown>;
                return (
                  <div key={String(row.id ?? i)} className="text-sm text-[#1A2E1A]/75">
                    {String(row.capability_type)} · ₹{String(row.price_per_sqft)}/sqft
                    {row.tier_name ? ` (${row.tier_name})` : ""}
                  </div>
                );
              })}
            </div>
          </ProfileSection>
        ) : null}
      </DetailRecordsPanel>
    </div>
  );
}
