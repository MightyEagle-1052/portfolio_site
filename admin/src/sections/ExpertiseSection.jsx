import { Text, Area, Chips } from '../components/fields.jsx';
import { DOMAINS } from '../api.js';

export default function ExpertiseSection({ draft, setKey }) {
  const update = (i, patch) => setKey('domains', draft.domains.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  return (
    <section className="panel">
      <h2>Areas of expertise</h2>
      <p className="muted">The four domain cards. Colors and project tags stay fixed for each domain.</p>
      {draft.domains.map((d, i) => (
        <div className="subpanel" key={d.key}>
          <h3>{DOMAINS.find((x) => x.key === d.key)?.label ?? d.key}</h3>
          <div className="grid">
            <Text label="Title" value={d.title} onChange={(v) => update(i, { title: v })} />
            <Text label="Subtitle" value={d.short} onChange={(v) => update(i, { short: v })} />
            <Area label="Description" value={d.description} onChange={(v) => update(i, { description: v })} rows={2} />
            <Chips label="Technologies" value={d.technologies} onChange={(v) => update(i, { technologies: v })} />
          </div>
        </div>
      ))}
    </section>
  );
}
