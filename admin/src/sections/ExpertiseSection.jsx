import { Text, Area, Chips } from '../components/fields.jsx';
import { DOMAINS } from '../api.js';

export default function ExpertiseSection({ draft, setKey }) {
  const domains = draft.domains;
  const isVisible = (d) => d.visible !== false;
  const update = (i, patch) => setKey('domains', domains.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= domains.length) return;
    const next = [...domains];
    [next[i], next[j]] = [next[j], next[i]];
    setKey('domains', next);
  };
  const visibleCount = domains.filter(isVisible).length;

  return (
    <section className="panel">
      <h2>Areas of expertise</h2>
      <p className="muted">
        The order here is the priority on the site: the Expertise cards, hero chips and badges, About, Contact, Footer, stats
        and project filters all follow it. Hidden areas are removed from those lists. Projects tagged with a hidden area stay in the
        gallery. Colors and project tags stay fixed for each area.
      </p>
      {visibleCount === 0 && <div className="alert">All areas are hidden. The Expertise section on the site will be empty.</div>}

      {domains.map((d, i) => (
        <div className={`subpanel area${isVisible(d) ? '' : ' area--hidden'}`} key={d.key}>
          <div className="area__head">
            <span className="area__rank" title="Priority">
              {i + 1}
            </span>
            <h3>{DOMAINS.find((x) => x.key === d.key)?.label ?? d.key}</h3>
            {!isVisible(d) && <span className="pill">Hidden</span>}
            <div className="area__tools">
              <button type="button" className="btn btn--small btn--ghost" onClick={() => move(i, -1)} disabled={i === 0} title="Higher priority">
                ↑ Up
              </button>
              <button
                type="button"
                className="btn btn--small btn--ghost"
                onClick={() => move(i, 1)}
                disabled={i === domains.length - 1}
                title="Lower priority"
              >
                ↓ Down
              </button>
              <label className="switch" title={isVisible(d) ? 'Shown on the site' : 'Hidden from the site'}>
                <input type="checkbox" checked={isVisible(d)} onChange={(e) => update(i, { visible: e.target.checked })} />
                <span className="switch__track" aria-hidden />
                Visible on site
              </label>
            </div>
          </div>
          <div className="grid">
            <Text label="Title" value={d.title} onChange={(v) => update(i, { title: v })} />
            <Text label="Subtitle" value={d.short} onChange={(v) => update(i, { short: v })} />
            <Area label="Description" value={d.description} onChange={(v) => update(i, { description: v })} rows={2} />
            <Text
              label="Hero badge text"
              hint="Short line on this area's floating badge next to your hero photo. Leave empty for the default."
              placeholder={DOMAINS.find((x) => x.key === d.key)?.defaultHighlight}
              value={d.highlight}
              onChange={(v) => update(i, { highlight: v })}
              wide
            />
            <Chips label="Technologies" value={d.technologies} onChange={(v) => update(i, { technologies: v })} />
          </div>
        </div>
      ))}
    </section>
  );
}
