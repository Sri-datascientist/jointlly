import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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
  listAdminSupportTickets,
  getAdminSupportTicket,
  updateAdminSupportTicket,
  type AdminSupportTicketListItem,
  type AdminSupportTicketDetail,
} from "@/lib/api";
import {
  AdminDataPanel,
  AdminDateTimeCell,
  AdminErrorState,
  AdminLoadingState,
  AdminStatusBadge,
  AdminTable,
  AdminTableAction,
  AdminTableBody,
  AdminTableCell,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminTableWrap,
  AdminToolbarTitle,
  adminPanelShell,
} from "@/components/admin/AdminTableUI";
import { cn } from "@/lib/utils";

function ticketStatusVariant(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "resolved" || status === "closed") return "success";
  if (status === "open") return "danger";
  return "warning";
}

export default function AdminSupportTickets() {
  const [rows, setRows] = useState<AdminSupportTicketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("ALL");
  const [userId, setUserId] = useState<string>("");
  const [q, setQ] = useState<string>("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminSupportTicketDetail | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listAdminSupportTickets({
          limit: 200,
          status: status === "ALL" ? undefined : status,
          user_id: userId || undefined,
          q: q || undefined,
        });
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load tickets");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, userId, q]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await getAdminSupportTicket(selectedId);
        if (cancelled) return;
        setSelected(detail);
        setNotes(detail.admin_notes ?? "");
        setAssignee(detail.assigned_to ?? "");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load ticket");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      map[r.status] = (map[r.status] || 0) + 1;
    });
    return map;
  }, [rows]);

  const save = async (patch: { status?: string; assigned_to?: string | null; admin_notes?: string | null }) => {
    if (!selected) return;
    const updated = await updateAdminSupportTicket(selected.id, patch);
    setSelected(updated);
    setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, status: updated.status } : r)));
  };

  if (loading) return <AdminLoadingState label="Loading support tickets…" />;
  if (error) return <AdminErrorState message={error} />;

  return (
    <div className="space-y-4">
      <div className={cn(adminPanelShell, "p-4 sm:p-5")}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold theme-heading">Filters</span>
          <div className="text-xs theme-muted">
            {Object.entries(statusCounts)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ") || "No tickets"}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border-[#1A5C35]/20 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="triage">Triage</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Filter by user ID"
            className="border-[#1A5C35]/20 bg-white"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search subject or description"
            className="border-[#1A5C35]/20 bg-white"
          />
        </div>
      </div>

      <AdminDataPanel toolbar={<AdminToolbarTitle label="Support tickets" count={rows.length} />}>
        <AdminTableWrap>
          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow className="hover:bg-transparent border-0">
                <AdminTableHead className="w-[14%]">Created</AdminTableHead>
                <AdminTableHead className="w-[10%]">Status</AdminTableHead>
                <AdminTableHead className="w-[28%]">Subject</AdminTableHead>
                <AdminTableHead className="w-[18%]">Route</AdminTableHead>
                <AdminTableHead className="w-[20%]">User</AdminTableHead>
                <AdminTableHead className="w-[10%] text-right">Action</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {rows.length === 0 ? (
                <AdminTableEmpty colSpan={6} message="No tickets found." />
              ) : (
                rows.map((r) => (
                  <AdminTableRow key={r.id}>
                    <AdminTableCell muted>
                      <AdminDateTimeCell value={r.created_at} />
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge status={r.status} variant={ticketStatusVariant(r.status)} />
                    </AdminTableCell>
                    <AdminTableCell className="font-medium max-w-0">
                      <span className="block truncate" title={r.subject}>
                        {r.subject}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell muted>{r.route || "—"}</AdminTableCell>
                    <AdminTableCell muted>
                      <span className="block truncate font-mono text-xs" title={r.user_id ?? undefined}>
                        {r.user_id || "—"}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <AdminTableAction label="Open" onClick={() => setSelectedId(r.id)} />
                    </AdminTableCell>
                  </AdminTableRow>
                ))
              )}
            </AdminTableBody>
          </AdminTable>
        </AdminTableWrap>
      </AdminDataPanel>

      <Dialog
        open={!!selectedId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setSelected(null);
            setNotes("");
            setAssignee("");
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Ticket</DialogTitle>
          </DialogHeader>
          {!selected ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">{selected.subject}</div>
                <div className="text-xs text-muted-foreground">
                  {selected.status} · {selected.route || "—"} · {selected.user_id || "—"}
                </div>
              </div>

              <div className="text-sm whitespace-pre-wrap">{selected.description}</div>

              <Input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Assigned to (admin name or ID)"
              />
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Admin notes" />

              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md border border-[#1A5C35]/20 px-3 text-xs font-medium text-[#1A5C35] hover:bg-[#1A5C35]/8"
                  onClick={() => void save({ status: "triage" })}
                >
                  Mark triage
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md border border-[#1A5C35]/20 px-3 text-xs font-medium text-[#1A5C35] hover:bg-[#1A5C35]/8"
                  onClick={() => void save({ status: "resolved" })}
                >
                  Mark resolved
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md border border-[#1A5C35]/20 px-3 text-xs font-medium text-[#1A5C35] hover:bg-[#1A5C35]/8"
                  onClick={() => void save({ status: "closed" })}
                >
                  Mark closed
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md bg-[#1A5C35] px-3 text-xs font-medium text-white hover:opacity-95"
                  onClick={() => void save({ admin_notes: notes, assigned_to: assignee || null })}
                >
                  Save notes
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
