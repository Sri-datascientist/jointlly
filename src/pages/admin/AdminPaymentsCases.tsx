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
import { listAdminTransactions, updateAdminTransaction, type AdminTransactionListItem } from "@/lib/api";
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

function paymentStatusVariant(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "SUCCESS") return "success";
  if (status === "FAILED") return "danger";
  if (status === "PENDING") return "warning";
  return "neutral";
}

export default function AdminPaymentsCases() {
  const [rows, setRows] = useState<AdminTransactionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string>("");
  const [status, setStatus] = useState<string>("ALL");
  const [type, setType] = useState<string>("");
  const [q, setQ] = useState<string>("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminTransactionListItem | null>(null);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listAdminTransactions({
          limit: 200,
          user_id: userId || undefined,
          status: status === "ALL" ? undefined : status,
          type: type || undefined,
          q: q || undefined,
        });
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load transactions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, status, type, q]);

  useEffect(() => {
    if (!selectedId) return;
    const tx = rows.find((r) => r.id === selectedId) || null;
    setSelected(tx);
    setNotes(tx?.admin_notes ?? "");
  }, [selectedId, rows]);

  const resolutionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const key = r.admin_resolution_status || "(none)";
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [rows]);

  const save = async (patch: {
    admin_resolution_status?: "OPEN" | "INVESTIGATING" | "RESOLVED";
    admin_notes?: string | null;
  }) => {
    if (!selected) return;
    const updated = await updateAdminTransaction(selected.id, patch);
    setSelected(updated);
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  if (loading) return <AdminLoadingState label="Loading payment cases…" />;
  if (error) return <AdminErrorState message={error} />;

  return (
    <div className="space-y-4">
      <div className={cn(adminPanelShell, "p-4 sm:p-5")}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-[#0D3B21]">Filters</span>
          <div className="text-xs text-[#1A2E1A]/55">
            {Object.entries(resolutionCounts)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ") || "No cases"}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="border-[#1A5C35]/20 bg-white"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Order or payment ID"
            className="border-[#1A5C35]/20 bg-white"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border-[#1A5C35]/20 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Transaction type"
            className="border-[#1A5C35]/20 bg-white"
          />
        </div>
      </div>

      <AdminDataPanel toolbar={<AdminToolbarTitle label="Payment cases" count={rows.length} />}>
        <AdminTableWrap>
          <AdminTable className="min-w-[960px]">
            <AdminTableHeader>
              <AdminTableRow className="hover:bg-transparent border-0">
                <AdminTableHead className="w-[12%]">Created</AdminTableHead>
                <AdminTableHead className="w-[14%]">Type</AdminTableHead>
                <AdminTableHead className="w-[10%]">Amount</AdminTableHead>
                <AdminTableHead className="w-[10%]">Status</AdminTableHead>
                <AdminTableHead className="w-[24%]">Order / payment</AdminTableHead>
                <AdminTableHead className="w-[12%]">Resolution</AdminTableHead>
                <AdminTableHead className="w-[8%] text-right">Action</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {rows.length === 0 ? (
                <AdminTableEmpty colSpan={7} message="No transactions found." />
              ) : (
                rows.map((r) => (
                  <AdminTableRow key={r.id}>
                    <AdminTableCell muted>
                      <AdminDateTimeCell value={r.created_at} />
                    </AdminTableCell>
                    <AdminTableCell className="font-medium">{r.transaction_type}</AdminTableCell>
                    <AdminTableCell className="tabular-nums">
                      {r.amount} {r.currency}
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge status={r.status} variant={paymentStatusVariant(r.status)} />
                    </AdminTableCell>
                    <AdminTableCell muted>
                      <div className="font-mono text-xs break-all">{r.razorpay_order_id || "—"}</div>
                      <div className="font-mono text-xs text-[#1A2E1A]/45 break-all mt-0.5">
                        {r.razorpay_payment_id || "—"}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge status={r.admin_resolution_status || "—"} variant="neutral" />
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
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Transaction</DialogTitle>
          </DialogHeader>
          {!selected ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">{selected.transaction_type}</div>
                <div className="text-xs text-muted-foreground">
                  {selected.id} · {selected.status} · {selected.amount} {selected.currency}
                </div>
              </div>

              <div className="text-xs text-muted-foreground break-words">
                Order: {selected.razorpay_order_id || "—"} · Payment: {selected.razorpay_payment_id || "—"}
              </div>

              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Admin notes" />

              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md border border-[#1A5C35]/20 px-3 text-xs font-medium text-[#1A5C35] hover:bg-[#1A5C35]/8"
                  onClick={() => void save({ admin_resolution_status: "OPEN" })}
                >
                  Open
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md border border-[#1A5C35]/20 px-3 text-xs font-medium text-[#1A5C35] hover:bg-[#1A5C35]/8"
                  onClick={() => void save({ admin_resolution_status: "INVESTIGATING" })}
                >
                  Investigating
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md border border-[#1A5C35]/20 px-3 text-xs font-medium text-[#1A5C35] hover:bg-[#1A5C35]/8"
                  onClick={() => void save({ admin_resolution_status: "RESOLVED" })}
                >
                  Resolved
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md bg-[#1A5C35] px-3 text-xs font-medium text-white hover:opacity-95"
                  onClick={() => void save({ admin_notes: notes })}
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
