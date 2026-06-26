import { useState, useEffect } from "react";
import { getAdminLandowners, type AdminLandownerListItem } from "@/lib/api";
import {
  AdminDataPanel,
  AdminErrorState,
  AdminLoadingState,
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
} from "@/components/admin/AdminTableUI";

const AdminLandowners = () => {
  const [list, setList] = useState<AdminLandownerListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAdminLandowners({ limit: 200 })
      .then((data) => {
        if (!cancelled) setList(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load landowners");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <AdminLoadingState label="Loading landowners…" />;
  if (error) return <AdminErrorState message={error} />;

  return (
    <AdminDataPanel toolbar={<AdminToolbarTitle label="Landowner profiles" count={list.length} />}>
      <AdminTableWrap>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow className="hover:bg-transparent border-0">
              <AdminTableHead className="w-[22%]">Name</AdminTableHead>
              <AdminTableHead className="w-[30%]">Email</AdminTableHead>
              <AdminTableHead className="w-[18%]">City</AdminTableHead>
              <AdminTableHead className="w-[10%] text-center">Properties</AdminTableHead>
              <AdminTableHead className="w-[10%] text-center">Projects</AdminTableHead>
              <AdminTableHead className="w-[10%] text-right">Action</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {list.length === 0 ? (
              <AdminTableEmpty colSpan={6} message="No landowners found." />
            ) : (
              list.map((row) => (
                <AdminTableRow key={row.id}>
                  <AdminTableCell className="font-medium">{row.name}</AdminTableCell>
                  <AdminTableCell muted>
                    <span className="block truncate" title={row.user_email ?? undefined}>
                      {row.user_email ?? "—"}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell muted>{row.city ?? "—"}</AdminTableCell>
                  <AdminTableCell className="text-center tabular-nums">{row.property_count}</AdminTableCell>
                  <AdminTableCell className="text-center tabular-nums">{row.project_count}</AdminTableCell>
                  <AdminTableCell className="text-right">
                    <AdminTableAction to={`/admin/landowners/${row.id}`} />
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

export default AdminLandowners;
