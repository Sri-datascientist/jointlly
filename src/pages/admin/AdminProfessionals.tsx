import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  downloadAdminProfessionalExportByRecord,
  downloadAdminProfessionalsBulkExport,
  getAdminProfessionals,
  listAdminProfessionalExports,
  type AdminBuilderExportRecord,
  type AdminProfessionalListItem,
} from "@/lib/api";
import { downloadBlob } from "@/lib/downloadFile";
import {
  AdminDataPanel,
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
  AdminToolbarActions,
  AdminToolbarTitle,
  approvalBadgeVariant,
  adminPanelShell,
} from "@/components/admin/AdminTableUI";
import { cn } from "@/lib/utils";

function saveBlob(blob: Blob, fileName: string) {
  downloadBlob(blob, fileName);
}

const AdminProfessionals = () => {
  const [list, setList] = useState<AdminProfessionalListItem[]>([]);
  const [exportsList, setExportsList] = useState<AdminBuilderExportRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulkDownloading, setBulkDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getAdminProfessionals({ limit: 200 }),
      listAdminProfessionalExports({ limit: 20 }),
    ])
      .then(([pros, exportsRows]) => {
        if (!cancelled) {
          setList(pros);
          setExportsList(exportsRows);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load professionals");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onDownloadBulk = async () => {
    setBulkDownloading(true);
    setError(null);
    try {
      const file = await downloadAdminProfessionalsBulkExport({ limit: 1000 });
      saveBlob(file.blob, file.fileName);
      const exportsRows = await listAdminProfessionalExports({ limit: 20 });
      setExportsList(exportsRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk export failed");
    } finally {
      setBulkDownloading(false);
    }
  };

  const onDownloadHistoryItem = async (exportId: string) => {
    setError(null);
    try {
      const file = await downloadAdminProfessionalExportByRecord(exportId);
      saveBlob(file.blob, file.fileName);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }
  };

  if (loading) return <AdminLoadingState label="Loading professionals…" />;
  if (error) return <AdminErrorState message={error} />;

  return (
    <div className="space-y-6">
      <AdminDataPanel
        toolbar={
          <>
            <AdminToolbarTitle label="Professional profiles" count={list.length} />
            <AdminToolbarActions>
              <Button
                onClick={onDownloadBulk}
                disabled={bulkDownloading}
                className="h-9 bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:opacity-95"
              >
                {bulkDownloading ? "Preparing…" : "Bulk Excel download"}
              </Button>
            </AdminToolbarActions>
          </>
        }
      >
        <AdminTableWrap>
          <AdminTable>
            <AdminTableHeader>
              <AdminTableRow className="hover:bg-transparent border-0">
                <AdminTableHead className="w-[22%]">Company</AdminTableHead>
                <AdminTableHead className="w-[24%]">Email</AdminTableHead>
                <AdminTableHead className="w-[12%]">City</AdminTableHead>
                <AdminTableHead className="w-[26%]">Capabilities</AdminTableHead>
                <AdminTableHead className="w-[10%]">Approval</AdminTableHead>
                <AdminTableHead className="w-[6%] text-right">Action</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {list.length === 0 ? (
                <AdminTableEmpty colSpan={6} message="No professionals found." />
              ) : (
                list.map((row) => (
                  <AdminTableRow key={row.id}>
                    <AdminTableCell className="font-medium">{row.company_name}</AdminTableCell>
                    <AdminTableCell muted>
                      <span className="block truncate" title={row.user_email ?? undefined}>
                        {row.user_email ?? "—"}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell muted>{row.city ?? "—"}</AdminTableCell>
                    <AdminTableCell>
                      <div className="flex flex-wrap gap-1">
                        {row.capability_types.map((c) => (
                          <AdminStatusBadge key={c} status={c} variant="neutral" />
                        ))}
                        {row.capability_types.length === 0 ? (
                          <span className="text-[#1A2E1A]/40">—</span>
                        ) : null}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge
                        status={row.approval_status}
                        variant={approvalBadgeVariant(row.approval_status)}
                      />
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <AdminTableAction to={`/admin/professionals/${row.id}`} />
                    </AdminTableCell>
                  </AdminTableRow>
                ))
              )}
            </AdminTableBody>
          </AdminTable>
        </AdminTableWrap>
      </AdminDataPanel>

      <div className={cn(adminPanelShell, "p-5")}>
        <h2 className="text-sm font-semibold text-[#0D3B21] mb-4">Recent export files</h2>
        {exportsList.length === 0 ? (
          <p className="text-sm text-[#1A2E1A]/55">No export history yet.</p>
        ) : (
          <div className="space-y-2">
            {exportsList.map((x) => (
              <div
                key={x.id}
                className="flex flex-col gap-3 rounded-xl border border-[#1A5C35]/12 bg-[#fafcfb] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-[#0D3B21] truncate">{x.file_name}</p>
                  <p className="text-[#1A2E1A]/55 text-xs mt-0.5">
                    {x.scope} · {x.row_count} rows · {new Date(x.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadHistoryItem(x.id)}
                  className="shrink-0 border-[#1A5C35]/20 text-[#1A5C35]"
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfessionals;
