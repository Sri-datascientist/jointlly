import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminFormSubmissions, type AdminFormSubmissionListItem } from "@/lib/api";
import { FormSubmissionPayloadView } from "@/components/admin/FormSubmissionPayloadView";
import { AdminFormSubmissionPayloadEditor } from "@/components/admin/AdminFormSubmissionPayloadEditor";
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
  AdminToolbarActions,
  AdminToolbarTitle,
} from "@/components/admin/AdminTableUI";

const AdminFormSubmissions = () => {
  const [list, setList] = useState<AdminFormSubmissionListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sideFilter, setSideFilter] = useState<string>("ALL");
  const [formTypeFilter, setFormTypeFilter] = useState<string>("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<AdminFormSubmissionListItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminFormSubmissions({
      limit: 200,
      side: sideFilter === "ALL" ? undefined : sideFilter,
      form_type: formTypeFilter === "ALL" ? undefined : formTypeFilter,
    })
      .then((data) => {
        if (!cancelled) setList(data);
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
  }, [sideFilter, formTypeFilter]);

  if (loading) return <AdminLoadingState label="Loading form submissions…" />;
  if (error) return <AdminErrorState message={error} />;

  return (
    <>
      <AdminDataPanel
        toolbar={
          <>
            <AdminToolbarTitle label="Form submissions" count={list.length} />
            <AdminToolbarActions>
              <Select value={sideFilter} onValueChange={setSideFilter}>
                <SelectTrigger className="w-[140px] h-9 border-[#1A5C35]/20 bg-white">
                  <SelectValue placeholder="Side" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All sides</SelectItem>
                  <SelectItem value="builder">Builder</SelectItem>
                  <SelectItem value="landowner">Landowner</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                <SelectTrigger className="w-[180px] h-9 border-[#1A5C35]/20 bg-white">
                  <SelectValue placeholder="Form type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All types</SelectItem>
                  <SelectItem value="joint-venture">Joint venture</SelectItem>
                  <SelectItem value="contract-construction">Contract construction</SelectItem>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="reconstruction">Renovation/Repaint</SelectItem>
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
                <AdminTableHead className="w-[16%]">Submitted</AdminTableHead>
                <AdminTableHead className="w-[12%]">Side</AdminTableHead>
                <AdminTableHead className="w-[22%]">Form type</AdminTableHead>
                <AdminTableHead className="w-[34%]">User email</AdminTableHead>
                <AdminTableHead className="w-[16%] text-right">Action</AdminTableHead>
              </AdminTableRow>
            </AdminTableHeader>
            <AdminTableBody>
              {list.length === 0 ? (
                <AdminTableEmpty colSpan={5} message="No form submissions found." />
              ) : (
                list.map((row) => (
                  <AdminTableRow key={row.id}>
                    <AdminTableCell muted>
                      <AdminDateTimeCell value={row.created_at} />
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge status={row.side} variant="neutral" />
                    </AdminTableCell>
                    <AdminTableCell className="font-medium">{row.form_type}</AdminTableCell>
                    <AdminTableCell muted>
                      {row.user_email ?? (row.user_id ? "—" : "Anonymous")}
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      {row.payload ? (
                        <AdminTableAction
                          label="Edit payload"
                          onClick={() => setSelectedSubmission(row)}
                        />
                      ) : (
                        <span className="text-xs text-[#1A2E1A]/40">—</span>
                      )}
                    </AdminTableCell>
                  </AdminTableRow>
                ))
              )}
            </AdminTableBody>
          </AdminTable>
        </AdminTableWrap>
      </AdminDataPanel>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
          <DialogHeader className="text-left">
            <DialogTitle>Edit submission payload</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-3 rounded-md border bg-muted/20 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Form type</p>
                  <p className="text-sm font-medium">{selectedSubmission.form_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Side</p>
                  <p className="text-sm font-medium">{selectedSubmission.side}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted at</p>
                  <p className="text-sm font-medium">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                </div>
              </div>

              <Tabs defaultValue="edit">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-4">
                  <AdminFormSubmissionPayloadEditor
                    submissionId={selectedSubmission.id}
                    payload={(selectedSubmission.payload ?? {}) as Record<string, unknown>}
                    formType={selectedSubmission.form_type}
                    side={selectedSubmission.side}
                    onSaved={(next) => {
                      setSelectedSubmission((prev) => (prev ? { ...prev, payload: next } : prev));
                      setList((prev) =>
                        prev.map((row) => (row.id === selectedSubmission.id ? { ...row, payload: next } : row)),
                      );
                    }}
                    onDeleted={() => {
                      setList((prev) => prev.filter((row) => row.id !== selectedSubmission.id));
                      setSelectedSubmission(null);
                    }}
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <div className="rounded-md border p-3">
                    <FormSubmissionPayloadView
                      payload={selectedSubmission.payload}
                      formType={selectedSubmission.form_type}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminFormSubmissions;
