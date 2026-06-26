import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  downloadAdminProfessionalExport,
  getAdminProfessionalDetail,
  updateAdminProfessionalApproval,
  type AdminProfessionalDetail as AdminProfessionalDetailType,
} from "@/lib/api";
import { downloadBlob } from "@/lib/downloadFile";
import { AdminProfessionalDetailView } from "@/components/admin/AdminProfessionalDetailView";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/AdminTableUI";

const AdminProfessionalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<AdminProfessionalDetailType | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [approving, setApproving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getAdminProfessionalDetail(id)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onChangeApproval = async (status: "APPROVED" | "REJECTED") => {
    if (!id || !detail) return;
    setApproving(true);
    setActionError(null);
    try {
      await updateAdminProfessionalApproval(id, { status, note: note || undefined });
      const refreshed = await getAdminProfessionalDetail(id);
      setDetail(refreshed);
      setNote("");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Approval update failed");
    } finally {
      setApproving(false);
    }
  };

  const onExport = async () => {
    if (!id) return;
    setExporting(true);
    setActionError(null);
    try {
      const file = await downloadAdminProfessionalExport(id);
      downloadBlob(file.blob, file.fileName);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <AdminLoadingState label="Loading professional…" />;
  if (loadError || !detail || !id) {
    return (
      <div>
        <AdminErrorState message={loadError ?? "Not found"} />
        <Link to="/admin/professionals" className="mt-4 inline-block text-sm text-[#1A5C35] hover:underline">
          Back to professionals
        </Link>
      </div>
    );
  }

  return (
    <AdminProfessionalDetailView
      detail={detail}
      professionalId={id}
      note={note}
      setNote={setNote}
      actionError={actionError}
      approving={approving}
      exporting={exporting}
      onApprove={() => void onChangeApproval("APPROVED")}
      onReject={() => void onChangeApproval("REJECTED")}
      onExport={() => void onExport()}
    />
  );
};

export default AdminProfessionalDetail;
