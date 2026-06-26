import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAdminUsers, type AdminUserListItem, type BackendRole } from "@/lib/api";
import {
  AdminActiveBadge,
  AdminDataPanel,
  AdminDateTimeCell,
  AdminErrorState,
  AdminLoadingState,
  AdminRoleBadge,
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
  formatAdminDate,
} from "@/components/admin/AdminTableUI";

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<BackendRole | "ALL">("ALL");

  useEffect(() => {
    let cancelled = false;
    getAdminUsers({
      role: roleFilter === "ALL" ? undefined : roleFilter,
      limit: 200,
    })
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load users");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roleFilter]);

  if (loading) return <AdminLoadingState label="Loading users…" />;
  if (error) return <AdminErrorState message={error} />;

  return (
    <AdminDataPanel
      toolbar={
        <>
          <AdminToolbarTitle label="All users" count={users.length} />
          <AdminToolbarActions>
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as BackendRole | "ALL")}
            >
              <SelectTrigger className="w-[180px] h-9 border-[#1A5C35]/20 bg-white">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="LANDOWNER">Landowner</SelectItem>
                <SelectItem value="PROFESSIONAL">Professional</SelectItem>
              </SelectContent>
            </Select>
          </AdminToolbarActions>
        </>
      }
    >
      <AdminTableWrap>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow className="hover:bg-transparent border-0">
              <AdminTableHead className="w-[28%]">Email</AdminTableHead>
              <AdminTableHead className="w-[18%]">Name</AdminTableHead>
              <AdminTableHead className="w-[12%]">Role</AdminTableHead>
              <AdminTableHead className="w-[8%] text-center">Active</AdminTableHead>
              <AdminTableHead className="w-[14%]">Last login</AdminTableHead>
              <AdminTableHead className="w-[10%]">Created</AdminTableHead>
              <AdminTableHead className="w-[10%] text-right">Action</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {users.length === 0 ? (
              <AdminTableEmpty colSpan={7} message="No users found." />
            ) : (
              users.map((u) => (
                <AdminTableRow key={u.id}>
                  <AdminTableCell className="font-medium max-w-0">
                    <span className="block truncate" title={u.email}>
                      {u.email}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className="block truncate" title={u.name}>
                      {u.name}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminRoleBadge role={u.role} />
                  </AdminTableCell>
                  <AdminTableCell className="text-center">
                    <AdminActiveBadge active={u.is_active} />
                  </AdminTableCell>
                  <AdminTableCell muted>
                    <AdminDateTimeCell value={u.last_login_at} />
                  </AdminTableCell>
                  <AdminTableCell muted>{formatAdminDate(u.created_at)}</AdminTableCell>
                  <AdminTableCell className="text-right">
                    <AdminTableAction to={`/admin/users/${u.id}`} label="View 360" />
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

export default AdminUsers;
