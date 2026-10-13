import { useState } from "react";
import { toast } from "sonner";
import { Trash2, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { adminApi } from "../../lib/api";
import { apiError } from "../../lib/validation";

const Row = ({ k, v }) => (
  <div className="grid grid-cols-3 gap-2 py-1.5 text-sm border-b border-border/60"><span className="text-muted-foreground">{k}</span><span className="col-span-2 break-words whitespace-pre-wrap">{v || "—"}</span></div>
);

export const RecordDialog = ({ kind, record, statuses, onClose, onChanged }) => {
  const [status, setStatus] = useState(record.status);
  const [notes, setNotes] = useState(record.admin_notes || "");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (fn, msg) => {
    setBusy(true);
    try { await fn(); toast.success(msg); onChanged(); } catch (e) { toast.error(apiError(e)); } finally { setBusy(false); }
  };
  const save = () => run(() => adminApi.update(kind, record.id, { status, notes }), "Record updated");
  const remove = () => run(async () => { await adminApi.remove(kind, record.id); onClose(); }, "Record deleted");
  const retry = () => run(() => adminApi.retry(record.id), "Delivery retried — check status");
  const d = record.delivery;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="record-dialog">
        <DialogHeader>
          <DialogTitle>{record.name}</DialogTitle>
          <DialogDescription>Submitted {new Date(record.created_at).toLocaleString()} · Ref {record.id}</DialogDescription>
        </DialogHeader>
        <div>
          <Row k="Email" v={record.email} /><Row k="Phone" v={record.phone} />
          {kind === "contacts" ? (<><Row k="Service" v={record.service} /><Row k="Message" v={record.message} /></>) : (
            <><Row k="Recommended" v={(record.recommended || []).join(", ")} /><Row k="Device" v={record.device} />
              <div className="mt-3"><p className="text-sm font-semibold mb-2">Answers</p>
                <ol className="space-y-1.5 text-sm list-decimal pl-5" data-testid="record-answers">{(record.answers || []).map((a, i) => <li key={i}><span className="text-muted-foreground">{a.question}</span> — <strong>{a.answer}</strong></li>)}</ol></div></>
          )}
          {d && <Row k="Email / n8n" v={`Acknowledgement: ${d.acknowledgement?.status} · Notification: ${d.notification?.status} · n8n: ${d.n8n?.status}`} />}
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-2">
          <label className="text-sm">Status
            <select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="record-status" className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">Admin notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={2} data-testid="record-notes" className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md" />
          </label>
        </div>
        <div className="flex flex-wrap gap-2 justify-between mt-2">
          <div className="flex gap-2">
            <button onClick={() => setConfirm(true)} disabled={busy} data-testid="record-delete" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-destructive text-destructive text-sm font-semibold"><Trash2 className="w-4 h-4" /> Delete</button>
            {kind === "contacts" && <button onClick={retry} disabled={busy} data-testid="record-retry" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm font-semibold"><RefreshCw className="w-4 h-4" /> Retry emails/n8n</button>}
          </div>
          <button onClick={save} disabled={busy} data-testid="record-save" className="px-5 py-2 rounded-md bg-brand text-white text-sm font-semibold">Save changes</button>
        </div>
        <AlertDialog open={confirm} onOpenChange={setConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete this record?</AlertDialogTitle><AlertDialogDescription>This permanently removes the record. This action is logged and cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove} data-testid="record-delete-confirm">Delete</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};

export default RecordDialog;
