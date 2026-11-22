import { useMemo, useRef, useState } from 'react';
import { Text, Area, Chips, Lines, NumberInput, ImageField, ImageList, Thumb, Field } from '../components/fields.jsx';
import { TAGS, slugify } from '../api.js';

function uniqueId(base, projects, skipIndex) {
  const taken = new Set(projects.filter((_, i) => i !== skipIndex).map((p) => p.id));
  let id = base || 'project';
  let n = 2;
  while (taken.has(id)) id = `${base}-${n++}`;
  return id;
}

export default function ProjectsSection({ draft, setKey, notify }) {
  const projects = draft.projects;
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  // IDs of projects created in this session; their ID follows the title as you type it.
  const newIds = useRef(new Set());

  const setProjects = (next) => setKey('projects', next);
  const index = Math.min(selected, projects.length - 1);
  const current = projects[index];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => (!tagFilter || p.tags.includes(tagFilter)) && (!q || `${p.title} ${p.id}`.toLowerCase().includes(q)));
  }, [projects, query, tagFilter]);

  const duplicateIds = useMemo(() => {
    const seen = new Set();
    const dup = new Set();
    projects.forEach((p) => (seen.has(p.id) ? dup.add(p.id) : seen.add(p.id)));
    return dup;
  }, [projects]);

  const update = (patch) => setProjects(projects.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  const setTitle = (title) => {
    // Keep the id in sync with the title for brand-new projects.
    if (!newIds.current.has(current.id)) return update({ title });
    const id = uniqueId(slugify(title) || 'new-project', projects, index);
    newIds.current.delete(current.id);
    newIds.current.add(id);
    update({ title, id });
  };

  const add = () => {
    const p = {
      id: uniqueId('new-project', projects),
      title: '',
      description: '',
      image: '',
      screenshots: [],
      technologies: [],
      tags: [],
    };
    newIds.current.add(p.id);
    setProjects([...projects, p]);
    setSelected(projects.length);
    setQuery('');
    setTagFilter('');
  };

  const duplicate = () => {
    const copy = { ...structuredClone(current), id: uniqueId(`${current.id}-copy`, projects), title: `${current.title} (copy)` };
    delete copy.featuredRank;
    const next = [...projects];
    next.splice(index + 1, 0, copy);
    setProjects(next);
    setSelected(index + 1);
  };

  const remove = () => {
    if (!confirm(`Delete project "${current.title || current.id}"? (Nothing is saved until you click Save.)`)) return;
    setProjects(projects.filter((_, i) => i !== index));
    setSelected(Math.max(0, index - 1));
  };

  const move = (d) => {
    const j = index + d;
    if (j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[index], next[j]] = [next[j], next[index]];
    setProjects(next);
    setSelected(j);
  };

  const toggleTag = (tag) =>
    update({ tags: current.tags.includes(tag) ? current.tags.filter((t) => t !== tag) : [...current.tags, tag] });

  return (
    <div className="projects">
      <aside className="projects__list panel">
        <div className="projects__toolbar">
          <input className="input" placeholder={`Search ${projects.length} projects…`} value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="">All tags</option>
            {TAGS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button type="button" className="btn btn--primary" onClick={add}>
            + New project
          </button>
        </div>
        <ul>
          {visible.map(({ p, i }) => (
            <li key={`${p.id}-${i}`}>
              <button type="button" className={`plist-item${i === index ? ' is-active' : ''}`} onClick={() => setSelected(i)}>
                <Thumb src={p.image} className="thumb--sm" />
                <span className="plist-item__text">
                  <strong>{p.title || <em>Untitled</em>}</strong>
                  <small>
                    {p.featuredRank ? `★ Featured #${p.featuredRank} · ` : ''}
                    {p.tags.join(', ') || 'no tags'}
                  </small>
                </span>
                <span className="plist-item__num">{i + 1}</span>
              </button>
            </li>
          ))}
          {visible.length === 0 && <li className="muted pad">No matches.</li>}
        </ul>
      </aside>

      {current ? (
        <section className="projects__editor panel">
          <div className="editor-head">
            <h2>{current.title || 'Untitled project'}</h2>
            <div className="row">
              <button type="button" className="btn btn--small btn--ghost" onClick={() => move(-1)} disabled={index === 0} title="Move earlier">
                ↑ Up
              </button>
              <button
                type="button"
                className="btn btn--small btn--ghost"
                onClick={() => move(1)}
                disabled={index === projects.length - 1}
                title="Move later"
              >
                ↓ Down
              </button>
              <button type="button" className="btn btn--small btn--ghost" onClick={duplicate}>
                Duplicate
              </button>
              <button type="button" className="btn btn--small btn--danger" onClick={remove}>
                Delete
              </button>
            </div>
          </div>

          <div className="grid" key={index}>
            <Text label="Title" value={current.title} onChange={setTitle} />
            <Text
              label="ID (URL-safe)"
              hint={duplicateIds.has(current.id) ? '⚠ This ID is used by another project' : 'Lowercase letters, numbers and dashes'}
              value={current.id}
              onChange={(v) => {
                // Once the ID is edited by hand, stop syncing it with the title.
                newIds.current.delete(current.id);
                update({ id: v.toLowerCase().replace(/[^a-z0-9-]+/g, '-') });
              }}
            />
            <Text label="Subtitle" value={current.subtitle} onChange={(v) => update({ subtitle: v })} />
            <NumberInput
              label="Featured rank"
              hint="1 = first featured. Leave empty to not feature."
              value={current.featuredRank}
              onChange={(v) => update({ featuredRank: v })}
              allowEmpty
              min={1}
            />

            <Field label="Tags" wide>
              <div className="tag-toggles">
                {TAGS.map((t) => (
                  <label key={t} className={`tag-toggle${current.tags.includes(t) ? ' is-on' : ''}`}>
                    <input type="checkbox" checked={current.tags.includes(t)} onChange={() => toggleTag(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </Field>

            <Area label="Short description" hint="Shown on the project card" value={current.description} onChange={(v) => update({ description: v })} rows={2} />
            <Area label="Overview" hint="Shown in the project details window" value={current.overview} onChange={(v) => update({ overview: v })} rows={5} />
            <Text label="Your role" value={current.role} onChange={(v) => update({ role: v })} wide />
            <Chips label="Technologies" value={current.technologies} onChange={(v) => update({ technologies: v })} />
            <Lines label="Key features" value={current.features ?? []} onChange={(v) => update({ features: v })} />
            <Text label="Live demo URL" value={current.liveDemo} onChange={(v) => update({ liveDemo: v })} />
            <Text label="GitHub URL" value={current.github} onChange={(v) => update({ github: v })} />

            <ImageField label="Cover image" value={current.image} onChange={(v) => update({ image: v })} notify={notify} />
            <ImageList
              label={`Screenshots (${(current.screenshots ?? []).length})`}
              hint="Shown in the project details gallery, in this order."
              value={current.screenshots ?? []}
              onChange={(v) => update({ screenshots: v })}
              notify={notify}
            />
          </div>
        </section>
      ) : (
        <section className="projects__editor panel">
          <p className="muted">No projects yet. Click “New project” to add one.</p>
        </section>
      )}
    </div>
  );
}
