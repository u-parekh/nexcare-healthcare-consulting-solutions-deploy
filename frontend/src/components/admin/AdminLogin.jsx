import { useState } from "react";
import { Lock } from "lucide-react";
import { adminApi } from "../../lib/api";
import { apiError } from "../../lib/validation";
import { LogoMark } from "../LogoMark";

export const AdminLogin = ({ onLogin }) => {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try { onLogin(await adminApi.login(u.trim(), p)); }
    catch (ex) { setErr(apiError(ex, "Login failed.")); setP(""); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background">
      <title>Admin login | NEXCARE</title>
      <meta name="robots" content="noindex, nofollow" />
      <form onSubmit={submit} className="w-full max-w-sm p-8 rounded-lg border border-border bg-card" data-testid="admin-login-form">
        <LogoMark className="h-10 w-auto mb-6" />
        <h1 className="font-display font-extrabold text-2xl flex items-center gap-2"><Lock className="w-5 h-5 text-brand" /> Admin sign in</h1>
        <label htmlFor="admin-user" className="block mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</label>
        <input id="admin-user" data-testid="admin-username" autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} required
          className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
        <label htmlFor="admin-pass" className="block mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
        <input id="admin-pass" type="password" data-testid="admin-password" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} required
          className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
        {err && <p role="alert" className="mt-3 text-sm text-destructive" data-testid="admin-login-error">{err}</p>}
        <button disabled={busy} data-testid="admin-login-submit" className="mt-6 w-full py-3 rounded-md bg-brand text-white font-semibold disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
};

export default AdminLogin;
