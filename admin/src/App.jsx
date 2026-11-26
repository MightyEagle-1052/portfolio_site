import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  api,
  AuthError,
  ConflictError,
  GITHUB_TARGET,
  MODE,
  NOT_CONNECTED,
  REPO_NAME,
  SITE_URL,
  TOKEN_HELP_URL,
  getToken,
  setToken,
} from './api.js';
import ProfileSection from './sections/ProfileSection.jsx';
import ExpertiseSection from './sections/ExpertiseSection.jsx';
import SkillsSection from './sections/SkillsSection.jsx';
import { ExperienceSection, TestimonialsSection } from './sections/ExperienceSection.jsx';
import ProjectsSection from './sections/ProjectsSection.jsx';

const SECTIONS = [
  { id: 'profile', label: 'Profile & Links', icon: '👤', Component: ProfileSection },
  { id: 'expertise', label: 'Expertise', icon: '🧭', Component: ExpertiseSection },
  { id: 'skills', label: 'Skills', icon: '🛠', Component: SkillsSection },
  { id: 'experience', label: 'Experience', icon: '💼', Component: ExperienceSection },
  { id: 'testimonials', label: 'Testimonials', icon: '💬', Component: TestimonialsSection },
  { id: 'projects', label: 'Projects', icon: '🗂', Component: ProjectsSection },
];

// On static hosts (GitHub mode) there is no server to check a password, so the admin signs in with
// a GitHub token and saves by committing to the repository.
const GITHUB_MODE = MODE === 'github';

function TokenHelp() {
  return (
    <details className="help">
      <summary>How do I get a token?</summary>
      <ol>
        <li>
          <a href={TOKEN_HELP_URL} target="_blank" rel="noreferrer">
            Open GitHub&apos;s new token page
          </a>{' '}
          and sign in to GitHub if asked. The name, expiry and permission are already filled in.
        </li>
        <li>
          Under <b>Repository access</b>, choose <b>Only select repositories</b> and pick <b>{REPO_NAME}</b>.
        </li>
        <li>
          Check that <b>Contents</b> is set to <b>Read and write</b>, then click <b>Generate token</b>.
        </li>
        <li>
          Copy the token (it starts with <code>github_pat_</code>) and paste it above.
        </li>
      </ol>
      <p>The token stays in this browser and is sent only to GitHub.</p>
    </details>
  );
}

