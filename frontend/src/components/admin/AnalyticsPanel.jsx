import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Users, Eye, Mail, ClipboardList, Download, Info } from "lucide-react";
import { adminApi } from "../../lib/api";

const Stat = ({ icon: Icon, label, value, testid }) => (
  <div className="p-5 rounded-lg border border-border bg-card" data-testid={testid}>
    <Icon className="w-5 h-5 text-brand mb-2" />
    <p className="text-2xl font-display font-extrabold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const Bars = ({ title, rows, note }) => {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="p-5 rounded-lg border border-border bg-card">
      <h3 className="font-display font-bold mb-3">{title}</h3>
      {rows.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="text-sm">
            <div className="flex justify-between gap-2"><span className="truncate">{r.name}</span><span className="font-semibold">{r.count}</span></div>
            <div className="h-1.5 bg-accent rounded-full mt-1"><div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2" style={{ width: `${(r.count / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
      {note && <p className="mt-3 text-xs text-muted-foreground flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />{note}</p>}
    </div>
  );
};

export const AnalyticsPanel = () => {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { adminApi.analytics().then(setD).catch(() => setErr("Could not load analytics.")); }, []);
  if (err) return <p className="text-destructive">{err}</p>;
  if (!d) return <p className="text-muted-foreground">Loading analytics…</p>;
  const v = d.visitors;

  return (
    <div className="space-y-6" data-testid="admin-analytics">
      <p className="text-xs text-muted-foreground">Visitor metrics are measured from consented page views only (visitors who accepted analytics cookies).</p>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Stat icon={Users} label="Total unique visitors" value={v.total_unique} testid="stat-visitors" />
        <Stat icon={Eye} label="Total page views" value={v.total_pageviews} testid="stat-pageviews" />
        <Stat icon={Users} label="Today / 7d / 30d visitors" value={`${v.today} / ${v.week} / ${v.month}`} testid="stat-trend" />
        <Stat icon={Mail} label="Contact inquiries" value={d.contacts.total} testid="stat-contacts" />
        <Stat icon={ClipboardList} label="Assessments" value={d.assessments.total} testid="stat-assessments" />
        <Stat icon={Download} label="Brochure downloads (consented)" value={d.brochure_downloads} testid="stat-brochures" />
      </div>
      <div className="p-5 rounded-lg border border-border bg-card">
        <h3 className="font-display font-bold mb-3">Visitors by day (last 30 days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={d.series}>
              <defs><linearGradient id="nxg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3FB549" stopOpacity={0.5} /><stop offset="100%" stopColor="#0E4A8A" stopOpacity={0.05} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickFormatter={(s) => s.slice(5)} fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stroke="#0E4A8A" fill="url(#nxg)" strokeWidth={2} />
              <Area type="monotone" dataKey="views" stroke="#3FB549" fillOpacity={0} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Bars title="Visitors by country (page views)" rows={d.countries} note={`Approximate, IP-lookup based. ${d.geo_measured_pageviews} of ${v.total_pageviews} page views have a measured location; the rest show as "Unknown".`} />
        <Bars title="Top pages" rows={d.top_pages} />
        <Bars title="Inquiries by status" rows={d.contacts.by_status} />
        <Bars title="Assessments by status" rows={d.assessments.by_status} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Bars title="Inquiries by service" rows={d.contacts.by_service} />
        <div className="p-5 rounded-lg border border-border bg-card">
          <h3 className="font-display font-bold mb-3">Recent inquiries</h3>
          {d.recent_contacts.length === 0 ? <p className="text-sm text-muted-foreground">No inquiries yet.</p> : (
            <ul className="divide-y divide-border text-sm" data-testid="recent-inquiries">
              {d.recent_contacts.map((c) => (
                <li key={c.id} className="py-2 flex justify-between gap-3"><span className="truncate"><strong>{c.name}</strong> — {c.service}</span><span className="text-muted-foreground shrink-0">{new Date(c.created_at).toLocaleDateString()}</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
