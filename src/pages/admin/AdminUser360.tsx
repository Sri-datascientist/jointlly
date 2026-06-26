import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormSubmissionPayloadView } from "@/components/admin/FormSubmissionPayloadView";
import { AdminFormSubmissionPayloadEditor } from "@/components/admin/AdminFormSubmissionPayloadEditor";
import { AdminUser360View } from "@/components/admin/AdminUser360View";
import {
  getAdminUser360,
  updateAdminSupportTicket,
  updateAdminTransaction,
  type AdminUser360Response,
  type AdminSupportTicketDetail,
  type AdminFormSubmissionListItem,
} from "@/lib/api";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/AdminTableUI";

export default function AdminUser360() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AdminUser360Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ticketNotes, setTicketNotes] = useState<Record<string, string>>({});
  const [txNotes, setTxNotes] = useState<Record<string, string>>({});
  const [inspectOpen, setInspectOpen] = useState(false);
  const [inspectTitle, setInspectTitle] = useState("Details");
  const [inspectData, setInspectData] = useState<unknown>(null);
  const [inspectFormType, setInspectFormType] = useState<string | undefined>(undefined);
  const [inspectSubmission, setInspectSubmission] = useState<AdminFormSubmissionListItem | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAdminUser360(id);
        if (cancelled) return;
        setData(res);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateTicket = async (ticketId: string, patch: { status?: string; admin_notes?: string | null }) => {
    const updated = await updateAdminSupportTicket(ticketId, patch);
    setData((prev) => {
      if (!prev) return prev;
      const nextTickets = (prev.support_tickets || []).map((t: AdminSupportTicketDetail) =>
        t.id === ticketId ? updated : t,
      );
      return { ...prev, support_tickets: nextTickets };
    });
  };

  const updateTx = async (
    txId: string,
    patch: { admin_resolution_status?: "OPEN" | "INVESTIGATING" | "RESOLVED"; admin_notes?: string | null },
  ) => {
    const updated = await updateAdminTransaction(txId, patch);
    setData((prev) => {
      if (!prev) return prev;
      const nextTxs = (prev.transactions || []).map((t) => (t.id === txId ? updated : t));
      return { ...prev, transactions: nextTxs };
    });
  };

  const openSubmissionEditor = (f: AdminFormSubmissionListItem) => {
    setInspectTitle(`Form payload · ${f.form_type}`);
    setInspectData(f.payload ?? {});
    setInspectFormType(f.form_type);
    setInspectSubmission(f);
    setInspectOpen(true);
  };

  if (loading) return <AdminLoadingState label="Loading user profile…" />;
  if (error) return <AdminErrorState message={error} />;
  if (!data) return null;

  return (
    <>
      <AdminUser360View
        data={data}
        onEditSubmission={openSubmissionEditor}
        onUpdateTicket={updateTicket}
        onUpdateTx={updateTx}
        ticketNotes={ticketNotes}
        setTicketNotes={setTicketNotes}
        txNotes={txNotes}
        setTxNotes={setTxNotes}
      />

      <Dialog open={inspectOpen} onOpenChange={setInspectOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{inspectTitle}</DialogTitle>
          </DialogHeader>
          {inspectSubmission ? (
            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4">
                <AdminFormSubmissionPayloadEditor
                  submissionId={inspectSubmission.id}
                  payload={(inspectSubmission.payload ?? {}) as Record<string, unknown>}
                  formType={inspectSubmission.form_type}
                  side={inspectSubmission.side}
                  onSaved={(next) => {
                    setInspectData(next);
                    setInspectSubmission((prev) => (prev ? { ...prev, payload: next } : prev));
                    setData((prev) =>
                      prev
                        ? {
                            ...prev,
                            form_submissions: prev.form_submissions.map((row) =>
                              row.id === inspectSubmission.id ? { ...row, payload: next } : row,
                            ),
                          }
                        : prev,
                    );
                  }}
                  onDeleted={() => {
                    setData((prev) =>
                      prev
                        ? {
                            ...prev,
                            form_submissions: prev.form_submissions.filter(
                              (row) => row.id !== inspectSubmission.id,
                            ),
                          }
                        : prev,
                    );
                    setInspectOpen(false);
                    setInspectSubmission(null);
                  }}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <FormSubmissionPayloadView payload={inspectData} formType={inspectFormType} />
              </TabsContent>
            </Tabs>
          ) : (
            <FormSubmissionPayloadView payload={inspectData} formType={inspectFormType} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
