import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet, Search } from "lucide-react";
import { adminApi } from "../../lib/api";
import { SERVICE_OPTIONS } from "../../data/services";
import RecordDialog from "./RecordDialog";

export const STATUSES = { contacts: ["new", "in_progress", "replied", "closed", "spam"], assessments: ["in_progress", "completed", "contacted", "closed"] };
const EMPTY = { search: "", status: "", service: "", date_from: "", date_to: "", recent_days: 0, sort: "desc" };
const input = "px-3 py-2 bg-background border border-border rounded-md text-sm";

export const RecordsPanel = ({ kind }) => {
  const [f, setF] = useState(EMPTY);
  const [applied, setApplied] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false);

  const params = useCallback(() => Object.fromEntries(Object.entries(applied).filter(([, v]) => v !== "" && v !== 0)), [applied]);
  const load = useCallback(() => {
    setLoading(true);
    adminApi.list(kind, { ...params(), page, per_page: 10 }).then(setData).catch(() => toast.error("Could not load records")).finally(() => setLoading(false));
  }, [kind, page, params]);
  useEffect(load, [load]);

  const apply = (e) => { e?.preventDefault(); setPage(1); setApplied(f); };
  const openRecord = async (id) => { try { setOpen(await adminApi.get(kind, id)); } catch { toast.error("Could not open record"); } };
  const exportXlsx = async () => {
    try {
      const res = await adminApi.export(kind, params());
      const url = URL.createObjectURL(res.data);
      const a = Object.assign(document.createElement("a"), { href: url, download: `nexcare-${kind}-${new Date().toISOString().slice(0, 10)}.xlsx` });
      a.click(); URL.revokeObjectURL(url);
    } catch { toast.error("Export failed"); }
  };

  return (
    <div data-testid={`records-${kind}`}>
      <form onSubmit={apply} className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2 mb-4">
        <label className="relative xl:col-span-2"><span className="sr-only">Search</span><Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input value={f.search} onChange={(e) => setF({ ...f, search: e.target.value })} placeholder="Search name, email, phone…" data-testid={`${kind}-search`} className={`${input} pl-9 w-full`} /></label>
        <select aria-label="Status" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} data-testid={`${kind}-status-filter`} className={input}>
          <option value="">All statuses</option>{STATUSES[kind].map((s) => <option key={s}>{s}</option>)}</select>
        {kind === "contacts" && <select aria-label="Service" value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })} data-testid="contacts-service-filter" className={input}>
          <option value="">All services</option>{SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}</select>}
        <input type="date" aria-label="From date" value={f.date_from} onChange={(e) => setF({ ...f, date_from: e.target.value, recent_days: 0 })} className={input} data-testid={`${kind}-date-from`} />
        <input type="date" aria-label="To date" value={f.date_to} onChange={(e) => setF({ ...f, date_to: e.target.value })} className={input} data-testid={`${kind}-date-to`} />
        <select aria-label="Recent" value={f.recent_days} onChange={(e) => setF({ ...f, recent_days: Number(e.target.value), date_from: "" })} className={input} data-testid={`${kind}-recent`}>
          <option value={0}>Any time</option><option value={1}>Last 24 hours</option><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option></select>
        <select aria-label="Sort" value={f.sort} onChange={(e) => setF({ ...f, sort: e.target.value })} className={input} data-testid={`${kind}-sort`}>
          <option value="desc">Newest first</option><option value="asc">Oldest first</option></select>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md bg-brand text-white text-sm font-semibold" data-testid={`${kind}-apply`}>Apply</button>
          <button type="button" onClick={() => { setF(EMPTY); setApplied(EMPTY); setPage(1); }} className="px-3 py-2 rounded-md border border-border text-sm">Reset</button>
        </div>
      </form>
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-sm text-muted-foreground" data-testid={`${kind}-total`}>{data.total} record(s){loading ? " · loading…" : ""}</p>
        <button onClick={exportXlsx} data-testid={`${kind}-export`} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-brand-2 text-brand-2 text-sm font-semibold hover:bg-brand-2 hover:text-white transition-colors">
          <FileSpreadsheet className="w-4 h-4" /> Export filtered to Excel (.xlsx)
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-accent/60 text-left"><tr>{["Date", "Name", "Email", "Phone", kind === "contacts" ? "Service" : "Recommended", "Status"].map((h) => <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>
            {data.items.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No records match these filters.</td></tr>}
            {data.items.map((r) => (
              <tr key={r.id} onClick={() => openRecord(r.id)} onKeyDown={(e) => e.key === "Enter" && openRecord(r.id)} tabIndex={0} data-testid={`row-${r.id}`} className="border-t border-border hover:bg-accent/40 cursor-pointer">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{r.email}</td><td className="px-3 py-2">{r.phone}</td>
                <td className="px-3 py-2 max-w-[220px] truncate">{kind === "contacts" ? r.service : (r.recommended || []).join(", ")}</td>
                <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-xs font-semibold">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2 mt-3 text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} data-testid={`${kind}-prev`} className="px-3 py-1.5 rounded-md border border-border disabled:opacity-40">Previous</button>
        <span>Page {page} of {data.pages}</span>
        <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} data-testid={`${kind}-next`} className="px-3 py-1.5 rounded-md border border-border disabled:opacity-40">Next</button>
      </div>
      {open && <RecordDialog kind={kind} record={open} statuses={STATUSES[kind]} onClose={() => setOpen(null)} onChanged={() => { load(); adminApi.get(kind, open.id).then(setOpen).catch(() => setOpen(null)); }} />}
    </div>
  );
};

export default RecordsPanel;
