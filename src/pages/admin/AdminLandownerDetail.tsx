import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAdminLandownerDetail, type AdminLandownerDetail as AdminLandownerDetailType } from "@/lib/api";
import { AdminLandownerDetailView } from "@/components/admin/AdminLandownerDetailView";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/AdminTableUI";

const AdminLandownerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<AdminLandownerDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getAdminLandownerDetail(id)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <AdminLoadingState label="Loading landowner…" />;
  if (error || !detail) {
    return (
      <div>
        <AdminErrorState message={error ?? "Not found"} />
        <Link to="/admin/landowners" className="mt-4 inline-block text-sm text-[#1A5C35] hover:underline">
          Back to landowners
        </Link>
      </div>
    );
  }

  return <AdminLandownerDetailView detail={detail} onUpdated={setDetail} />;
};

export default AdminLandownerDetail;
