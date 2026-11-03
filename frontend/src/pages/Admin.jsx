import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";
import { adminApi } from "../lib/api";
import { useTheme } from "../components/ThemeProvider";
import { LogoMark } from "../components/LogoMark";
import AdminLogin from "../components/admin/AdminLogin";
import AnalyticsPanel from "../components/admin/AnalyticsPanel";
import RecordsPanel from "../components/admin/RecordsPanel";

const TABS = [["overview", "Overview"], ["contacts", "Inquiries"], ["assessments", "Assessments"], ["audit", "Audit log"]];

const AuditPanel = () => {
  const [page, setPage] = useState(1);
  const [d, setD] = useState({ items: [], pages: 1 });
  useEffect(() => { adminApi.audit(page).then(setD).catch(() => {}); }, [page]);
  return (
    <div data-testid="audit-log">
      <ul className="divide-y divide-border rounded-lg border border-border text-sm">
        {d.items.map((a, i) => <li key={i} className="px-4 py-2 flex flex-wrap gap-x-4"><span className="text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span><strong>{a.actor}</strong><span>{a.action}</span><span className="text-muted-foreground truncate">{a.target}</span></li>)}
      </ul>
      <div className="flex justify-end gap-2 mt-3 text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-md border border-border disabled:opacity-40">Previous</button>
        <span>Page {page} of {d.pages}</span>
        <button disabled={page >= d.pages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-md border border-border disabled:opacity-40">Next</button>
      </div>
    </div>
  );
};

const Admin = () => {
  const [user, setUser] = useState(undefined);
  const [tab, setTab] = useState("overview");
  const { theme, toggle } = useTheme();
  useEffect(() => { adminApi.me().then(setUser).catch(() => setUser(null)); }, []);

  if (user === undefined) return <div className="min-h-screen grid place-items-center text-muted-foreground">Checking session…</div>;
  if (!user) return <AdminLogin onLogin={setUser} />;
  const logout = async () => { await adminApi.logout().catch(() => {}); setUser(null); };

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      <title>Admin dashboard | NEXCARE</title>
      <meta name="robots" content="noindex, nofollow" />
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/"><LogoMark className="h-8 w-auto" /></Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline text-muted-foreground">Signed in as <strong className="text-foreground">{user.username}</strong></span>
            <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-accent">{theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
            <button onClick={logout} data-testid="admin-logout" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border hover:border-brand"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto" role="tablist">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} data-testid={`admin-tab-${k}`}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap ${tab === k ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {tab === "overview" && <AnalyticsPanel />}
        {tab === "contacts" && <RecordsPanel kind="contacts" key="contacts" />}
        {tab === "assessments" && <RecordsPanel kind="assessments" key="assessments" />}
        {tab === "audit" && <AuditPanel />}
      </main>
    </div>
  );
};

export default Admin;
