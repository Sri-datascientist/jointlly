import { useEffect, useState } from "react";
import { getAdminConnections, type AdminConnectionRecord } from "@/lib/api";
import {
  AdminDataPanel,
  AdminDateTimeCell,
  AdminErrorState,
  AdminLoadingState,
  AdminStatusBadge,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminTableWrap,
  AdminToolbarTitle,
} from "@/components/admin/AdminTableUI";

const AdminConnections = () => {
  const [rows, setRows] = useState<AdminConnectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getAdminConnections({ limit: 200 });
        if (!active) return;
        setRows(data);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load connections");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <AdminLoadingState label="Loading connections…" />;
  if (error) return <AdminErrorState message={error} />;

  return (
    <AdminDataPanel toolbar={<AdminToolbarTitle label="Marketplace connections" count={rows.length} />}>
      <AdminTableWrap>
        <AdminTable className="min-w-[900px]">
          <AdminTableHeader>
            <AdminTableRow className="hover:bg-transparent border-0">
              <AdminTableHead className="w-[10%]">Status</AdminTableHead>
              <AdminTableHead className="w-[10%]">Selection</AdminTableHead>
              <AdminTableHead className="w-[20%]">Landowner</AdminTableHead>
              <AdminTableHead className="w-[20%]">Builder</AdminTableHead>
              <AdminTableHead className="w-[16%]">Project</AdminTableHead>
              <AdminTableHead className="w-[16%]">Payment</AdminTableHead>
              <AdminTableHead className="w-[8%]">Updated</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {rows.length === 0 ? (
              <AdminTableEmpty colSpan={7} message="No connection records found." />
            ) : (
              rows.map((r) => (
                <AdminTableRow key={r.match_id}>
                  <AdminTableCell>
                    <AdminStatusBadge status={r.status} variant="neutral" />
                  </AdminTableCell>
                  <AdminTableCell muted>{r.selection_side || "—"}</AdminTableCell>
                  <AdminTableCell>
                    <div className="font-medium text-[#0D3B21]">{r.landowner_name || "—"}</div>
                    <div className="text-xs text-[#1A2E1A]/50 truncate" title={r.landowner_email ?? undefined}>
                      {r.landowner_email || "—"}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="font-medium text-[#0D3B21]">{r.builder_company_name || "—"}</div>
                    <div className="text-xs text-[#1A2E1A]/50 truncate" title={r.builder_email ?? undefined}>
                      {r.builder_email || "—"}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="font-medium">{r.project_type || "—"}</div>
                    <div className="text-xs text-[#1A2E1A]/50">{r.project_city || "—"}</div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div>
                      <AdminStatusBadge
                        status={r.payment_status || "—"}
                        variant={r.payment_status === "SUCCESS" ? "success" : "neutral"}
                      />
                    </div>
                    <div className="text-xs text-[#1A2E1A]/50 font-mono truncate mt-1" title={r.payment_id ?? r.payment_order_id ?? undefined}>
                      {r.payment_id || r.payment_order_id || "—"}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell muted>
                    <AdminDateTimeCell value={r.updated_at} />
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminTableWrap>
    </AdminDataPanel>
  );
};

export default AdminConnections;