function Login({ onLogin, message }) {
  const [secret, setSecret] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(message || '');
  const [busy, setBusy] = useState(false);
  const notConnected = GITHUB_MODE && !GITHUB_TARGET;
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(secret, { remember });
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <div className="brand brand--lg">Portfolio Admin</div>
        {GITHUB_MODE ? (
          <p className="muted">
            Sign in with a GitHub token to edit your portfolio. Saving updates <b>{REPO_NAME || 'your repository'}</b> on
            GitHub, and the site updates about 1–2 minutes later.
          </p>
        ) : (
          <p className="muted">Sign in to edit your portfolio content.</p>
        )}
        {notConnected && <div className="alert">{NOT_CONNECTED}</div>}
        <input
          className="input"
          type="password"
          placeholder={GITHUB_MODE ? 'GitHub token (github_pat_…)' : 'Admin password'}
          autoComplete={GITHUB_MODE ? 'off' : 'current-password'}
          autoFocus
          disabled={notConnected}
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        {GITHUB_MODE && (
          <label className="check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me on this device
          </label>
        )}
        {error && <div className="alert">{error}</div>}
        <button className="btn btn--primary" disabled={busy || !secret.trim() || notConnected}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        {GITHUB_MODE && !notConnected && <TokenHelp />}
      </form>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [authMessage, setAuthMessage] = useState('');
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [section, setSection] = useState(() => {
    const hash = window.location.hash.slice(1);
    return SECTIONS.some((s) => s.id === hash) ? hash : 'profile';
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((text, kind = 'ok') => {
    setToast({ text, kind, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.kind === 'error' ? 6000 : 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Validate a stored token on startup.
  useEffect(() => {
    if (!getToken()) return;
    api
      .session()
      .then(({ valid }) => {
        if (!valid) {
          setToken(null);
          setAuthed(false);
        }
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const content = await api.getContent();
      setSaved(content);
      setDraft(structuredClone(content));
    } catch (err) {
      if (err instanceof AuthError) {
        setAuthMessage(err.message);
        setAuthed(false);
      } else {
        setLoadError(err.message);
      }
    }
  }, []);

  useEffect(() => {
    if (authed && !draft) load();
  }, [authed, draft, load]);

  useEffect(() => {
    window.location.hash = section;
  }, [section]);

  const dirty = useMemo(() => saved && draft && JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const save = useCallback(async () => {
    if (!draft || saving) return;
    setSaving(true);
    try {
      let result;
      try {
        result = await api.saveContent(draft);
      } catch (err) {
        if (!(err instanceof ConflictError)) throw err;
        if (!confirm(`${err.message}\n\nSave anyway?`)) {
          notify('Not saved. Your edits are still here. To get the newer content instead, reload the page.', 'error');
          return;
        }
        result = await api.saveContent(draft, { force: true });
      }
      setSaved(result.content);
      setDraft(structuredClone(result.content));
      notify(result.message || 'Saved. Your site content is updated.');
    } catch (err) {
      if (err instanceof AuthError) {
        // Keep the unsaved draft; just ask to sign in again.
        setAuthMessage(err.message);
        setAuthed(false);
      } else {
        notify(err.message, 'error');
      }
    } finally {
      setSaving(false);
    }
  }, [draft, saving, notify]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty) save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, save]);

  const discard = () => {
    if (confirm('Discard all unsaved changes?')) setDraft(structuredClone(saved));
  };

  const logout = () => {
    if (dirty && !confirm('You have unsaved changes. Log out anyway?')) return;
    setToken(null);
    setAuthed(false);
    setAuthMessage('');
    setSaved(null);
    setDraft(null);
  };

  const setKey = useCallback((key, value) => setDraft((d) => ({ ...d, [key]: value })), []);

  if (!authed) {
    return (
      <Login
        message={authMessage}
        onLogin={() => {
          setAuthed(true);
          setAuthMessage('');
        }}
      />
    );
  }

  const Active = SECTIONS.find((s) => s.id === section).Component;

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="brand">Portfolio Admin</div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={`nav-item${s.id === section ? ' is-active' : ''}`} onClick={() => setSection(s.id)}>
            <span aria-hidden>{s.icon}</span>
            {s.label}
            {s.id === 'projects' && draft && <span className="badge">{draft.projects.length}</span>}
          </button>
        ))}
        <div className="sidebar__foot">
          {GITHUB_MODE && <div className="sidebar__note">Saves to GitHub: {REPO_NAME}</div>}
          <a className="nav-item" href={SITE_URL} target="_blank" rel="noreferrer">
            ↗ View site
          </a>
          <button type="button" className="nav-item" onClick={logout}>
            ⎋ Log out
          </button>
        </div>
      </nav>

      <div className="main">
        <header className="topbar">
          <h1>{SECTIONS.find((s) => s.id === section).label}</h1>
          <div className="row">
            <span className={`status${dirty ? ' status--dirty' : ''}`}>{dirty ? 'Unsaved changes' : draft ? 'All changes saved' : ''}</span>
            <button type="button" className="btn btn--ghost" onClick={discard} disabled={!dirty || saving}>
              Discard
            </button>
            <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving} title="Ctrl+S">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </header>

        <main className="content">
          {loadError && (
            <div className="alert">
              Could not load content: {loadError}{' '}
              <button type="button" className="btn btn--small" onClick={load}>
                Retry
              </button>
            </div>
          )}
          {!draft && !loadError && <p className="muted">Loading…</p>}
          {draft && <Active draft={draft} setKey={setKey} notify={notify} />}
        </main>
      </div>

      {toast && (
        <div key={toast.id} className={`toast toast--${toast.kind}`} role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
}
